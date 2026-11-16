/* ==========================================================================
   Dessin du jour — croquis.js
   La feuille de dessin à l’écran (écran « Dessiner », ancre #dessiner) :
   stylet avec pression, souris ou doigt ; crayon, encre, gomme ; annuler,
   rétablir, tout effacer ; agrandir ; enregistrer l’image.
   Le dessin est gardé sous forme de traits (des points et leur pression),
   jamais d’image : c’est ce qui permet d’annuler, de redessiner net à toute
   taille, et de garder le dessin en cours d’une visite à l’autre.
   Script classique ES5, sans dépendance. Rien n’est envoyé nulle part : c’est
   claude.js qui, sur demande, montre l’image à Claude.
   ========================================================================== */

(function () {
  "use strict";

  var DDJ = window.DDJ = window.DDJ || {};
  var app = DDJ.app;
  var doc = document;

  if (!app) {
    return;
  }

  /* La feuille mesure toujours 1600 × 1200 « unités » : les traits sont notés
     dans ce repère, quelle que soit la taille à l’écran. */
  var LARGEUR = 1600;
  var HAUTEUR = 1200;
  var PAPIER = "#fbf7ee";
  var COULEURS = { crayon: "#4a443d", encre: "#1c1916", gomme: PAPIER };
  /* Épaisseurs (fin, moyen, épais) en unités de la feuille. */
  var EPAISSEURS = { crayon: [3, 6, 12], encre: [2.5, 5, 10], gomme: [18, 40, 80] };
  var CLE_BROUILLON = "dessin-du-jour:croquis";
  var MAX_BROUILLON = 3000000;    /* caractères : au-delà, le brouillon n’est plus gardé */
  var MAX_POINTS_ECRAN = 2400;    /* largeur maximale de la toile, en points de l’écran */
  var ECART_MIN = 0.7;            /* unités : deux points plus proches sont confondus */

  var IDS = [
    "vue-dessiner", "croquis", "croquis-sujet", "croquis-outils", "croquis-tailles",
    "btn-croquis-annuler", "btn-croquis-retablir", "btn-croquis-effacer",
    "croquis-minuteur", "btn-croquis-minuteur", "btn-croquis-agrandir",
    "croquis-feuille", "croquis-toile", "btn-croquis-fait", "btn-croquis-image",
    "croquis-message", "croquis-aide",
    "minuteur-temps", "btn-demarrer", "btn-pause", "btn-reprendre"
  ];

  var el = {};
  var pret = false;
  var ctx = null;                 /* contexte 2D de la toile */
  var echelle = 1;                /* points de la toile par unité de la feuille */
  var traits = [];                /* [ { o: outil, t: épaisseur, p: [x, y, pression, x, y, pression, ...] } ] */
  var defaits = [];               /* traits annulés, pour « Rétablir » */
  var enCours = null;             /* trait en train d’être tracé */
  var pointeur = null;            /* identifiant du pointeur qui trace */
  var outil = "crayon";
  var taille = 1;                 /* 0, 1 ou 2 */
  var styletVu = false;           /* vrai dès qu’un stylet a servi : le doigt ne trace plus */
  var plein = false;
  var minuterieBrouillon = null;
  var brouillonPlein = false;     /* vrai quand le dessin est trop lourd pour être gardé */

  /* ------------------------------------------------------------------ */
  /* Petites aides                                                       */
  /* ------------------------------------------------------------------ */

  function nomCamel(id) {
    return id.replace(/-([a-z])/g, function (tout, lettre) {
      return lettre.toUpperCase();
    });
  }

  function texte(element, valeur) {
    if (element.textContent !== valeur) {
      element.textContent = valeur;
    }
  }

  function arrondi(v, decimales) {
    var f = decimales === 2 ? 100 : 10;
    return Math.round(v * f) / f;
  }

  function dire(message, estErreur) {
    el.croquisMessage.className = estErreur ? "message message-erreur" : "message";
    texte(el.croquisMessage, message);
  }

  function magasin() {
    try {
      return window.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Tracé                                                               */
  /* ------------------------------------------------------------------ */

  function epaisseur(trait, pression) {
    if (trait.o === "gomme") {
      return trait.t;
    }
    if (trait.o === "encre") {
      return trait.t * (0.7 + 0.6 * pression);
    }
    return trait.t * (0.3 + 1.3 * pression);
  }

  function preparer(c, k, trait, pression) {
    c.strokeStyle = COULEURS[trait.o] || COULEURS.crayon;
    c.fillStyle = c.strokeStyle;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = Math.max(0.5, epaisseur(trait, pression) * k);
  }

  /* Dessine le morceau du trait qui arrive au point n° i (i >= 1) : une courbe
     qui va du milieu du segment précédent au milieu du segment i, en passant
     près du point i - 1. Les morceaux se raccordent sans angle. */
  function morceau(c, k, trait, i) {
    var p = trait.p;
    var ax = p[(i - 1) * 3], ay = p[(i - 1) * 3 + 1], ap = p[(i - 1) * 3 + 2];
    var bx = p[i * 3], by = p[i * 3 + 1];
    var dx, dy;
    preparer(c, k, trait, ap);
    c.beginPath();
    if (i === 1) {
      c.moveTo(ax * k, ay * k);
    } else {
      dx = (p[(i - 2) * 3] + ax) / 2;
      dy = (p[(i - 2) * 3 + 1] + ay) / 2;
      c.moveTo(dx * k, dy * k);
    }
    c.quadraticCurveTo(ax * k, ay * k, (ax + bx) / 2 * k, (ay + by) / 2 * k);
    c.stroke();
  }

  /* Termine le trait : un point seul devient une pastille, sinon le dernier
     demi-segment est tiré jusqu’au dernier point. */
  function bout(c, k, trait) {
    var p = trait.p;
    var n = p.length / 3;
    var x = p[(n - 1) * 3], y = p[(n - 1) * 3 + 1], pr = p[(n - 1) * 3 + 2];
    preparer(c, k, trait, pr);
    c.beginPath();
    if (n === 1) {
      c.arc(x * k, y * k, Math.max(0.5, epaisseur(trait, pr) * k / 2), 0, Math.PI * 2);
      c.fill();
      return;
    }
    c.moveTo((p[(n - 2) * 3] + x) / 2 * k, (p[(n - 2) * 3 + 1] + y) / 2 * k);
    c.lineTo(x * k, y * k);
    c.stroke();
  }

  function tracerTrait(c, k, trait) {
    var n = trait.p.length / 3;
    var i;
    for (i = 1; i < n; i++) {
      morceau(c, k, trait, i);
    }
    if (n > 0) {
      bout(c, k, trait);
    }
  }

  /* Redessine toute la feuille sur « c » à l’échelle k. */
  function peindre(c, k) {
    var i;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = PAPIER;
    c.fillRect(0, 0, Math.ceil(LARGEUR * k), Math.ceil(HAUTEUR * k));
    for (i = 0; i < traits.length; i++) {
      tracerTrait(c, k, traits[i]);
    }
    if (enCours) {
      tracerTrait(c, k, enCours);
    }
  }

  function redessiner() {
    if (ctx) {
      peindre(ctx, echelle);
    }
  }

  /* Met la toile à la taille de sa place à l’écran (rapport 4:3 gardé), avec
     assez de points pour rester nette, puis redessine. */
  function ajuster() {
    var feuille = el.croquisFeuille;
    var toile = el.croquisToile;
    var largeurDispo, hauteurDispo, largeur, hauteur, points, densite;
    if (!pret || el.vueDessiner.hidden) {
      return;
    }
    largeurDispo = feuille.clientWidth;
    if (plein) {
      hauteurDispo = feuille.clientHeight;
    } else {
      /* Dans la page : la feuille doit tenir à l’écran avec sa barre d’outils. */
      hauteurDispo = Math.max(240, Math.round((window.innerHeight || 800) * 0.72));
    }
    if (largeurDispo <= 0) {
      return;
    }
    largeur = Math.min(largeurDispo, Math.round(hauteurDispo * LARGEUR / HAUTEUR));
    hauteur = Math.round(largeur * HAUTEUR / LARGEUR);
    toile.style.width = largeur + "px";
    toile.style.height = hauteur + "px";
    densite = window.devicePixelRatio || 1;
    points = Math.max(320, Math.min(MAX_POINTS_ECRAN, Math.round(largeur * densite)));
    if (toile.width !== points) {
      toile.width = points;
      toile.height = Math.round(points * HAUTEUR / LARGEUR);
    }
    echelle = toile.width / LARGEUR;
    redessiner();
  }

  /* ------------------------------------------------------------------ */
  /* Brouillon gardé dans le navigateur                                  */
  /* ------------------------------------------------------------------ */

  function traitValide(t) {
    var i;
    if (!t || typeof t !== "object" || !EPAISSEURS[t.o] || typeof t.t !== "number" || !(t.t > 0) || t.t > 200 ||
        Object.prototype.toString.call(t.p) !== "[object Array]" || t.p.length < 3 || t.p.length % 3 !== 0) {
      return false;
    }
    for (i = 0; i < t.p.length; i++) {
      if (typeof t.p[i] !== "number" || !isFinite(t.p[i])) {
        return false;
      }
    }
    return true;
  }

  function lireBrouillon() {
    var m = magasin();
    var brut, objet, i, lus;
    if (!m) {
      return;
    }
    try {
      brut = m.getItem(CLE_BROUILLON);
      objet = brut ? JSON.parse(brut) : null;
    } catch (e) {
      return;
    }
    if (!objet || objet.v !== 1 || Object.prototype.toString.call(objet.traits) !== "[object Array]") {
      return;
    }
    lus = [];
    for (i = 0; i < objet.traits.length; i++) {
      if (traitValide(objet.traits[i])) {
        lus.push({ o: objet.traits[i].o, t: objet.traits[i].t, p: objet.traits[i].p });
      }
    }
    traits = lus;
  }

  function ecrireBrouillon() {
    var m = magasin();
    var brut;
    minuterieBrouillon = null;
    if (!m) {
      return;
    }
    try {
      if (traits.length === 0) {
        m.removeItem(CLE_BROUILLON);
        brouillonPlein = false;
        return;
      }
      brut = JSON.stringify({ v: 1, traits: traits });
      if (brut.length > MAX_BROUILLON) {
        brouillonPlein = true;
        return;
      }
      m.setItem(CLE_BROUILLON, brut);
      brouillonPlein = false;
    } catch (e) {
      brouillonPlein = true; /* stockage plein ou refusé : le dessin reste à l’écran */
    }
  }

  function garderBientot() {
    if (minuterieBrouillon !== null) {
      window.clearTimeout(minuterieBrouillon);
    }
    minuterieBrouillon = window.setTimeout(ecrireBrouillon, 600);
  }

  /* ------------------------------------------------------------------ */
  /* Geste                                                               */
  /* ------------------------------------------------------------------ */

  function position(evenement) {
    var cadre = el.croquisToile.getBoundingClientRect();
    var pression = 0.5;
    if (evenement.pointerType === "pen") {
      pression = typeof evenement.pressure === "number" && evenement.pressure > 0 ? evenement.pressure : 0.05;
    }
    return {
      x: (evenement.clientX - cadre.left) / (cadre.width || 1) * LARGEUR,
      y: (evenement.clientY - cadre.top) / (cadre.height || 1) * HAUTEUR,
      p: Math.min(1, Math.max(0.05, pression))
    };
  }

  /* Ajoute un point au trait en cours et dessine ce qu’il apporte. */
  function ajouterPoint(point) {
    var p = enCours.p;
    var n = p.length / 3;
    var dx, dy;
    if (n > 0) {
      dx = point.x - p[(n - 1) * 3];
      dy = point.y - p[(n - 1) * 3 + 1];
      if (dx * dx + dy * dy < ECART_MIN * ECART_MIN) {
        return;
      }
    }
    p.push(arrondi(point.x, 1), arrondi(point.y, 1), arrondi(point.p, 2));
    if (n >= 1) {
      morceau(ctx, echelle, enCours, n);
    }
  }

  function surAppui(evenement) {
    var gommeDuStylet;
    if (!ctx || pointeur !== null) {
      return;
    }
    if (evenement.pointerType === "pen") {
      styletVu = true;
    } else if (evenement.pointerType === "touch" && styletVu) {
      return; /* la paume posée sur l’écran ne dessine pas */
    } else if (evenement.pointerType === "mouse" && evenement.button !== 0) {
      return;
    }
    evenement.preventDefault();
    pointeur = evenement.pointerId;
    try {
      el.croquisToile.setPointerCapture(pointeur);
    } catch (e) { /* le tracé marche aussi sans capture */ }
    /* Le bout « gomme » d’un stylet (bouton 5) gomme, quel que soit l’outil choisi. */
    gommeDuStylet = evenement.pointerType === "pen" && (evenement.button === 5 || (evenement.buttons & 32) === 32);
    enCours = {
      o: gommeDuStylet ? "gomme" : outil,
      t: EPAISSEURS[gommeDuStylet ? "gomme" : outil][taille],
      p: []
    };
    ajouterPoint(position(evenement));
  }

  function surDeplacement(evenement) {
    var lot, i;
    if (enCours === null || evenement.pointerId !== pointeur) {
      return;
    }
    evenement.preventDefault();
    /* Un stylet rapide envoie plusieurs points entre deux images : on les prend tous. */
    lot = typeof evenement.getCoalescedEvents === "function" ? evenement.getCoalescedEvents() : null;
    if (!lot || lot.length === 0) {
      lot = [evenement];
    }
    for (i = 0; i < lot.length; i++) {
      ajouterPoint(position(lot[i]));
    }
  }

  function surRelache(evenement) {
    if (enCours === null || evenement.pointerId !== pointeur) {
      return;
    }
    try {
      el.croquisToile.releasePointerCapture(pointeur);
    } catch (e) { /* déjà relâché */ }
    pointeur = null;
    if (enCours.p.length >= 3) {
      bout(ctx, echelle, enCours);
      traits.push(enCours);
      defaits = [];
      garderBientot();
    }
    enCours = null;
    rendreBarre();
  }

  /* ------------------------------------------------------------------ */
  /* Commandes                                                           */
  /* ------------------------------------------------------------------ */

  function annuler() {
    if (traits.length === 0 || enCours !== null) {
      return;
    }
    defaits.push(traits.pop());
    redessiner();
    garderBientot();
    rendreBarre();
    app.annoncer("Dernier trait annulé.");
  }

  function retablir() {
    if (defaits.length === 0 || enCours !== null) {
      return;
    }
    traits.push(defaits.pop());
    redessiner();
    garderBientot();
    rendreBarre();
    app.annoncer("Trait rétabli.");
  }

  function effacerTout() {
    traits = [];
    defaits = [];
    enCours = null;
    pointeur = null;
    redessiner();
    ecrireBrouillon();
    rendreBarre();
    dire("Feuille effacée.", false);
  }

  function surEffacer() {
    if (traits.length === 0) {
      return;
    }
    app.confirmer({
      titre: "Effacer toute la feuille ?",
      texte: "Ton dessin en cours sera effacé, et ce geste ne s’annule pas. Si tu veux le garder, enregistre d’abord l’image.",
      oui: "Oui, effacer",
      danger: true,
      retour: el.btnCroquisEffacer
    }, effacerTout);
  }

  function basculerPlein(actif) {
    plein = actif;
    if (plein) {
      el.croquis.className = "croquis croquis-plein";
      doc.documentElement.className += " croquis-ouvert";
    } else {
      el.croquis.className = "croquis";
      doc.documentElement.className = doc.documentElement.className.replace(/\s*\bcroquis-ouvert\b/g, "");
    }
    el.btnCroquisAgrandir.setAttribute("aria-pressed", plein ? "true" : "false");
    texte(el.btnCroquisAgrandir, plein ? "Réduire" : "Agrandir");
    ajuster();
  }

  /* L’image du dessin, toujours en 1600 × 1200, quelle que soit la taille à
     l’écran. « suite » reçoit un Blob PNG, ou null si l’image n’a pas pu être faite. */
  function image(suite) {
    var toile = doc.createElement("canvas");
    var c;
    try {
      toile.width = LARGEUR;
      toile.height = HAUTEUR;
      c = toile.getContext("2d");
      peindre(c, 1);
      if (typeof toile.toBlob !== "function") {
        suite(null);
        return;
      }
      toile.toBlob(function (blob) {
        suite(blob || null);
      }, "image/png");
    } catch (e) {
      suite(null);
    }
  }

  function enregistrerImage() {
    var nom = "dessin-" + app.cleJour() + ".png";
    if (traits.length === 0) {
      dire("La feuille est vide : il n’y a encore rien à enregistrer.", true);
      return;
    }
    image(function (blob) {
      var fabrique = window.URL || window.webkitURL;
      var url, lien;
      if (!blob) {
        dire("L’image n’a pas pu être créée dans ce navigateur.", true);
        return;
      }
      /* Dans un artefact, c’est Claude qui ouvre la fenêtre d’enregistrement. */
      if (DDJ.ia && typeof DDJ.ia.telecharger === "function" && DDJ.ia.telecharger(nom, blob, dire) === true) {
        return;
      }
      try {
        url = fabrique.createObjectURL(blob);
        lien = doc.createElement("a");
        lien.href = url;
        lien.download = nom;
        lien.hidden = true;
        doc.body.appendChild(lien);
        lien.click();
        doc.body.removeChild(lien);
        window.setTimeout(function () {
          try {
            fabrique.revokeObjectURL(url);
          } catch (e) { /* ignoré */ }
        }, 2000);
        dire("Image prête : « " + nom + " ».", false);
      } catch (e2) {
        dire("L’image n’a pas pu être enregistrée dans ce navigateur.", true);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Minuteur : simple reflet de celui de l’écran du jour                */
  /* ------------------------------------------------------------------ */

  function boutonMinuteurActif() {
    var candidats = [el.btnDemarrer, el.btnPause, el.btnReprendre];
    var i;
    for (i = 0; i < candidats.length; i++) {
      if (!candidats[i].hidden) {
        return candidats[i];
      }
    }
    return null;
  }

  function rendreMinuteur() {
    var bouton = boutonMinuteurActif();
    texte(el.croquisMinuteur, el.minuteurTemps.textContent);
    texte(el.btnCroquisMinuteur, bouton ? bouton.textContent : "Minuteur");
    el.btnCroquisMinuteur.disabled = !bouton;
  }

  /* ------------------------------------------------------------------ */
  /* Affichage                                                           */
  /* ------------------------------------------------------------------ */

  function presser(conteneur, attribut, valeur) {
    var boutons = conteneur.getElementsByTagName("button");
    var i;
    for (i = 0; i < boutons.length; i++) {
      boutons[i].setAttribute("aria-pressed", boutons[i].getAttribute(attribut) === valeur ? "true" : "false");
    }
  }

  function rendreBarre() {
    presser(el.croquisOutils, "data-outil", outil);
    presser(el.croquisTailles, "data-taille", String(taille));
    el.btnCroquisAnnuler.disabled = traits.length === 0;
    el.btnCroquisRetablir.disabled = defaits.length === 0;
    el.btnCroquisEffacer.disabled = traits.length === 0;
    texte(el.croquisAide, brouillonPlein ?
      "Ce dessin est devenu trop lourd pour être gardé en brouillon : pense à enregistrer l’image avant de quitter la page." :
      "Avec un stylet, la pression fait varier le trait, et le doigt ne laisse plus de trace dès qu’un stylet a servi. " +
      "Ton dessin en cours est gardé dans ce navigateur tant que tu ne l’effaces pas.");
  }

  function rendreSujet() {
    var exercice = app.exercice();
    var fiche = app.fiche();
    var fort;
    while (el.croquisSujet.firstChild) {
      el.croquisSujet.removeChild(el.croquisSujet.firstChild);
    }
    if (!exercice) {
      el.croquisSujet.textContent = "Sujet libre : dessine ce qui te fait envie.";
      return;
    }
    fort = doc.createElement("strong");
    fort.textContent = exercice.titre || "Exercice du jour";
    el.croquisSujet.appendChild(doc.createTextNode("L’exercice du jour : "));
    el.croquisSujet.appendChild(fort);
    el.croquisSujet.appendChild(doc.createTextNode(exercice.consigne ? ". " + exercice.consigne : "."));
    el.btnCroquisFait.hidden = !!fiche;
  }

  /* Appelé par l’appli après chaque réaffichage. */
  function apresRendu() {
    var visible;
    if (!pret) {
      return;
    }
    visible = app.vue() === "dessiner";
    if (!visible && plein) {
      basculerPlein(false);
    }
    rendreSujet();
    el.btnCroquisFait.hidden = !!app.fiche();
    rendreBarre();
    rendreMinuteur();
    if (visible) {
      ajuster();
    }
  }

  function surFait() {
    if (app.cocher()) {
      dire("Séance cochée. Bravo, tu as dessiné aujourd’hui.", false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                           */
  /* ------------------------------------------------------------------ */

  function collecter() {
    var i, element;
    for (i = 0; i < IDS.length; i++) {
      element = doc.getElementById(IDS[i]);
      if (!element) {
        return false;
      }
      el[nomCamel(IDS[i])] = element;
    }
    return true;
  }

  function remonter(depart, attribut, limite) {
    var noeud = depart;
    while (noeud && noeud !== limite) {
      if (noeud.getAttribute && noeud.getAttribute(attribut) !== null) {
        return noeud;
      }
      noeud = noeud.parentNode;
    }
    return null;
  }

  function surTouche(evenement) {
    var cible = evenement.target;
    var touche = String(evenement.key || "").toLowerCase();
    if (app.vue() !== "dessiner") {
      return;
    }
    if (touche === "escape" && plein) {
      basculerPlein(false);
      el.btnCroquisAgrandir.focus();
      return;
    }
    if (cible && (cible.tagName === "INPUT" || cible.tagName === "TEXTAREA")) {
      return;
    }
    if ((evenement.ctrlKey || evenement.metaKey) && !evenement.altKey) {
      if (touche === "z" && !evenement.shiftKey) {
        evenement.preventDefault();
        annuler();
      } else if (touche === "y" || (touche === "z" && evenement.shiftKey)) {
        evenement.preventDefault();
        retablir();
      }
    }
  }

  function brancher() {
    var toile = el.croquisToile;
    toile.addEventListener("pointerdown", surAppui);
    toile.addEventListener("pointermove", surDeplacement);
    toile.addEventListener("pointerup", surRelache);
    toile.addEventListener("pointercancel", surRelache);
    /* Pas de menu au clic droit ni au bouton du stylet, pas de glisser d’image. */
    toile.addEventListener("contextmenu", function (evenement) {
      evenement.preventDefault();
    });
    toile.addEventListener("dragstart", function (evenement) {
      evenement.preventDefault();
    });

    el.croquisOutils.addEventListener("click", function (evenement) {
      var bouton = remonter(evenement.target, "data-outil", el.croquisOutils);
      if (bouton) {
        outil = bouton.getAttribute("data-outil");
        rendreBarre();
      }
    });
    el.croquisTailles.addEventListener("click", function (evenement) {
      var bouton = remonter(evenement.target, "data-taille", el.croquisTailles);
      if (bouton) {
        taille = Number(bouton.getAttribute("data-taille"));
        rendreBarre();
      }
    });
    el.btnCroquisAnnuler.addEventListener("click", annuler);
    el.btnCroquisRetablir.addEventListener("click", retablir);
    el.btnCroquisEffacer.addEventListener("click", surEffacer);
    el.btnCroquisAgrandir.addEventListener("click", function () {
      basculerPlein(!plein);
    });
    el.btnCroquisMinuteur.addEventListener("click", function () {
      var bouton = boutonMinuteurActif();
      if (bouton) {
        bouton.click();
        rendreMinuteur();
      }
    });
    el.btnCroquisFait.addEventListener("click", surFait);
    el.btnCroquisImage.addEventListener("click", enregistrerImage);

    doc.addEventListener("keydown", surTouche);
    window.addEventListener("resize", ajuster);
    window.addEventListener("load", ajuster);
    /* La place de la feuille peut changer sans que la fenêtre change (mise en
       page qui se termine, barre d’outils qui passe sur deux lignes). */
    if (typeof window.ResizeObserver === "function") {
      new window.ResizeObserver(ajuster).observe(el.croquisFeuille);
    }
    /* Le temps du minuteur change chaque seconde sur l’écran du jour : on le recopie. */
    if (typeof window.MutationObserver === "function") {
      new window.MutationObserver(rendreMinuteur).observe(el.minuteurTemps, {
        childList: true, characterData: true, subtree: true
      });
    }
    /* Quitter la page : le brouillon en attente est écrit tout de suite. */
    window.addEventListener("pagehide", function () {
      if (minuterieBrouillon !== null) {
        window.clearTimeout(minuterieBrouillon);
        ecrireBrouillon();
      }
    });
  }

  function demarrer() {
    if (pret || !collecter()) {
      return;
    }
    ctx = el.croquisToile.getContext ? el.croquisToile.getContext("2d") : null;
    if (!ctx || typeof window.PointerEvent !== "function") {
      /* Navigateur sans toile ou sans pointeurs : l’entrée vers la feuille disparaît. */
      if (doc.getElementById("lien-dessiner")) {
        doc.getElementById("lien-dessiner").hidden = true;
      }
      return;
    }
    lireBrouillon();
    brancher();
    pret = true;
    apresRendu();
  }

  DDJ.croquis = {
    apresRendu: apresRendu,
    image: image,
    estVide: function () {
      return traits.length === 0;
    },
    /* Pour les essais : le nombre de traits, et de quoi en poser. */
    nombreTraits: function () {
      return traits.length;
    }
  };

  function demarrerProtege() {
    try {
      demarrer();
    } catch (e) { /* l’appli marche sans la feuille de dessin */ }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", demarrerProtege);
  } else {
    demarrerProtege();
  }
})();
