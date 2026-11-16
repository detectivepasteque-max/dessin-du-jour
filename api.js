/* ==========================================================================
   Dessin du jour — api.js
   Appel direct à l’API d’Anthropic depuis le navigateur, avec la clé API de
   la personne. Sert hors artefact (site, fichier ouvert tel quel), là où
   window.claude n’existe pas ; dans un artefact, le réseau est fermé et ce
   fichier ne sert pas.
   La clé : saisie dans Réglages, gardée dans ce navigateur seulement (une
   clé de localStorage à part, jamais dans la progression, jamais dans un
   export, jamais envoyée ailleurs qu’à api.anthropic.com).
   DDJ.api.creerDemandeur(cle, modele) rend une fonction qui a la même forme
   que la capacité « sample » d’un artefact : claude.js s’en sert sans
   distinction.
   Requête HTTP écrite à la main (pas de SDK) : l’appli est un script
   classique ES5, sans dépendance ni étape de construction.
   ========================================================================== */

(function () {
  "use strict";

  var DDJ = window.DDJ = window.DDJ || {};

  var ADRESSE = "https://api.anthropic.com/v1/messages";
  var VERSION_API = "2026-10-21";
  var BETA_REPLI = "server-side-fallback-2026-07-01";
  var CLE_STOCKAGE = "dessin-du-jour:cle-api";
  var CLE_MODELE = "dessin-du-jour:modele-api";
  var MODELES = [
    { id: "claude-opus-5-5", nom: "Claude Opus 5.5", note: "le plus fin des trois" },
    { id: "claude-sonnet-5-5", nom: "Claude Sonnet 5.5", note: "rapide, environ deux fois moins cher" },
    { id: "claude-haiku-5-5", nom: "Claude Haiku 5.5", note: "le plus rapide et de loin le moins cher" }
  ];
  var MODELE_PAR_DEFAUT = MODELES[0].id;
  /* Les refus pour raison de sécurité peuvent être repris par un autre modèle
     côté serveur ; Claude Haiku 5.5 n’a pas ce repli. */
  var AVEC_REPLI = { "claude-opus-5-5": true, "claude-sonnet-5-5": true };
  var MAX_JETONS = 16000;
  var COTE_MAX_IMAGE = 1568;     /* pixels : au-delà, l’image coûte plus sans mieux se lire */
  var TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"];

  var memoire = { cle: "", modele: "" }; /* repli quand localStorage est indisponible */

  /* ------------------------------------------------------------------ */
  /* Clé et modèle gardés dans le navigateur                             */
  /* ------------------------------------------------------------------ */

  function magasin() {
    try {
      return window.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function lire(nom, repli) {
    var m = magasin();
    var valeur;
    if (m) {
      try {
        valeur = m.getItem(nom);
        if (typeof valeur === "string" && valeur !== "") {
          return valeur;
        }
      } catch (e) { /* on retombe sur la mémoire */ }
    }
    return repli;
  }

  function ecrire(nom, valeur) {
    var m = magasin();
    if (!m) {
      return false;
    }
    try {
      if (valeur === "") {
        m.removeItem(nom);
      } else {
        m.setItem(nom, valeur);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function modeleConnu(id) {
    var i;
    for (i = 0; i < MODELES.length; i++) {
      if (MODELES[i].id === id) {
        return true;
      }
    }
    return false;
  }

  function lireCle() {
    return lire(CLE_STOCKAGE, memoire.cle);
  }

  /* Une clé plausible : un seul mot, sans espace, de longueur raisonnable. */
  function clePlausible(cle) {
    return typeof cle === "string" && /^[A-Za-z0-9_\-]{20,400}$/.test(cle);
  }

  /* Range la clé (ou la retire, avec ""). Renvoie vrai si elle est gardée au-delà de la visite. */
  function ecrireCle(cle) {
    memoire.cle = cle;
    return ecrire(CLE_STOCKAGE, cle);
  }

  function lireModele() {
    var id = lire(CLE_MODELE, memoire.modele);
    return modeleConnu(id) ? id : MODELE_PAR_DEFAUT;
  }

  function ecrireModele(id) {
    if (!modeleConnu(id)) {
      return;
    }
    memoire.modele = id;
    ecrire(CLE_MODELE, id);
  }

  /* ------------------------------------------------------------------ */
  /* Image : réduite et encodée pour la requête                          */
  /* ------------------------------------------------------------------ */

  function refus(code, message, texte) {
    var erreur = { code: code, message: message || code };
    if (typeof texte === "string" && texte !== "") {
      erreur.text = texte;
    }
    return erreur;
  }

  /* Blob ou fichier image -> { media_type, data } (base64), au plus
     COTE_MAX_IMAGE de côté. Une photo de téléphone pèse plusieurs mégaoctets :
     on la redessine plus petite, en JPEG. */
  function preparerImage(blob) {
    return new Promise(function (resoudre, rejeter) {
      var fabrique = window.URL || window.webkitURL;
      var image = new window.Image();
      var url;
      if (!blob || typeof blob.size !== "number" || blob.size === 0 || !fabrique) {
        rejeter(refus("image_rejected", "image vide ou illisible"));
        return;
      }
      url = fabrique.createObjectURL(blob);
      image.onload = function () {
        var largeur = image.naturalWidth || image.width;
        var hauteur = image.naturalHeight || image.height;
        var rapport = Math.min(1, COTE_MAX_IMAGE / Math.max(largeur, hauteur, 1));
        var toile = document.createElement("canvas");
        var c, donnees;
        try {
          fabrique.revokeObjectURL(url);
          toile.width = Math.max(1, Math.round(largeur * rapport));
          toile.height = Math.max(1, Math.round(hauteur * rapport));
          c = toile.getContext("2d");
          /* Fond blanc : une image à fond transparent ne doit pas sortir noire en JPEG. */
          c.fillStyle = "#ffffff";
          c.fillRect(0, 0, toile.width, toile.height);
          c.drawImage(image, 0, 0, toile.width, toile.height);
          donnees = toile.toDataURL("image/jpeg", 0.9);
          resoudre({ media_type: "image/jpeg", data: donnees.slice(donnees.indexOf(",") + 1) });
        } catch (e) {
          rejeter(refus("image_rejected", "image impossible à préparer"));
        }
      };
      image.onerror = function () {
        try {
          fabrique.revokeObjectURL(url);
        } catch (e) { /* ignoré */ }
        rejeter(refus("image_rejected", "image illisible"));
      };
      image.src = url;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Requête et lecture du flux                                          */
  /* ------------------------------------------------------------------ */

  /* Traduit une réponse d’erreur de l’API en code que l’appli sait dire. */
  function erreurHttp(statut, corps) {
    var type = "";
    var message = "";
    var objet;
    try {
      objet = JSON.parse(corps);
      if (objet && objet.error) {
        type = String(objet.error.type || "");
        message = String(objet.error.message || "");
      }
    } catch (e) { /* corps illisible : le statut suffit */ }
    if (statut === 401 || type === "authentication_error") {
      return refus("cle_refusee", message);
    }
    if (statut === 402 || type === "billing_error" || /credit balance/i.test(message)) {
      return refus("credit_insuffisant", message);
    }
    if (statut === 403 || type === "permission_error") {
      return refus("acces_refuse", message);
    }
    if (statut === 404 || type === "not_found_error") {
      return refus("modele_introuvable", message);
    }
    if (statut === 413 || type === "request_too_large") {
      return refus("prompt_too_large", message);
    }
    if (statut === 429 || type === "rate_limit_error") {
      return refus("rate_limited", message);
    }
    if (statut >= 500 || type === "overloaded_error" || type === "api_error") {
      return refus("upstream_error", message);
    }
    return refus("requete_refusee", message || ("HTTP " + statut));
  }

  /* Lit les événements du flux (texte « data: {...} » séparé par des lignes
     vides) et tient le compte du texte reçu. */
  function creerLecteur(surTexte) {
    var reste = "";
    var etat = { texte: "", fin: "", erreur: null };

    function evenement(bloc) {
      var lignes = bloc.split("\n");
      var donnees = "";
      var i, objet, delta;
      for (i = 0; i < lignes.length; i++) {
        if (lignes[i].indexOf("data:") === 0) {
          donnees += lignes[i].slice(5).replace(/^ /, "");
        }
      }
      if (donnees === "") {
        return;
      }
      try {
        objet = JSON.parse(donnees);
      } catch (e) {
        return;
      }
      if (!objet || typeof objet !== "object") {
        return;
      }
      if (objet.type === "content_block_delta" && objet.delta && objet.delta.type === "text_delta" &&
          typeof objet.delta.text === "string" && objet.delta.text !== "") {
        delta = objet.delta.text;
        etat.texte += delta;
        /* Rien n’est montré tant que le texte n’a que des blancs. */
        if (typeof surTexte === "function" && /\S/.test(etat.texte)) {
          try {
            surTexte({ text: etat.texte, delta: delta });
          } catch (e2) { /* une erreur d’affichage ne coupe pas la lecture */ }
        }
      } else if (objet.type === "message_delta" && objet.delta && typeof objet.delta.stop_reason === "string") {
        etat.fin = objet.delta.stop_reason;
      } else if (objet.type === "error" && objet.error) {
        etat.erreur = erreurHttp(objet.error.type === "overloaded_error" ? 529 : 500,
          JSON.stringify({ error: objet.error }));
      }
    }

    return {
      etat: etat,
      recevoir: function (morceau) {
        var coupe;
        reste += morceau.replace(/\r\n/g, "\n");
        coupe = reste.indexOf("\n\n");
        while (coupe !== -1) {
          evenement(reste.slice(0, coupe));
          reste = reste.slice(coupe + 2);
          coupe = reste.indexOf("\n\n");
        }
      },
      finir: function () {
        if (reste.replace(/\s+/g, "") !== "") {
          evenement(reste);
        }
        reste = "";
      }
    };
  }

  /* Lit tout le corps de la réponse, au fil de l’eau quand le navigateur le permet. */
  function lireFlux(reponse, lecteurFlux) {
    var corps = reponse.body;
    var source, decodeur;
    if (!corps || typeof corps.getReader !== "function" || typeof window.TextDecoder !== "function") {
      return reponse.text().then(function (tout) {
        lecteurFlux.recevoir(tout);
        lecteurFlux.finir();
      });
    }
    source = corps.getReader();
    decodeur = new window.TextDecoder("utf-8");
    function suite() {
      return source.read().then(function (lot) {
        if (lot.done) {
          lecteurFlux.recevoir(decodeur.decode());
          lecteurFlux.finir();
          return null;
        }
        lecteurFlux.recevoir(decodeur.decode(lot.value, { stream: true }));
        return suite();
      });
    }
    return suite();
  }

  function envoyer(cle, corps, avecRepli, signal) {
    var enTetes = {
      "content-type": "application/json",
      "x-api-key": cle,
      "anthropic-version": VERSION_API,
      /* Sans cet en-tête, l’API refuse les appels venus d’une page web. */
      "anthropic-dangerous-direct-browser-access": "true"
    };
    if (avecRepli) {
      enTetes["anthropic-beta"] = BETA_REPLI;
    }
    return window.fetch(ADRESSE, {
      method: "POST",
      headers: enTetes,
      body: JSON.stringify(corps),
      signal: signal,
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer"
    });
  }

  /* Une demande complète : résout { text, truncated }, rejette { code, message, text? }. */
  function demander(cle, modele, entree, options) {
    var opts = options || {};
    var signal = opts.signal;

    function annulee() {
      return !!(signal && signal.aborted);
    }

    function lancer(image, avecRepli) {
      var contenu = [];
      var corps, lecteurFlux;
      if (image) {
        contenu.push({ type: "image", source: { type: "base64", media_type: image.media_type, data: image.data } });
      }
      contenu.push({ type: "text", text: entree });
      corps = {
        model: modele,
        max_tokens: MAX_JETONS,
        stream: true,
        output_config: { effort: "medium" },
        messages: [{ role: "user", content: contenu }]
      };
      if (avecRepli) {
        corps.fallbacks = "default";
      }
      lecteurFlux = creerLecteur(opts.onText);
      return envoyer(cle, corps, avecRepli, signal).then(function (reponse) {
        if (!reponse.ok) {
          return reponse.text().then(function (texte) {
            /* Le repli côté serveur est une fonction en bêta : s’il est refusé
               ici, la même demande repart une fois sans lui. */
            if (avecRepli && reponse.status === 400 && /fallback|anthropic-beta|beta/i.test(texte)) {
              return lancer(image, false);
            }
            throw erreurHttp(reponse.status, texte);
          });
        }
        return lireFlux(reponse, lecteurFlux).then(function () {
          var etat = lecteurFlux.etat;
          if (etat.erreur) {
            if (etat.texte !== "") {
              etat.erreur.text = etat.texte;
            }
            throw etat.erreur;
          }
          if (etat.fin === "refusal") {
            throw refus("refused", "demande déclinée");
          }
          if (!/\S/.test(etat.texte)) {
            throw refus("empty_completion", "réponse vide");
          }
          return { text: etat.texte, truncated: etat.fin === "max_tokens" };
        });
      });
    }

    return new Promise(function (resoudre, rejeter) {
      var image = opts.images;
      var preparation;
      if (typeof entree !== "string" || entree === "") {
        rejeter(refus("invalid_request", "demande vide"));
        return;
      }
      if (annulee()) {
        rejeter(refus("cancelled", "demande arrêtée"));
        return;
      }
      /* Une seule image par demande (la première d’une liste). */
      if (image && typeof image.size !== "number" && typeof image.length === "number") {
        image = image[0];
      }
      preparation = image ? preparerImage(image) : Promise.resolve(null);
      preparation.then(function (prete) {
        if (annulee()) {
          throw refus("cancelled", "demande arrêtée");
        }
        return lancer(prete, AVEC_REPLI[modele] === true);
      }).then(resoudre, function (erreur) {
        if (annulee() || (erreur && erreur.name === "AbortError")) {
          rejeter(refus("cancelled", "demande arrêtée"));
        } else if (erreur && typeof erreur.code === "string") {
          rejeter(erreur);
        } else {
          /* fetch a échoué avant toute réponse : pas de réseau, ou appel bloqué. */
          rejeter(refus("reseau", erreur && erreur.message ? String(erreur.message) : "réseau"));
        }
      });
    });
  }

  /* Trouve une valeur JSON dans une réponse : la réponse entière, sinon le
     contenu d’un bloc de code, sinon de la première accolade ou du premier
     crochet au dernier. */
  function lireJson(texte) {
    var essais = [texte];
    var bloc = /```(?:json)?\s*([\s\S]*?)```/.exec(texte);
    var debut = texte.search(/[\[{]/);
    var fin = Math.max(texte.lastIndexOf("}"), texte.lastIndexOf("]"));
    var i;
    if (bloc) {
      essais.push(bloc[1]);
    }
    if (debut !== -1 && fin > debut) {
      essais.push(texte.slice(debut, fin + 1));
    }
    for (i = 0; i < essais.length; i++) {
      try {
        return { ok: true, valeur: JSON.parse(essais[i]) };
      } catch (e) { /* essai suivant */ }
    }
    return { ok: false };
  }

  /* La fonction que claude.js utilise, de même forme que la capacité « sample ». */
  function creerDemandeur(cle, modele) {
    var choisi = modeleConnu(modele) ? modele : MODELE_PAR_DEFAUT;
    var fonction = function (entree, options) {
      return demander(cle, choisi, entree, options);
    };
    fonction.json = function (entree, options) {
      return demander(cle, choisi, entree, options).then(function (reponse) {
        var lu = reponse.truncated ? { ok: false } : lireJson(reponse.text);
        if (!lu.ok) {
          throw refus("invalid_json", "réponse sans JSON lisible", reponse.text);
        }
        return lu.valeur;
      });
    };
    fonction.limits = function () {
      return Promise.resolve({ images: { maxCount: 1, mediaTypes: TYPES_IMAGE.slice() } });
    };
    return fonction;
  }

  DDJ.api = {
    MODELES: MODELES,
    MODELE_PAR_DEFAUT: MODELE_PAR_DEFAUT,
    possible: function () {
      return typeof window.fetch === "function" && typeof window.Promise === "function" &&
        typeof window.AbortController === "function";
    },
    lireCle: lireCle,
    ecrireCle: ecrireCle,
    clePlausible: clePlausible,
    lireModele: lireModele,
    ecrireModele: ecrireModele,
    creerDemandeur: creerDemandeur
  };
})();
