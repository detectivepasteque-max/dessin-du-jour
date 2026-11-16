/* ==========================================================================
   Dessin du jour — app.js
   Interface de l’appli : affichage, minuteur, calendrier, réglages, stockage.
   Toute la logique de dates, d’exercices, de série et d’état vient de
   DDJ.logique (logique.js), jamais réimplémentée ici.
   Script classique (ES5, pas de module) : fonctionne en file:// comme en HTTP.
   Aucun texte venant des données ou d’un fichier importé ne passe par
   innerHTML : tout est écrit avec textContent et createElement.
   ========================================================================== */

(function () {
  "use strict";

  var DDJ = window.DDJ = window.DDJ || {};
  var L = DDJ.logique;
  var doc = document;

  function erreurFatale(message) {
    var zone = doc.getElementById("erreur-fatale");
    if (zone) {
      zone.textContent = message;
      zone.hidden = false;
    }
  }

  if (!L) {
    erreurFatale("L’appli n’a pas pu démarrer : le fichier logique.js est introuvable à côté de index.html.");
    return;
  }

  /* ------------------------------------------------------------------ */
  /* Constantes                                                          */
  /* ------------------------------------------------------------------ */

  var TITRE_BASE = "Dessin du jour";
  var VUES = ["aujourdhui", "calendrier", "reglages"];
  var CLE = L.CLE_STOCKAGE;
  var PREFIXE_COPIE = CLE + ":illisible-";   /* copies de données illisibles */
  var CLE_MINUTEUR = "dessin-du-jour:minuteur"; /* sessionStorage : survit au rechargement */
  var CIRCONFERENCE = 2 * Math.PI * 52;      /* anneau du minuteur, rayon 52 */
  var TAILLE_MAX_IMPORT = 5 * 1024 * 1024;
  var MOIS_MIN = { annee: 2000, mois: 1 };
  var PERIODE_BATTEMENT = 250;               /* ms entre deux rafraîchissements du minuteur */
  var PERIODE_VERIF_JOUR = 30000;            /* ms entre deux vérifications du changement de jour */
  var DUREE_MAX_SEANCE = 3 * 3600000;        /* ms : au-delà, une séance de minuteur ne retient plus l’écran sur son jour */

  var ENCOURAGEMENTS = [
    "Bravo, tu as dessiné aujourd’hui. C’est tout ce qui compte.",
    "Un dessin de plus dans ton carnet. À demain !",
    "Tu as pris le temps de dessiner : c’est gagné.",
    "Le crayon a bougé aujourd’hui. Beau travail.",
    "Encore une page noircie. Ta main s’en souviendra.",
    "C’est noté. Peu importe le résultat, tu étais là."
  ];

  /* Tous les éléments de index.html utilisés ici. el.btnFait <-> #btn-fait. */
  var IDS = [
    "contenu", "lien-evitement", "annonce", "nav-principale",
    "bandeau-stockage", "bandeau-stockage-texte",
    "bandeau-illisible", "bandeau-illisible-texte", "btn-fermer-illisible",
    "vue-aujourdhui", "titre-aujourdhui", "date-jour",
    "theme-jour", "theme-nom", "theme-description",
    "serie-nombre", "serie-libelle", "serie-note", "serie-joker",
    "exercice", "exercice-surtitre", "exercice-titre", "exercice-consigne",
    "exercice-etapes", "exercice-materiel-ligne", "exercice-materiel",
    "exercice-bloque", "exercice-si-bloque", "btn-changer", "changer-restants",
    "exercice-absent",
    "minuteur", "minuteur-durees", "minuteur-temps", "anneau-progres",
    "btn-demarrer", "btn-pause", "btn-reprendre", "btn-reinitialiser",
    "minuteur-message",
    "zone-fait", "fait-avant", "btn-fait", "fait-apres", "fait-etat",
    "fait-encouragement", "palier-jour", "ressenti-jour", "btn-annuler",
    "vue-calendrier", "titre-calendrier",
    "stat-serie", "stat-meilleure", "stat-total", "stat-mois",
    "btn-mois-prec", "mois-titre", "btn-mois-suiv", "btn-mois-courant",
    "grille-corps", "paliers-prochain", "paliers-liste",
    "vue-reglages", "titre-reglages",
    "reglage-durees", "reglage-themes", "reglage-son", "btn-test-son",
    "btn-exporter", "btn-importer", "fichier-import", "sauvegarde-message",
    "btn-effacer",
    "detail", "detail-titre", "detail-statut", "detail-exo-label",
    "detail-exo-titre", "detail-exo-theme", "detail-exo-consigne",
    "detail-ressenti", "detail-palier", "detail-basculer", "detail-fermer",
    "detail-annonce",
    "confirmation", "confirmation-titre", "confirmation-texte",
    "confirmation-oui", "confirmation-non",
    "voile"
  ];

  /* ------------------------------------------------------------------ */
  /* État de l’interface                                                 */
  /* ------------------------------------------------------------------ */

  var el = {};                      /* éléments du DOM, par nom */
  var etat = L.etatInitial();       /* progression (forme définie par logique.js) */
  var cleJour = L.aujourdHui();     /* jour affiché par l’écran « Aujourd’hui » */
  var vueActive = "aujourdhui";
  var stockage = {
    disponible: true,               /* faux si localStorage est absent ou refuse l’écriture */
    protege: false,                 /* vrai si des données illisibles n’ont pas pu être mises de côté */
    cleCopie: ""                    /* clé de la copie des données illisibles, s’il y en a une */
  };

  var minuteur = {
    statut: "pret",                 /* "pret" | "en-cours" | "pause" | "fini" */
    dureeMin: 20,
    finA: 0,                        /* horodatage (Date.now) de la fin, quand il tourne */
    resteMs: 0,                     /* temps restant figé, quand il est en pause */
    manuel: false,                  /* vrai si la durée a été choisie à la main */
    jour: "",                       /* jour (clé) de la séance lancée, "" au repos */
    debutA: 0                       /* horodatage (Date.now) du lancement de la séance */
  };
  var jourRetenu = false;           /* vrai tant qu’une séance commencée la veille retient l’écran sur son jour */
  var horloge = null;               /* identifiant du setInterval du minuteur */
  var audio = null;                 /* AudioContext, créé seulement après un geste */

  var exerciceAfficheId = null;     /* pour replier « Si tu bloques » quand l’exercice change */
  var palierJourCle = null;         /* jour pour lequel un palier est affiché sur l’écran du jour */
  var moisAffiche = null;           /* { annee, mois } du calendrier */
  var detailCle = null;             /* jour ouvert dans le dialogue de détail */
  var dialogueOuvert = null;
  var confirmationAction = null;
  var confirmationRetour = null;

  /* ------------------------------------------------------------------ */
  /* Petites aides                                                       */
  /* ------------------------------------------------------------------ */

  function chaine(v) {
    return typeof v === "string" ? v : "";
  }

  function nombre(v) {
    return (typeof v === "number" && isFinite(v)) ? v : 0;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function majuscule(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  /* « 0 jour », « 1 jour », « 2 jours » : en français le pluriel commence à 2. */
  function pluriel(n, un, plusieurs) {
    return n + " " + (n >= 2 ? plusieurs : un);
  }

  function possede(objet, nom) {
    return Object.prototype.hasOwnProperty.call(objet, nom);
  }

  function nomCamel(id) {
    return id.replace(/-([a-z])/g, function (tout, lettre) {
      return lettre.toUpperCase();
    });
  }

  /* N’écrit que si le texte change : évite de réveiller inutilement les zones aria-live. */
  function texte(element, valeur) {
    if (element.textContent !== valeur) {
      element.textContent = valeur;
    }
  }

  function montrer(element, visible) {
    element.hidden = !visible;
  }

  function vider(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function creer(balise, classe, contenu) {
    var element = doc.createElement(balise);
    if (classe) {
      element.className = classe;
    }
    if (typeof contenu === "string") {
      element.textContent = contenu;
    }
    return element;
  }

  function aClasse(element, classe) {
    return (" " + element.className + " ").indexOf(" " + classe + " ") !== -1;
  }

  function mettreClasse(element, classe, actif) {
    var presente = aClasse(element, classe);
    if (actif && !presente) {
      element.className = element.className ? element.className + " " + classe : classe;
    } else if (!actif && presente) {
      element.className = (" " + element.className + " ").replace(" " + classe + " ", " ")
        .replace(/^\s+|\s+$/g, "");
    }
  }

  function focusser(element) {
    if (element && typeof element.focus === "function") {
      try {
        element.focus();
      } catch (e) { /* élément non focalisable : sans gravité */ }
    }
  }

  /* Remonte de « depart » vers « limite » jusqu’à un élément portant l’attribut. */
  function remonter(depart, attribut, limite) {
    var noeud = depart;
    while (noeud && noeud !== limite && noeud.nodeType === 1) {
      if (noeud.hasAttribute(attribut)) {
        return noeud;
      }
      noeud = noeud.parentNode;
    }
    return null;
  }

  /* Message pour les lecteurs d’écran (zone aria-live discrète). */
  function annoncer(message, zone) {
    var cible = zone || el.annonce;
    cible.textContent = "";
    window.setTimeout(function () {
      cible.textContent = message;
    }, 60);
  }

  function ficheDuJour(cle) {
    return possede(etat.jours, cle) ? etat.jours[cle] : null;
  }

  /* ------------------------------------------------------------------ */
  /* Stockage local                                                      */
  /* ------------------------------------------------------------------ */

  function magasinLocal() {
    try {
      return window.localStorage || null;
    } catch (e) {
      return null; /* accès refusé (réglages de confidentialité, file:// strict...) */
    }
  }

  /* Lit la progression enregistrée. Ne plante jamais : au pire, état neuf. */
  function chargerEtat() {
    var magasin = magasinLocal();
    var brut, resultat, cleCopie;
    if (!magasin) {
      stockage.disponible = false;
      return L.etatInitial();
    }
    try {
      brut = magasin.getItem(CLE);
    } catch (e) {
      stockage.disponible = false;
      return L.etatInitial();
    }
    try {
      /* Essai d’écriture, pour prévenir tout de suite si rien ne pourra être gardé. */
      magasin.setItem(CLE + ":essai", "1");
      magasin.removeItem(CLE + ":essai");
    } catch (e2) {
      stockage.disponible = false;
    }
    if (typeof brut !== "string" || /^\s*$/.test(brut)) {
      return L.etatInitial();
    }
    resultat = L.depuisJSON(brut);
    if (resultat.ok) {
      return resultat.etat;
    }
    /* Données illisibles : on ne les écrase pas en silence. On les déplace
       sous une autre clé ; si c’est impossible, on s’interdit d’écrire. */
    cleCopie = PREFIXE_COPIE + new Date().toISOString();
    try {
      magasin.setItem(cleCopie, brut);
      magasin.removeItem(CLE);
      stockage.cleCopie = cleCopie;
    } catch (e3) {
      stockage.protege = true;
    }
    return L.etatInitial();
  }

  /* Écrit la progression. Renvoie vrai si elle est bien enregistrée. */
  function enregistrer() {
    var magasin;
    if (stockage.protege) {
      majBandeaux();
      return false;
    }
    magasin = magasinLocal();
    if (!magasin) {
      stockage.disponible = false;
    } else {
      try {
        magasin.setItem(CLE, L.versJSON(etat, false));
        stockage.disponible = true;
      } catch (e) {
        stockage.disponible = false;
      }
    }
    majBandeaux();
    return stockage.disponible;
  }

  function majBandeaux() {
    if (stockage.protege) {
      texte(el.bandeauStockageTexte, "Les données enregistrées dans ce navigateur sont illisibles et n’ont pas pu " +
        "être mises de côté. Pour ne pas les écraser, ta progression ne pourra pas être enregistrée pendant " +
        "cette visite. Tu peux importer une sauvegarde depuis les réglages.");
      montrer(el.bandeauStockage, true);
    } else if (!stockage.disponible) {
      texte(el.bandeauStockageTexte, "Le stockage de ce navigateur est indisponible : ta progression ne pourra pas " +
        "être enregistrée. Tu peux continuer à dessiner, mais ce que tu coches sera oublié à la fermeture de la " +
        "page. Pense à exporter ta progression depuis les réglages.");
      montrer(el.bandeauStockage, true);
    } else {
      montrer(el.bandeauStockage, false);
    }
  }

  /* Un autre onglet a modifié la progression : on se remet d’accord avec lui. */
  function relireStockage() {
    var magasin = magasinLocal();
    var brut, resultat;
    if (!magasin) {
      return;
    }
    try {
      brut = magasin.getItem(CLE);
    } catch (e) {
      return;
    }
    if (brut === null) {
      etat = L.etatInitial();
    } else {
      resultat = L.depuisJSON(brut);
      if (!resultat.ok) {
        return; /* on garde ce qu’on a plutôt que de tout perdre */
      }
      etat = resultat.etat;
    }
    appliquerTheme();
    synchroniserDuree();
    rendreTout();
  }

  /* ------------------------------------------------------------------ */
  /* Thème et navigation                                                 */
  /* ------------------------------------------------------------------ */

  /* "auto" laisse la feuille de style suivre prefers-color-scheme. */
  function appliquerTheme() {
    doc.documentElement.setAttribute("data-theme", etat.reglages.theme);
  }

  function vueDepuisAncre() {
    var ancre = String(window.location.hash || "").replace(/^#/, "");
    return VUES.indexOf(ancre) !== -1 ? ancre : "aujourdhui";
  }

  function afficherVue(nom, deplacerFocus) {
    var liens = el.navPrincipale.getElementsByTagName("a");
    var i;
    vueActive = nom;
    for (i = 0; i < VUES.length; i++) {
      montrer(el[nomCamel("vue-" + VUES[i])], VUES[i] === nom);
    }
    for (i = 0; i < liens.length; i++) {
      if (liens[i].getAttribute("data-vue") === nom) {
        liens[i].setAttribute("aria-current", "page");
      } else {
        liens[i].removeAttribute("aria-current");
      }
    }
    if (deplacerFocus) {
      window.scrollTo(0, 0);
      focusser(el[nomCamel("titre-" + nom)]);
    }
  }

  function surChangementAncre() {
    var nom = vueDepuisAncre();
    if (dialogueOuvert) {
      fermerDialogue(dialogueOuvert);
    }
    verifierJour();
    if (nom !== vueActive) {
      afficherVue(nom, true);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Écran « Aujourd’hui »                                               */
  /* ------------------------------------------------------------------ */

  /* L’exercice à montrer pour le jour affiché : celui qui a été validé si le
     jour est fait, sinon celui du tirage en cours. null si les données manquent. */
  function exerciceCourant() {
    var fiche = ficheDuJour(cleJour);
    var exercice = null;
    if (fiche && fiche.exerciceId) {
      exercice = L.exerciceParId(fiche.exerciceId);
    }
    if (!exercice) {
      exercice = L.exerciceDuJour(cleJour, L.tirageDuJour(etat, cleJour));
    }
    return exercice;
  }

  /* dejaDessine : vrai s’il existe au moins un jour fait jusqu’au jour affiché. */
  function rendreSerie(serie, dejaDessine) {
    var note, joker, dernier;
    texte(el.serieNombre, String(serie.serie));
    texte(el.serieLibelle, serie.serie >= 2 ? "jours d’affilée" : "jour d’affilée");

    if (serie.serie === 0) {
      /* Série pas encore commencée, ou retombée à zéro : même accueil, sans
         reproche, et jamais de « ta série continue ». */
      note = dejaDessine ? "Une nouvelle série commence avec ton prochain dessin." :
        "Ta série commence avec ton prochain dessin.";
      joker = serie.jokerDispoCetteSemaine ?
        "Chaque semaine, un joker la protège si tu sautes un jour." :
        "Le joker de cette semaine a déjà servi ; un nouveau t’attend dès lundi.";
    } else {
      note = serie.faitAujourdHui ? "Ton dessin d’aujourd’hui est compté." :
        "Ton dessin d’aujourd’hui prolongera ta série.";
      joker = "";
      /* serie.jokers ne contient que les jokers de la série en cours, triés
         par date croissante : le dernier est le plus récent. */
      dernier = serie.jokers.length > 0 ? serie.jokers[serie.jokers.length - 1] : null;
      if (dernier !== null && L.ecartJours(dernier, cleJour) <= 7) {
        joker = "Un joker a couvert le " + L.formaterDate(dernier, false) + " : ta série continue. ";
      }
      joker += serie.jokerDispoCetteSemaine ?
        "Joker de la semaine disponible : un jour sans dessin ne cassera pas ta série." :
        "Joker de la semaine déjà utilisé.";
    }
    texte(el.serieNote, note);
    texte(el.serieJoker, joker);
  }

  /* Une étape « 5 min : fais ceci » est affichée avec sa durée en étiquette. */
  function creerEtape(contenu) {
    var item = creer("li");
    var decoupe = /^\s*(\d+\s*min(?:utes?)?)\s*:\s*([\s\S]+)$/.exec(contenu);
    if (decoupe) {
      item.appendChild(creer("span", "etape-temps", decoupe[1]));
      item.appendChild(doc.createTextNode(decoupe[2]));
    } else {
      item.textContent = contenu;
    }
    return item;
  }

  function rendreExercice(exercice, fiche) {
    var restants = L.tiragesRestants(etat, cleJour);
    var etapes, duree, materiel, siBloque, i, message;

    if (!exercice) {
      montrer(el.exercice, false);
      montrer(el.exerciceAbsent, true);
      exerciceAfficheId = null;
      return;
    }
    montrer(el.exercice, true);
    montrer(el.exerciceAbsent, false);

    if (exercice.id !== exerciceAfficheId) {
      exerciceAfficheId = exercice.id;
      el.exerciceBloque.removeAttribute("open");
    }

    duree = nombre(exercice.duree);
    texte(el.exerciceSurtitre, (fiche ? "Ton exercice du jour" : "L’exercice du jour") +
      (duree > 0 ? " · " + duree + " min conseillées" : ""));
    texte(el.exerciceTitre, chaine(exercice.titre) || "Exercice sans titre");
    texte(el.exerciceConsigne, chaine(exercice.consigne));

    vider(el.exerciceEtapes);
    etapes = Object.prototype.toString.call(exercice.etapes) === "[object Array]" ? exercice.etapes : [];
    for (i = 0; i < etapes.length; i++) {
      if (chaine(etapes[i]) !== "") {
        el.exerciceEtapes.appendChild(creerEtape(etapes[i]));
      }
    }

    materiel = chaine(exercice.materiel);
    texte(el.exerciceMateriel, materiel);
    montrer(el.exerciceMaterielLigne, materiel !== "");

    siBloque = chaine(exercice.siBloque);
    texte(el.exerciceSiBloque, siBloque);
    montrer(el.exerciceBloque, siBloque !== "");

    /* Changer d’exercice : limité par jour, et figé une fois le jour validé. */
    el.btnChanger.disabled = !!fiche || restants <= 0;
    if (fiche) {
      message = "Exercice validé : plus besoin d’en changer aujourd’hui.";
    } else if (restants <= 0) {
      message = "Tu as utilisé tes " + L.MAX_TIRAGES + " changements du jour.";
    } else {
      message = "Encore " + pluriel(restants, "changement possible", "changements possibles") + " aujourd’hui.";
    }
    texte(el.changerRestants, message);
  }

  function majRessenti(conteneur, valeur) {
    var boutons = conteneur.getElementsByTagName("button");
    var i;
    for (i = 0; i < boutons.length; i++) {
      boutons[i].setAttribute("aria-pressed",
        boutons[i].getAttribute("data-ressenti") === valeur ? "true" : "false");
    }
  }

  function rendreFait(fiche) {
    montrer(el.faitAvant, !fiche);
    montrer(el.faitApres, !!fiche);
    mettreClasse(el.zoneFait, "est-fait", !!fiche);
    if (fiche) {
      texte(el.faitEncouragement, ENCOURAGEMENTS[L.hacher(cleJour) % ENCOURAGEMENTS.length]);
      majRessenti(el.ressentiJour, fiche.ressenti);
    }
    /* Le message de palier ne vaut que pour le jour où il a été gagné. */
    if (!fiche || palierJourCle !== cleJour) {
      palierJourCle = null;
      montrer(el.palierJour, false);
    }
  }

  function rendreAujourdhui() {
    var theme = L.themeDuJour(cleJour);
    var fiche = ficheDuJour(cleJour);
    texte(el.dateJour, majuscule(L.formaterDate(cleJour, true)));
    el.dateJour.setAttribute("datetime", cleJour);
    if (theme && chaine(theme.nom) !== "") {
      texte(el.themeNom, theme.nom);
      texte(el.themeDescription, chaine(theme.description));
      montrer(el.themeJour, true);
      montrer(el.themeDescription, chaine(theme.description) !== "");
    } else {
      montrer(el.themeJour, false);
      montrer(el.themeDescription, false);
    }
    rendreSerie(L.calculerSerie(etat.jours, cleJour), L.meilleureSerie(etat.jours, cleJour) > 0);
    rendreExercice(exerciceCourant(), fiche);
    rendreFait(fiche);
    rendreMinuteur();
    /* Minuteur terminé : son message suit l’état du jour (coché ou pas encore). */
    if (minuteur.statut === "fini") {
      texte(el.minuteurMessage, messageTempsEcoule());
    }
  }

  /* ------------------------------------------------------------------ */
  /* Jours faits, ressenti, paliers                                      */
  /* ------------------------------------------------------------------ */

  /* Paliers franchis et pas encore fêtés ; les note comme vus au passage,
     pour que chaque palier ne soit fêté qu’une seule fois. */
  function paliersAFeter() {
    var nonVus = L.paliersNonVus(etat);
    var seuils = [];
    var i;
    for (i = 0; i < nonVus.length; i++) {
      seuils.push(nonVus[i].seuil);
    }
    if (seuils.length > 0) {
      etat = L.marquerPaliersVus(etat, seuils);
    }
    return nonVus;
  }

  /* Affiche le plus haut des paliers franchis dans « conteneur ». */
  function montrerPalier(conteneur, paliers) {
    var palier = paliers[paliers.length - 1];
    vider(conteneur);
    conteneur.appendChild(creer("p", "fete-surtitre", "Palier franchi"));
    conteneur.appendChild(creer("p", "fete-nom", "« " + palier.nom + " »"));
    conteneur.appendChild(creer("p", "fete-texte", palier.seuil === 1 ?
      "Ton premier jour de dessin est coché. Bienvenue dans ton carnet !" :
      palier.seuil + " jours de dessin au compteur. Bravo, vraiment."));
    montrer(conteneur, true);
    return "Palier franchi : " + palier.nom + ".";
  }

  /* Marque « cle » comme fait dans l’état (sans enregistrer ni afficher).
     Renvoie les paliers à fêter. */
  function marquerJour(cle) {
    var estAujourdhui = cle === cleJour;
    /* Jour passé : si l’exercice avait été changé ce jour-là et que ce tirage
       est encore mémorisé, c’est lui qui a été proposé (sinon tirage 0). */
    var exercice = estAujourdhui ? exerciceCourant() : L.exerciceDuJour(cle, L.tirageDuJour(etat, cle));
    var theme = L.themeDuJour(cle);
    /* logique.js ne lit pas l’horloge : l’horodatage vient d’ici. */
    var infos = { faitLe: new Date().toISOString() };
    if (exercice) {
      infos.exerciceId = chaine(exercice.id);
      infos.titre = chaine(exercice.titre);
      infos.themeNom = chaine(exercice.themeNom);
      /* La durée du minuteur ne vaut que pour une séance lancée ce jour-là. */
      infos.duree = (estAujourdhui && minuteur.statut !== "pret" && minuteur.jour === cle) ?
        minuteur.dureeMin : nombre(exercice.duree);
    } else {
      infos.titre = "Dessin libre";
      infos.themeNom = theme ? chaine(theme.nom) : "";
    }
    etat = L.marquerFait(etat, cle, infos);
    return paliersAFeter();
  }

  function surFait() {
    var jourCoche = cleJour;
    var annoncePalier = "";
    var paliers;
    if (ficheDuJour(cleJour)) {
      return;
    }
    paliers = marquerJour(cleJour);
    if (paliers.length > 0) {
      palierJourCle = cleJour;
      annoncePalier = montrerPalier(el.palierJour, paliers);
    }
    enregistrer();
    rendreTout();
    /* Petite animation de la coche, jouée une seule fois au moment de valider. */
    mettreClasse(el.zoneFait, "vient-de-cocher", true);
    window.setTimeout(function () {
      mettreClasse(el.zoneFait, "vient-de-cocher", false);
    }, 1200);
    focusser(el.faitEtat);
    /* Séance terminée après minuit et maintenant cochée : elle est close,
       l’écran peut passer au nouveau jour. */
    verifierJour();
    if (cleJour !== jourCoche) {
      /* L’écran vient de passer au nouveau jour : on dit, dans la zone du
         minuteur (visible et aria-live), que la séance est bien cochée. Le
         bloc du palier a disparu avec l’ancien jour : on le rappelle ici. */
      texte(el.minuteurMessage, "Ta séance du " + L.formaterDate(jourCoche, false) +
        " est cochée. Minuit est passé : voici le nouveau jour." +
        (annoncePalier !== "" ? " " + annoncePalier : ""));
      focusser(el.titreAujourdhui);
      return;
    }
    annoncer(annoncePalier !== "" ? "Séance cochée. " + annoncePalier : "Séance cochée.");
  }

  function surAnnuler() {
    etat = L.annulerFait(etat, cleJour);
    enregistrer();
    rendreTout();
    focusser(el.btnFait);
    annoncer("Séance décochée.");
  }

  /* Un clic sur le ressenti déjà choisi l’efface : il reste facultatif. */
  function changerRessenti(cle, valeur) {
    var fiche = cle ? ficheDuJour(cle) : null;
    if (!fiche || L.RESSENTIS.indexOf(valeur) === -1) {
      return;
    }
    etat = L.marquerFait(etat, cle, { ressenti: fiche.ressenti === valeur ? null : valeur });
    enregistrer();
    rendreTout();
  }

  function surChanger() {
    if (ficheDuJour(cleJour) || L.tiragesRestants(etat, cleJour) <= 0) {
      return;
    }
    etat = L.changerExercice(etat, cleJour);
    enregistrer();
    synchroniserDuree();
    rendreTout();
    /* Le bouton peut s’être désactivé : on amène le focus sur le nouvel exercice. */
    focusser(el.exerciceTitre);
  }

  /* ------------------------------------------------------------------ */
  /* Minuteur                                                            */
  /* ------------------------------------------------------------------ */

  /* Durée présélectionnée par le minuteur. Réglage sur 15, 20 ou 30 : toujours
     cette durée. Réglage « conseillée par l’exercice » ("auto") : la durée de
     l’exercice du jour, ou 20 min si elle manque ou n’est pas proposée. */
  function dureeParDefaut() {
    var reglage = etat.reglages.duree;
    var exercice;
    if (L.DUREES.indexOf(reglage) !== -1) {
      return reglage;
    }
    exercice = exerciceCourant();
    if (exercice && L.DUREES.indexOf(exercice.duree) !== -1) {
      return exercice.duree;
    }
    return 20;
  }

  /* Tant que le minuteur est au repos et que la durée n’a pas été choisie à la
     main sur l’écran du jour, elle suit le réglage (et, en « auto », l’exercice). */
  function synchroniserDuree() {
    if (minuteur.statut === "pret" && !minuteur.manuel) {
      minuteur.dureeMin = dureeParDefaut();
    }
  }

  /* Le temps restant vient toujours de l’horodatage de fin, jamais d’un
     compteur décrémenté : il reste juste même si l’onglet a dormi. */
  function resteMs() {
    if (minuteur.statut === "en-cours") {
      return Math.max(0, minuteur.finA - Date.now());
    }
    if (minuteur.statut === "pause") {
      return minuteur.resteMs;
    }
    if (minuteur.statut === "fini") {
      return 0;
    }
    return minuteur.dureeMin * 60000;
  }

  function formaterTemps(ms) {
    var secondes = Math.ceil(ms / 1000);
    return pad2(Math.floor(secondes / 60)) + ":" + pad2(secondes % 60);
  }

  function afficherTemps() {
    var reste = resteMs();
    var total = minuteur.dureeMin * 60000;
    var libelle = formaterTemps(reste);
    var ecoule = total > 0 ? 1 - reste / total : 0;
    var titre = TITRE_BASE;
    ecoule = Math.min(1, Math.max(0, ecoule));
    texte(el.minuteurTemps, libelle);
    el.anneauProgres.style.strokeDashoffset = String(Math.round(CIRCONFERENCE * (1 - ecoule) * 100) / 100);
    if (minuteur.statut === "en-cours") {
      titre = libelle + " · " + TITRE_BASE;
    } else if (minuteur.statut === "pause") {
      titre = "En pause " + libelle + " · " + TITRE_BASE;
    } else if (minuteur.statut === "fini") {
      titre = "Temps écoulé · " + TITRE_BASE;
    }
    if (doc.title !== titre) {
      doc.title = titre;
    }
  }

  function rendreMinuteur() {
    var statut = minuteur.statut;
    var radios = el.minuteurDurees.getElementsByTagName("input");
    var i;
    for (i = 0; i < radios.length; i++) {
      radios[i].checked = Number(radios[i].value) === minuteur.dureeMin;
      /* On ne change pas de durée en cours de route : il faut réinitialiser. */
      radios[i].disabled = statut === "en-cours" || statut === "pause";
    }
    montrer(el.btnDemarrer, statut === "pret" || statut === "fini");
    montrer(el.btnPause, statut === "en-cours");
    montrer(el.btnReprendre, statut === "pause");
    el.btnReinitialiser.disabled = statut === "pret";
    el.minuteur.setAttribute("data-statut", statut);
    afficherTemps();
  }

  /* Le minuteur en cours survit à un rechargement grâce à sessionStorage. */
  function memoriserMinuteur() {
    try {
      if (minuteur.statut === "pret") {
        window.sessionStorage.removeItem(CLE_MINUTEUR);
      } else {
        window.sessionStorage.setItem(CLE_MINUTEUR, JSON.stringify({
          statut: minuteur.statut,
          dureeMin: minuteur.dureeMin,
          finA: minuteur.finA,
          resteMs: minuteur.resteMs,
          jour: minuteur.jour,
          debutA: minuteur.debutA
        }));
      }
    } catch (e) { /* pas de sessionStorage : le minuteur marche quand même */ }
  }

  /* Jour et heure de lancement de la séance mémorisée. Mémo sans ces champs :
     séance rattachée au jour affiché, et trop ancienne pour le retenir. */
  function restaurerSeance(memo) {
    minuteur.jour = L.estCleValide(memo.jour) ? memo.jour : cleJour;
    minuteur.debutA = (typeof memo.debutA === "number" && isFinite(memo.debutA)) ? memo.debutA : 0;
  }

  /* Renvoie vrai si un minuteur lancé avant le rechargement s’est terminé entre-temps. */
  function restaurerMinuteur() {
    var brut, memo, total, maintenant;
    try {
      brut = window.sessionStorage.getItem(CLE_MINUTEUR);
      memo = brut ? JSON.parse(brut) : null;
    } catch (e) {
      memo = null;
    }
    if (!memo || typeof memo !== "object" || L.DUREES.indexOf(memo.dureeMin) === -1) {
      return false;
    }
    total = memo.dureeMin * 60000;
    maintenant = Date.now();
    if ((memo.statut === "en-cours" || memo.statut === "fini") &&
        typeof memo.finA === "number" && isFinite(memo.finA) && memo.finA - maintenant <= total) {
      /* Terminé depuis plus d’une heure : on repart d’un minuteur au repos. */
      if (maintenant - memo.finA > 3600000) {
        return false;
      }
      /* Mémo « fini » dont la fin serait dans le futur : incohérent, on l’ignore. */
      if (memo.statut === "fini" && memo.finA > maintenant) {
        return false;
      }
      minuteur.dureeMin = memo.dureeMin;
      minuteur.manuel = true;
      minuteur.finA = memo.finA;
      minuteur.statut = memo.finA > maintenant ? "en-cours" : "fini";
      restaurerSeance(memo);
      /* Un minuteur déjà terminé avant le rechargement est restauré tel quel
         (il retient ainsi l’écran sur le jour de sa séance, voir demarrer). */
      return memo.statut === "en-cours" && minuteur.statut === "fini";
    }
    if (memo.statut === "pause" && typeof memo.resteMs === "number" && memo.resteMs > 0 &&
        memo.resteMs <= total) {
      minuteur.dureeMin = memo.dureeMin;
      minuteur.manuel = true;
      minuteur.resteMs = memo.resteMs;
      minuteur.statut = "pause";
      restaurerSeance(memo);
    }
    return false;
  }

  /* Une séance de minuteur est « ouverte » tant qu’elle n’est pas close : en
     cours, ou bien en pause ou terminée sans que son jour soit encore coché.
     Passé DUREE_MAX_SEANCE après son lancement ou sa dernière reprise, elle ne
     compte plus (minuteur oublié en pause toute une nuit, par exemple). */
  function seanceOuverte() {
    var age = Date.now() - minuteur.debutA;
    if (minuteur.statut === "pret" || !L.estCleValide(minuteur.jour) || !(age >= 0 && age <= DUREE_MAX_SEANCE)) {
      return false;
    }
    return !(minuteur.statut !== "en-cours" && ficheDuJour(minuteur.jour));
  }

  /* Message du minuteur terminé, selon que le jour affiché est coché ou non. */
  function messageTempsEcoule() {
    return ficheDuJour(cleJour) ?
      "Le temps est écoulé. Belle séance !" :
      "C’est l’heure ! Pose ton crayon, ou continue si le cœur t’en dit. " +
      "Quand tu as fini, coche « C’est fait ».";
  }

  function arreterHorloge() {
    if (horloge !== null) {
      window.clearInterval(horloge);
      horloge = null;
    }
  }

  function battre() {
    if (minuteur.statut !== "en-cours") {
      arreterHorloge();
      return;
    }
    if (minuteur.finA - Date.now() <= 0) {
      terminerMinuteur();
      return;
    }
    afficherTemps();
  }

  function lancerHorloge() {
    if (horloge === null) {
      horloge = window.setInterval(battre, PERIODE_BATTEMENT);
    }
  }

  function demarrerMinuteur() {
    preparerAudio(false);
    minuteur.statut = "en-cours";
    minuteur.debutA = Date.now();
    minuteur.finA = minuteur.debutA + minuteur.dureeMin * 60000;
    minuteur.resteMs = 0;
    /* La séance appartient au jour affiché à son lancement, même si minuit
       passe avant qu’elle soit cochée (voir verifierJour). */
    minuteur.jour = cleJour;
    texte(el.minuteurMessage, "");
    memoriserMinuteur();
    lancerHorloge();
    rendreMinuteur();
    focusser(el.btnPause);
  }

  function mettreEnPause() {
    if (minuteur.statut !== "en-cours") {
      return;
    }
    minuteur.resteMs = Math.max(0, minuteur.finA - Date.now());
    if (minuteur.resteMs <= 0) {
      terminerMinuteur();
      return;
    }
    minuteur.statut = "pause";
    arreterHorloge();
    memoriserMinuteur();
    rendreMinuteur();
    focusser(el.btnReprendre);
  }

  function reprendreMinuteur() {
    if (minuteur.statut !== "pause") {
      return;
    }
    preparerAudio(false);
    /* Reprendre relance aussi le plafond DUREE_MAX_SEANCE (voir seanceOuverte). */
    minuteur.debutA = Date.now();
    minuteur.finA = minuteur.debutA + minuteur.resteMs;
    minuteur.statut = "en-cours";
    memoriserMinuteur();
    lancerHorloge();
    rendreMinuteur();
    focusser(el.btnPause);
  }

  /* Remet le minuteur au repos, sans toucher à la durée choisie. */
  function remettreAZero() {
    arreterHorloge();
    minuteur.statut = "pret";
    minuteur.finA = 0;
    minuteur.resteMs = 0;
    minuteur.jour = "";
    minuteur.debutA = 0;
    texte(el.minuteurMessage, "");
    memoriserMinuteur();
  }

  function reinitialiserMinuteur() {
    remettreAZero();
    synchroniserDuree();
    rendreMinuteur();
    focusser(el.btnDemarrer);
    /* La séance est close : si minuit est passé entre-temps, on change de jour. */
    verifierJour();
  }

  function terminerMinuteur() {
    var message = messageTempsEcoule();
    var avaitLeFocus = doc.activeElement === el.btnPause;
    arreterHorloge();
    minuteur.statut = "fini";
    minuteur.resteMs = 0;
    memoriserMinuteur();
    texte(el.minuteurMessage, message);
    rendreMinuteur();
    if (avaitLeFocus) {
      focusser(el.btnDemarrer);
    }
    if (vueActive !== "aujourdhui") {
      /* La zone du minuteur est masquée : on passe par la zone d’annonce commune. */
      annoncer(message);
    }
    if (etat.reglages.son) {
      jouerCarillon();
    }
  }

  function surChoixDuree(valeur) {
    if (minuteur.statut === "en-cours" || minuteur.statut === "pause" || L.DUREES.indexOf(valeur) === -1) {
      rendreMinuteur();
      return;
    }
    if (minuteur.statut === "fini") {
      remettreAZero();
      /* La séance est close : si minuit est passé entre-temps, on change de
         jour avant d’appliquer la durée choisie, pour qu’elle soit gardée. */
      verifierJour();
    }
    minuteur.dureeMin = valeur;
    minuteur.manuel = true;
    rendreMinuteur();
  }

  /* --- Son : un contexte audio n’est créé qu’après un geste de l’utilisateur,
     et tout échec est ignoré en silence. --- */

  function reveillerAudio() {
    var promesse;
    if (audio && audio.state === "suspended" && typeof audio.resume === "function") {
      promesse = audio.resume();
      if (promesse && typeof promesse["catch"] === "function") {
        promesse["catch"](function () { /* ignoré */ });
      }
    }
  }

  function preparerAudio(force) {
    var Contexte;
    if (!force && !etat.reglages.son) {
      return;
    }
    try {
      if (!audio) {
        Contexte = window.AudioContext || window.webkitAudioContext;
        if (!Contexte) {
          return;
        }
        audio = new Contexte();
      }
      reveillerAudio();
    } catch (e) {
      audio = null;
    }
  }

  function jouerNote(frequence, debut) {
    var oscillateur = audio.createOscillator();
    var volume = audio.createGain();
    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(frequence, debut);
    /* Attaque douce puis longue extinction, comme une petite cloche. */
    volume.gain.setValueAtTime(0.0001, debut);
    volume.gain.exponentialRampToValueAtTime(0.16, debut + 0.03);
    volume.gain.exponentialRampToValueAtTime(0.0001, debut + 1.4);
    oscillateur.connect(volume);
    volume.connect(audio.destination);
    oscillateur.start(debut);
    oscillateur.stop(debut + 1.5);
  }

  function jouerCarillon() {
    var notes = [523.25, 659.25, 783.99, 1046.5]; /* do, mi, sol, do */
    var debut, i;
    if (!audio) {
      return; /* aucun geste n’a permis de créer le contexte : on reste muet */
    }
    try {
      reveillerAudio();
      debut = audio.currentTime + 0.05;
      for (i = 0; i < notes.length; i++) {
        jouerNote(notes[i], debut + i * 0.3);
      }
    } catch (e) { /* ignoré */ }
  }

  /* ------------------------------------------------------------------ */
  /* Écran « Calendrier »                                                */
  /* ------------------------------------------------------------------ */

  function moisDe(cle) {
    return { annee: parseInt(cle.slice(0, 4), 10), mois: parseInt(cle.slice(5, 7), 10) };
  }

  function moisCourant() {
    return moisDe(cleJour);
  }

  /* Dernier mois où l’on peut naviguer : le mois courant, ou un mois à venir
     s’il contient un jour déjà coché (fichier importé, horloge déréglée),
     pour qu’on puisse le voir et le décocher. */
  function dernierMoisVisible() {
    var derniere = cleJour;
    var nom;
    for (nom in etat.jours) {
      /* Les clés "AAAA-MM-JJ" se comparent comme des dates. */
      if (possede(etat.jours, nom) && nom > derniere) {
        derniere = nom;
      }
    }
    return moisDe(derniere);
  }

  /* Négatif si a est avant b, 0 si c’est le même mois. */
  function comparerMois(a, b) {
    return (a.annee - b.annee) * 12 + (a.mois - b.mois);
  }

  function decalerMois(m, n) {
    var index = m.annee * 12 + (m.mois - 1) + n;
    return { annee: Math.floor(index / 12), mois: (index % 12) + 1 };
  }

  /* Case d’un jour : un bouton pour aujourd’hui et le passé, un simple texte
     pour l’avenir. Exception : un jour à venir déjà coché (fichier importé,
     horloge déréglée) garde sa coche et reste un bouton, pour pouvoir être
     décoché. Chaque état a sa forme et son libellé, pas seulement sa couleur. */
  function creerJour(cle, jokers) {
    var ecart = L.ecartJours(cleJour, cle);
    var fiche = ficheDuJour(cle);
    var numero = String(parseInt(cle.slice(8, 10), 10));
    var nomDate = L.formaterDate(cle, false);
    var pastille = creer("span", "jour-pastille");
    var classes = "jour";
    var marque = "";
    var etiquette = nomDate;
    var element;

    pastille.setAttribute("aria-hidden", "true");
    pastille.appendChild(creer("span", "jour-numero", numero));

    if (ecart > 0 && !fiche) {
      element = creer("span", "jour est-futur");
      element.appendChild(pastille);
      element.appendChild(creer("span", "visuellement-cache", nomDate + ", à venir"));
      return element;
    }

    if (ecart === 0) {
      classes += " est-aujourdhui";
      etiquette += ", aujourd’hui";
    }
    if (fiche) {
      classes += " est-fait";
      etiquette += ecart > 0 ? ", jour à venir déjà coché" : ", dessin fait";
      marque = "✓";
    } else if (jokers[cle] === true) {
      classes += " est-joker";
      etiquette += ", jour sans dessin couvert par un joker";
      marque = "◆";
    } else {
      etiquette += ecart === 0 ? ", pas encore coché" : ", pas de dessin coché";
    }
    if (marque !== "") {
      pastille.appendChild(creer("span", "jour-marque", marque));
    }

    element = creer("button", classes);
    element.setAttribute("type", "button");
    element.setAttribute("data-cle", cle);
    element.setAttribute("aria-label", etiquette + ". Voir le détail");
    element.setAttribute("aria-haspopup", "dialog");
    element.appendChild(pastille);
    return element;
  }

  function rendrePaliers(total) {
    var prochain = L.prochainPalier(total);
    var i, palier, item, corps, atteint, estProchain, detail;
    vider(el.paliersListe);
    for (i = 0; i < L.PALIERS.length; i++) {
      palier = L.PALIERS[i];
      atteint = palier.seuil <= total;
      estProchain = prochain !== null && prochain.seuil === palier.seuil;
      item = creer("li", "palier" + (atteint ? " est-atteint" : "") + (estProchain ? " est-prochain" : ""));
      item.appendChild(creer("span", "palier-marque", atteint ? "✓" : String(palier.seuil)));
      item.firstChild.setAttribute("aria-hidden", "true");
      detail = pluriel(palier.seuil, "jour dessiné", "jours dessinés");
      if (atteint) {
        detail += " · atteint";
      } else if (estProchain) {
        detail += " · prochain palier, encore " + pluriel(palier.seuil - total, "jour", "jours");
      }
      corps = creer("span", "palier-corps");
      corps.appendChild(creer("span", "palier-nom", palier.nom));
      corps.appendChild(creer("span", "palier-detail", detail));
      item.appendChild(corps);
      el.paliersListe.appendChild(item);
    }
    texte(el.paliersProchain, prochain !== null ?
      "Prochain palier : « " + prochain.nom + " », encore " +
        pluriel(prochain.seuil - total, "jour", "jours") + " de dessin." :
      "Tous les paliers sont atteints. Chapeau !");
  }

  function rendreCalendrier() {
    var serie = L.calculerSerie(etat.jours, cleJour);
    var courant = moisCourant();
    var limite = dernierMoisVisible();
    var total = L.totalJours(etat.jours);
    var couverts = L.jokersHistorique(etat.jours, cleJour);
    var jokers = {};
    var semaines, i, j, ligne, cellule;

    /* Pas de navigation au-delà du mois courant (ou du dernier mois à venir
       qui contient un jour déjà coché). */
    if (moisAffiche === null) {
      moisAffiche = courant;
    } else if (comparerMois(moisAffiche, limite) > 0) {
      moisAffiche = limite;
    }

    texte(el.statSerie, String(serie.serie));
    /* Même parcours que la série en cours : jamais inférieure à elle. */
    texte(el.statMeilleure, String(L.meilleureSerie(etat.jours, cleJour)));
    texte(el.statTotal, String(total));
    texte(el.statMois, String(L.compterMois(etat.jours, courant.annee, courant.mois)));

    /* Tous les jours couverts par un joker, anciennes séries comprises. */
    for (i = 0; i < couverts.length; i++) {
      jokers[couverts[i]] = true;
    }

    texte(el.moisTitre, majuscule(L.NOMS_MOIS[moisAffiche.mois - 1]) + " " + moisAffiche.annee);
    el.btnMoisSuiv.disabled = comparerMois(moisAffiche, limite) >= 0;
    el.btnMoisCourant.disabled = comparerMois(moisAffiche, courant) === 0;
    el.btnMoisPrec.disabled = comparerMois(moisAffiche, MOIS_MIN) <= 0;

    semaines = L.grilleMois(moisAffiche.annee, moisAffiche.mois);
    vider(el.grilleCorps);
    for (i = 0; i < semaines.length; i++) {
      ligne = doc.createElement("tr");
      for (j = 0; j < semaines[i].length; j++) {
        cellule = creer("td", "jour-case");
        if (semaines[i][j] !== null) {
          cellule.appendChild(creerJour(semaines[i][j], jokers));
        }
        ligne.appendChild(cellule);
      }
      el.grilleCorps.appendChild(ligne);
    }

    rendrePaliers(total);
  }

  function boutonDuJour(cle) {
    var boutons = el.grilleCorps.getElementsByTagName("button");
    var i;
    for (i = 0; i < boutons.length; i++) {
      if (boutons[i].getAttribute("data-cle") === cle) {
        return boutons[i];
      }
    }
    return null;
  }

  function changerMois(decalage) {
    var cible = decalerMois(moisAffiche, decalage);
    if (comparerMois(cible, dernierMoisVisible()) > 0 || comparerMois(cible, MOIS_MIN) < 0) {
      return;
    }
    moisAffiche = cible;
    rendreCalendrier();
    /* Un bouton qui vient de se désactiver perd le focus : on le rattrape. */
    if (decalage > 0 && el.btnMoisSuiv.disabled) {
      focusser(el.btnMoisPrec);
    } else if (decalage < 0 && el.btnMoisPrec.disabled) {
      focusser(el.btnMoisSuiv);
    }
  }

  function revenirAuMoisCourant() {
    moisAffiche = moisCourant();
    rendreCalendrier();
    focusser(boutonDuJour(cleJour) || el.btnMoisPrec);
  }

  /* Flèches du clavier dans la grille : d’un jour ou d’une semaine à l’autre. */
  function surToucheGrille(evenement) {
    var deltas = { ArrowLeft: -1, Left: -1, ArrowRight: 1, Right: 1, ArrowUp: -7, Up: -7, ArrowDown: 7, Down: 7 };
    var bouton = remonter(evenement.target, "data-cle", el.grilleCorps);
    var cible;
    if (!bouton || !possede(deltas, evenement.key)) {
      return;
    }
    cible = boutonDuJour(L.ajouterJours(bouton.getAttribute("data-cle"), deltas[evenement.key]));
    if (cible) {
      evenement.preventDefault();
      focusser(cible);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Dialogues (élément <dialog> natif, avec repli)                      */
  /* ------------------------------------------------------------------ */

  function estOuvert(dialogue) {
    return dialogue.hasAttribute("open");
  }

  /* Remise en ordre après la fermeture d’un dialogue. Appelée directement par
     fermerDialogue et par l’événement « close » (touche Échap) : le second
     appel ne fait rien. */
  function apresFermeture(dialogue) {
    var cible;
    if (estOuvert(dialogue) || dialogueOuvert !== dialogue) {
      return;
    }
    dialogueOuvert = null;
    if (dialogue === el.detail) {
      cible = detailCle ? boutonDuJour(detailCle) : null;
      detailCle = null;
      montrer(el.detailPalier, false);
      focusser(cible || el.moisTitre);
    } else if (dialogue === el.confirmation) {
      cible = confirmationRetour;
      confirmationAction = null;
      confirmationRetour = null;
      focusser(cible);
    }
  }

  function ouvrirDialogue(dialogue, premierFocus) {
    if (dialogueOuvert && dialogueOuvert !== dialogue) {
      fermerDialogue(dialogueOuvert);
    }
    dialogueOuvert = dialogue;
    if (estOuvert(dialogue)) {
      return;
    }
    if (typeof dialogue.showModal === "function") {
      try {
        dialogue.showModal();
        focusser(premierFocus);
        return;
      } catch (e) { /* on passe au repli ci-dessous */ }
    }
    /* Repli : navigateur sans <dialog> natif. */
    dialogue.setAttribute("open", "");
    mettreClasse(dialogue, "dialogue-repli", true);
    dialogue.setAttribute("role", "dialog");
    dialogue.setAttribute("aria-modal", "true");
    montrer(el.voile, true);
    focusser(premierFocus);
  }

  function fermerDialogue(dialogue) {
    if (aClasse(dialogue, "dialogue-repli")) {
      dialogue.removeAttribute("open");
      mettreClasse(dialogue, "dialogue-repli", false);
      montrer(el.voile, false);
    } else if (estOuvert(dialogue) && typeof dialogue.close === "function") {
      try {
        dialogue.close();
      } catch (e) {
        dialogue.removeAttribute("open");
      }
    }
    apresFermeture(dialogue);
  }

  /* Dans le repli, la tabulation reste dans le dialogue. */
  function piegerTabulation(evenement, dialogue) {
    var boutons = dialogue.getElementsByTagName("button");
    var visibles = [];
    var i, premier, dernier;
    for (i = 0; i < boutons.length; i++) {
      if (!boutons[i].disabled && boutons[i].offsetParent !== null) {
        visibles.push(boutons[i]);
      }
    }
    if (visibles.length === 0) {
      return;
    }
    premier = visibles[0];
    dernier = visibles[visibles.length - 1];
    if (evenement.shiftKey && (doc.activeElement === premier || visibles.indexOf(doc.activeElement) === -1)) {
      evenement.preventDefault();
      focusser(dernier);
    } else if (!evenement.shiftKey && (doc.activeElement === dernier || visibles.indexOf(doc.activeElement) === -1)) {
      evenement.preventDefault();
      focusser(premier);
    }
  }

  function surToucheDocument(evenement) {
    if (!dialogueOuvert || !aClasse(dialogueOuvert, "dialogue-repli")) {
      return; /* le <dialog> natif gère lui-même Échap et la tabulation */
    }
    if (evenement.key === "Escape" || evenement.key === "Esc") {
      evenement.preventDefault();
      fermerDialogue(dialogueOuvert);
    } else if (evenement.key === "Tab") {
      piegerTabulation(evenement, dialogueOuvert);
    }
  }

  function brancherDialogue(dialogue) {
    dialogue.addEventListener("close", function () {
      apresFermeture(dialogue);
    });
    /* Un clic sur le fond (hors du contenu) ferme le dialogue. */
    dialogue.addEventListener("click", function (evenement) {
      if (evenement.target === dialogue) {
        fermerDialogue(dialogue);
      }
    });
  }

  /* options : { titre, texte, oui, danger, retour } ; action : appelée si on confirme. */
  function demanderConfirmation(options, action) {
    texte(el.confirmationTitre, options.titre);
    texte(el.confirmationTexte, options.texte);
    texte(el.confirmationOui, options.oui);
    mettreClasse(el.confirmationOui, "bouton-danger", !!options.danger);
    mettreClasse(el.confirmationOui, "bouton", !options.danger);
    /* Le focus part sur « Annuler » : confirmer demande un geste volontaire. */
    ouvrirDialogue(el.confirmation, el.confirmationNon);
    confirmationAction = action;
    confirmationRetour = options.retour || null;
  }

  function surConfirmation() {
    var action = confirmationAction;
    fermerDialogue(el.confirmation);
    if (typeof action === "function") {
      action();
    }
  }

  /* --- Détail d’un jour du calendrier --- */

  function rendreDetail() {
    var cle = detailCle;
    var fiche, exercice, estFutur, estAujourdhui, titre, theme, consigne, duree;
    if (!cle) {
      return;
    }
    fiche = ficheDuJour(cle);
    estAujourdhui = cle === cleJour;
    estFutur = L.ecartJours(cleJour, cle) > 0;
    if (estFutur && !fiche) {
      /* Un jour à venir ne s’ouvre que pour être décoché : une fois sa coche
         retirée (ici ou dans un autre onglet), il n’y a plus rien à montrer. */
      fermerDialogue(el.detail);
      return;
    }

    texte(el.detailTitre, majuscule(L.formaterDate(cle, true)));

    if (fiche) {
      texte(el.detailStatut, estFutur ? "Jour à venir, déjà coché." : "Dessin fait.");
      exercice = fiche.exerciceId ? L.exerciceParId(fiche.exerciceId) : null;
      titre = fiche.titre || (exercice ? chaine(exercice.titre) : "") || "Exercice non noté";
      theme = fiche.themeNom || (exercice ? chaine(exercice.themeNom) : "");
      duree = fiche.duree;
      texte(el.detailExoLabel, "Exercice fait");
    } else {
      if (L.calculerSerie(etat.jours, cleJour).jokers.indexOf(cle) !== -1) {
        texte(el.detailStatut, "Jour sans dessin, couvert par un joker : la série continue.");
      } else if (L.jokersHistorique(etat.jours, cleJour).indexOf(cle) !== -1) {
        /* Joker d’une ancienne série : il reste acquis, sans parler de la série en cours. */
        texte(el.detailStatut, "Jour sans dessin, couvert par un joker.");
      } else if (estAujourdhui) {
        texte(el.detailStatut, "Pas encore coché aujourd’hui.");
      } else {
        texte(el.detailStatut, "Pas de dessin coché ce jour-là.");
      }
      /* Même règle que marquerJour : le tirage mémorisé pour ce jour, sinon 0. */
      exercice = estAujourdhui ? exerciceCourant() : L.exerciceDuJour(cle, L.tirageDuJour(etat, cle));
      titre = exercice ? (chaine(exercice.titre) || "Exercice sans titre") : "Exercice introuvable";
      theme = exercice ? chaine(exercice.themeNom) : "";
      duree = exercice ? nombre(exercice.duree) : 0;
      texte(el.detailExoLabel, estAujourdhui ? "Exercice proposé aujourd’hui" : "Exercice proposé ce jour-là");
    }
    consigne = exercice ? chaine(exercice.consigne) : "";

    texte(el.detailExoTitre, titre);
    if (theme !== "" && duree > 0) {
      theme += " · " + duree + " min";
    } else if (duree > 0) {
      theme = duree + " min";
    }
    texte(el.detailExoTheme, theme);
    texte(el.detailExoConsigne, consigne);

    montrer(el.detailRessenti, !!fiche);
    if (fiche) {
      majRessenti(el.detailRessenti, fiche.ressenti);
    }

    texte(el.detailBasculer, fiche ? "Décocher ce jour" : "Marquer comme fait");
    mettreClasse(el.detailBasculer, "bouton", !fiche);
    mettreClasse(el.detailBasculer, "bouton-secondaire", !!fiche);
  }

  function ouvrirDetail(cle) {
    var ecart = L.ecartJours(cleJour, cle);
    if (ecart === null || (ecart > 0 && !ficheDuJour(cle))) {
      return; /* clé invalide, ou jour à venir sans coche : pas de détail */
    }
    detailCle = cle;
    montrer(el.detailPalier, false);
    texte(el.detailAnnonce, "");
    rendreDetail();
    ouvrirDialogue(el.detail, el.detailTitre);
  }

  /* Coche ou décoche le jour ouvert (utile si on a dessiné sans cocher).
     Un jour à venir ne peut qu’être décoché. */
  function basculerDetail() {
    var cle = detailCle;
    var ecart = cle ? L.ecartJours(cleJour, cle) : null;
    var paliers, annonce;
    if (ecart === null || (ecart > 0 && !ficheDuJour(cle))) {
      return;
    }
    if (ficheDuJour(cle)) {
      etat = L.annulerFait(etat, cle);
      montrer(el.detailPalier, false);
      annonce = "Jour décoché.";
    } else {
      paliers = marquerJour(cle);
      annonce = "Jour marqué comme fait.";
      if (paliers.length > 0) {
        annonce += " " + montrerPalier(el.detailPalier, paliers);
      }
    }
    enregistrer();
    rendreTout();
    /* Décocher un jour à venir referme le détail (voir rendreDetail) :
       l’annonce passe alors par la zone commune. */
    annoncer(annonce, detailCle ? el.detailAnnonce : el.annonce);
  }

  /* ------------------------------------------------------------------ */
  /* Écran « Réglages »                                                  */
  /* ------------------------------------------------------------------ */

  function cocherRadios(conteneur, valeur) {
    var radios = conteneur.getElementsByTagName("input");
    var i;
    for (i = 0; i < radios.length; i++) {
      radios[i].checked = radios[i].value === valeur;
    }
  }

  function rendreReglages() {
    cocherRadios(el.reglageDurees, String(etat.reglages.duree));
    cocherRadios(el.reglageThemes, etat.reglages.theme);
    el.reglageSon.checked = etat.reglages.son;
  }

  function changerReglages(modifs) {
    etat = L.modifierReglages(etat, modifs);
    enregistrer();
    appliquerTheme();
    synchroniserDuree();
    rendreTout();
  }

  function messageSauvegarde(message, estErreur) {
    mettreClasse(el.sauvegardeMessage, "message-erreur", !!estErreur);
    texte(el.sauvegardeMessage, "");
    texte(el.sauvegardeMessage, message);
  }

  /* Télécharge la progression : Blob + lien temporaire, sans aucun réseau. */
  function exporter() {
    var nom = "dessin-du-jour-" + L.aujourdHui() + ".json";
    var fabrique = window.URL || window.webkitURL;
    var blob, url, lien;
    try {
      blob = new Blob([L.versJSON(etat, true)], { type: "application/json" });
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
      messageSauvegarde("Export prêt : « " + nom + " ». Garde ce fichier dans un endroit sûr.", false);
    } catch (e) {
      messageSauvegarde("L’export n’a pas pu être créé dans ce navigateur.", true);
    }
  }

  function appliquerImport(nouvelEtat, nombreJours) {
    var nonVus, seuils, i;
    etat = nouvelEtat;
    /* Les paliers déjà atteints dans le fichier ne sont pas « franchis » aujourd’hui. */
    nonVus = L.paliersNonVus(etat);
    seuils = [];
    for (i = 0; i < nonVus.length; i++) {
      seuils.push(nonVus[i].seuil);
    }
    if (seuils.length > 0) {
      etat = L.marquerPaliersVus(etat, seuils);
    }
    /* Remplacement voulu et confirmé : l’écriture est de nouveau permise. */
    stockage.protege = false;
    moisAffiche = null;
    palierJourCle = null;
    if (minuteur.statut === "pret") {
      minuteur.manuel = false;
    }
    enregistrer();
    appliquerTheme();
    synchroniserDuree();
    rendreTout();
    messageSauvegarde("Import terminé : ta progression contient maintenant " +
      pluriel(nombreJours, "jour dessiné", "jours dessinés") + ".", false);
  }

  /* Le contenu du fichier n’est jamais affiché : seul un nombre de jours l’est. */
  function traiterImport(contenu) {
    var objet, resultat, nombreJours, actuel;
    if (contenu.charCodeAt(0) === 0xFEFF) {
      contenu = contenu.slice(1); /* marque d’ordre des octets en tête de fichier */
    }
    try {
      objet = JSON.parse(contenu);
    } catch (e) {
      messageSauvegarde("Import impossible : ce fichier n’est pas une sauvegarde lisible (JSON invalide). " +
        "Ta progression actuelle n’a pas été modifiée.", true);
      return;
    }
    resultat = L.validerEtat(objet);
    if (!resultat.ok) {
      messageSauvegarde("Import impossible. " + chaine(resultat.erreur) +
        " Ta progression actuelle n’a pas été modifiée.", true);
      return;
    }
    nombreJours = L.totalJours(resultat.etat.jours);
    actuel = L.totalJours(etat.jours);
    demanderConfirmation({
      titre: "Remplacer ta progression ?",
      texte: "Ce fichier contient " + pluriel(nombreJours, "jour dessiné", "jours dessinés") +
        ". Ta progression actuelle (" + pluriel(actuel, "jour dessiné", "jours dessinés") +
        ") et tes réglages seront remplacés par son contenu.",
      oui: "Remplacer",
      danger: false,
      retour: el.btnImporter
    }, function () {
      appliquerImport(resultat.etat, nombreJours);
    });
  }

  function surFichierChoisi() {
    var fichiers = el.fichierImport.files;
    var fichier = fichiers && fichiers.length > 0 ? fichiers[0] : null;
    var lecteur;
    if (!fichier) {
      return;
    }
    if (fichier.size > TAILLE_MAX_IMPORT) {
      messageSauvegarde("Import impossible : ce fichier est trop volumineux pour être une sauvegarde " +
        "de Dessin du jour.", true);
      return;
    }
    if (!window.FileReader) {
      messageSauvegarde("Import impossible : ce navigateur ne sait pas lire un fichier choisi.", true);
      return;
    }
    lecteur = new window.FileReader();
    lecteur.onload = function () {
      traiterImport(String(lecteur.result));
    };
    lecteur.onerror = function () {
      messageSauvegarde("Import impossible : le fichier n’a pas pu être lu.", true);
    };
    lecteur.readAsText(fichier);
  }

  function toutEffacer() {
    var magasin = magasinLocal();
    var cles = [];
    var i, nom;
    etat = L.etatInitial();
    stockage.protege = false;
    stockage.cleCopie = "";
    if (magasin) {
      try {
        magasin.removeItem(CLE);
        /* Les copies de données illisibles partent aussi : « tout » veut dire tout. */
        for (i = 0; i < magasin.length; i++) {
          nom = magasin.key(i);
          if (typeof nom === "string" && nom.indexOf(PREFIXE_COPIE) === 0) {
            cles.push(nom);
          }
        }
        for (i = 0; i < cles.length; i++) {
          magasin.removeItem(cles[i]);
        }
      } catch (e) {
        stockage.disponible = false;
      }
    }
    remettreAZero();
    minuteur.manuel = false;
    moisAffiche = null;
    palierJourCle = null;
    montrer(el.bandeauIllisible, false);
    appliquerTheme();
    synchroniserDuree();
    rendreTout();
    messageSauvegarde("Tout est effacé. Tu repars d’une page blanche.", false);
  }

  function surEffacer() {
    var total = L.totalJours(etat.jours);
    demanderConfirmation({
      titre: "Tout effacer ?",
      texte: "Ta progression (" + pluriel(total, "jour dessiné", "jours dessinés") +
        "), tes paliers et tes réglages seront supprimés de ce navigateur. C’est définitif : " +
        "si tu veux en garder une trace, exporte d’abord ta progression.",
      oui: "Oui, tout effacer",
      danger: true,
      retour: el.btnEffacer
    }, toutEffacer);
  }

  /* ------------------------------------------------------------------ */
  /* Rendu général et changement de jour                                 */
  /* ------------------------------------------------------------------ */

  function rendreTout() {
    rendreAujourdhui();
    rendreCalendrier();
    rendreReglages();
    if (detailCle) {
      rendreDetail();
    }
    majBandeaux();
  }

  /* Si la page est restée ouverte après minuit, l’écran passe au nouveau jour.
     Exception : tant qu’une séance de minuteur lancée sur le jour affiché est
     ouverte (voir seanceOuverte), l’écran reste sur ce jour, pour que
     l’exercice ne change pas en pleine séance et que « C’est fait » crédite
     le bon jour. surFait, reinitialiserMinuteur et surChoixDuree rappellent
     cette fonction quand la séance se clôt. */
  function verifierJour() {
    var maintenant = L.aujourdHui();
    var ancien = cleJour;
    var etaitRetenu = jourRetenu;
    if (!maintenant || maintenant === cleJour) {
      jourRetenu = false;
      return;
    }
    if (seanceOuverte() && minuteur.jour === cleJour) {
      jourRetenu = true;
      return;
    }
    jourRetenu = false;
    cleJour = maintenant;
    if (minuteur.statut === "fini") {
      /* Minuteur terminé la veille : cadran, message et titre de l’onglet repartent à neuf. */
      remettreAZero();
    }
    if (minuteur.statut === "pret") {
      minuteur.manuel = false;
    }
    synchroniserDuree();
    rendreTout();
    if (etaitRetenu) {
      /* L’écran était resté sur la veille le temps de la séance : on explique le saut. */
      texte(el.minuteurMessage, ficheDuJour(ancien) ?
        "Ta séance du " + L.formaterDate(ancien, false) + " est cochée. Minuit est passé : voici le nouveau jour." :
        "Minuit est passé : voici le nouveau jour. Si tu as dessiné le " + L.formaterDate(ancien, false) +
          ", tu peux le cocher dans le calendrier.");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Branchement des événements                                          */
  /* ------------------------------------------------------------------ */

  function brancherRessenti(conteneur, lireCle) {
    conteneur.addEventListener("click", function (evenement) {
      var bouton = remonter(evenement.target, "data-ressenti", conteneur);
      if (bouton) {
        changerRessenti(lireCle(), bouton.getAttribute("data-ressenti"));
      }
    });
  }

  function brancher() {
    /* Lien d’évitement : il ne doit pas changer l’ancre, qui sert à la navigation. */
    el.lienEvitement.addEventListener("click", function (evenement) {
      evenement.preventDefault();
      focusser(el.contenu);
    });

    window.addEventListener("hashchange", surChangementAncre);

    /* Aujourd’hui */
    el.btnChanger.addEventListener("click", surChanger);
    el.btnFait.addEventListener("click", surFait);
    el.btnAnnuler.addEventListener("click", surAnnuler);
    brancherRessenti(el.ressentiJour, function () {
      return cleJour;
    });

    /* Minuteur */
    el.minuteurDurees.addEventListener("change", function (evenement) {
      if (evenement.target && evenement.target.name === "minuteur-duree") {
        surChoixDuree(Number(evenement.target.value));
      }
    });
    el.btnDemarrer.addEventListener("click", demarrerMinuteur);
    el.btnPause.addEventListener("click", mettreEnPause);
    el.btnReprendre.addEventListener("click", reprendreMinuteur);
    el.btnReinitialiser.addEventListener("click", reinitialiserMinuteur);
    /* Après un rechargement, n’importe quel clic redonne le droit de jouer le carillon. */
    doc.addEventListener("click", function () {
      if (minuteur.statut === "en-cours") {
        preparerAudio(false);
      }
    }, true);

    /* Calendrier */
    el.btnMoisPrec.addEventListener("click", function () {
      changerMois(-1);
    });
    el.btnMoisSuiv.addEventListener("click", function () {
      changerMois(1);
    });
    el.btnMoisCourant.addEventListener("click", revenirAuMoisCourant);
    el.grilleCorps.addEventListener("click", function (evenement) {
      var bouton = remonter(evenement.target, "data-cle", el.grilleCorps);
      if (bouton) {
        ouvrirDetail(bouton.getAttribute("data-cle"));
      }
    });
    el.grilleCorps.addEventListener("keydown", surToucheGrille);

    /* Dialogues */
    brancherDialogue(el.detail);
    brancherDialogue(el.confirmation);
    el.detailFermer.addEventListener("click", function () {
      fermerDialogue(el.detail);
    });
    el.detailBasculer.addEventListener("click", basculerDetail);
    brancherRessenti(el.detailRessenti, function () {
      return detailCle;
    });
    el.confirmationOui.addEventListener("click", surConfirmation);
    el.confirmationNon.addEventListener("click", function () {
      fermerDialogue(el.confirmation);
    });
    el.voile.addEventListener("click", function () {
      if (dialogueOuvert) {
        fermerDialogue(dialogueOuvert);
      }
    });
    doc.addEventListener("keydown", surToucheDocument);

    /* Réglages */
    el.reglageDurees.addEventListener("change", function (evenement) {
      var valeur;
      if (evenement.target && evenement.target.name === "reglage-duree") {
        valeur = evenement.target.value;
        /* Le nouveau réglage remplace une durée choisie à la main : tout de
           suite si le minuteur est au repos, sinon à sa remise à zéro
           (synchroniserDuree n’agit qu’au repos). */
        minuteur.manuel = false;
        changerReglages({ duree: valeur === L.DUREE_AUTO ? valeur : Number(valeur) });
      }
    });
    el.reglageThemes.addEventListener("change", function (evenement) {
      if (evenement.target && evenement.target.name === "reglage-theme") {
        changerReglages({ theme: evenement.target.value });
      }
    });
    el.reglageSon.addEventListener("change", function () {
      changerReglages({ son: !!el.reglageSon.checked });
    });
    el.btnTestSon.addEventListener("click", function () {
      preparerAudio(true);
      jouerCarillon();
    });
    el.btnExporter.addEventListener("click", exporter);
    el.btnImporter.addEventListener("click", function () {
      el.fichierImport.value = ""; /* pour pouvoir rechoisir le même fichier */
      el.fichierImport.click();
    });
    el.fichierImport.addEventListener("change", surFichierChoisi);
    el.btnEffacer.addEventListener("click", surEffacer);
    el.btnFermerIllisible.addEventListener("click", function () {
      montrer(el.bandeauIllisible, false);
      focusser(el.contenu);
    });

    /* Deux onglets ouverts : on suit les changements faits dans l’autre. */
    window.addEventListener("storage", function (evenement) {
      if (evenement.key === null || evenement.key === CLE) {
        relireStockage();
      }
    });

    /* Passage de minuit et retour sur l’onglet. */
    doc.addEventListener("visibilitychange", function () {
      if (!doc.hidden) {
        verifierJour();
        battre();
      }
    });
    window.addEventListener("focus", verifierJour);
    window.addEventListener("pageshow", verifierJour);
    window.setInterval(verifierJour, PERIODE_VERIF_JOUR);
  }

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                           */
  /* ------------------------------------------------------------------ */

  function collecterElements() {
    var i, element;
    for (i = 0; i < IDS.length; i++) {
      element = doc.getElementById(IDS[i]);
      if (!element) {
        throw new Error("Élément introuvable dans index.html : #" + IDS[i]);
      }
      el[nomCamel(IDS[i])] = element;
    }
  }

  function demarrer() {
    var finiPendantAbsence;
    collecterElements();
    etat = chargerEtat();
    cleJour = L.aujourdHui();
    appliquerTheme();
    finiPendantAbsence = restaurerMinuteur();
    if (seanceOuverte() && L.ecartJours(minuteur.jour, cleJour) === 1) {
      /* Page rechargée après minuit pendant une séance commencée la veille :
         l’écran reste sur le jour de la séance (voir verifierJour). */
      cleJour = minuteur.jour;
      jourRetenu = true;
    }
    synchroniserDuree();
    brancher();
    afficherVue(vueDepuisAncre(), false);
    rendreTout();

    if (stockage.cleCopie !== "") {
      texte(el.bandeauIllisibleTexte, "Les données enregistrées dans ce navigateur étaient illisibles. " +
        "Elles ont été mises de côté sans être effacées, et l’appli repart d’une page blanche. " +
        "Si tu as un export, tu peux l’importer depuis les réglages.");
      montrer(el.bandeauIllisible, true);
    }

    if (minuteur.statut === "en-cours") {
      lancerHorloge();
    } else if (finiPendantAbsence) {
      texte(el.minuteurMessage, "Ton minuteur s’est terminé pendant le rechargement de la page.");
    } else if (minuteur.statut === "fini") {
      texte(el.minuteurMessage, messageTempsEcoule());
    }
  }

  function demarrerProtege() {
    try {
      demarrer();
    } catch (e) {
      erreurFatale("Un problème empêche l’appli de démarrer. Recharge la page ; si ça continue, " +
        "vérifie que tous les fichiers de l’appli sont bien dans le même dossier.");
      throw e;
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", demarrerProtege);
  } else {
    demarrerProtege();
  }
})();
