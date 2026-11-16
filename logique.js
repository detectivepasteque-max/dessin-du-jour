/* ==========================================================================
   Dessin du jour — logique.js
   Logique PURE de l’appli, exposée dans window.DDJ.logique.
   Aucun accès au DOM ni à localStorage. Seule aujourdHui() lit l’horloge.
   Script classique (ES5, pas de module) : fonctionne en file:// comme en HTTP.
   À charger APRÈS donnees/exercices-semaine.js et donnees/exercices-weekend.js
   (les données DDJ.themes et DDJ.generateur sont lues au moment des appels).

   Dans tout ce fichier, une « clé » est une chaîne "AAAA-MM-JJ" en heure LOCALE.
   Usage côté interface :   var L = DDJ.logique;

   --------------------------------------------------------------------------
   1. DATES
   --------------------------------------------------------------------------
   L.cleDate(date)            -> "AAAA-MM-JJ"
       date : objet Date. Utilise les accesseurs locaux. null si date invalide.
   L.aujourdHui()             -> clé du jour courant (seul accès à l’horloge).
   L.estCleValide(chaine)     -> booléen. Vrai seulement pour une vraie date
       au format exact "AAAA-MM-JJ" ("2026-02-30", "2026-3-1", 42... -> false).
   L.dateDepuisCle(cle)       -> objet Date local à 12 h 00, ou null si clé invalide.
   L.ajouterJours(cle, n)     -> clé décalée de n jours (n négatif possible),
       ou null si clé invalide. Insensible aux changements d’heure.
   L.jourSemaine(cle)         -> 0 (dimanche) à 6 (samedi), ou null si clé invalide.
   L.cleLundi(cle)            -> clé du lundi de la semaine (lundi -> dimanche).
   L.ecartJours(cleA, cleB)   -> nombre entier de jours de A vers B
       (positif si B est après A), ou null si une clé est invalide.
   L.grilleMois(annee, mois)  -> tableau de semaines ; mois de 1 à 12.
       Chaque semaine est un tableau de 7 cases, lundi en premier, contenant
       une clé ou null (case hors du mois). [] si les arguments sont invalides.
   L.indexSemaine(cle)        -> entier : nombre de semaines entières écoulées
       depuis le lundi 1er janvier 2024 (négatif avant cette date).
   L.formaterDate(cle, avecAnnee) -> "lundi 16 novembre" ou, si avecAnnee est
       vrai, "lundi 16 novembre 2026" ("1er" pour le premier du mois).
       "" si clé invalide.
   L.NOMS_JOURS  : ["dimanche", "lundi", ..., "samedi"] (index = jourSemaine).
   L.NOMS_MOIS   : ["janvier", ..., "décembre"] (index = mois - 1).

   --------------------------------------------------------------------------
   2. EXERCICE DU JOUR
   --------------------------------------------------------------------------
   L.MAX_TIRAGES = 2          nombre de changements d’exercice permis par jour.
   L.themeDuJour(cle)         -> DDJ.themes[jourSemaine(cle)] (l’objet d’origine,
       à ne pas modifier), ou null s’il manque ou si la clé est invalide.
   L.exerciceDuJour(cle, tirage) -> exercice ou null.
       tirage : entier de 0 à MAX_TIRAGES (0 par défaut ; borné si hors limites).
       Renvoie une COPIE :
         { id, titre, consigne, etapes: [3 chaînes], materiel, siBloque, duree,
           themeCle, themeNom, genere }
       - Déterministe : mêmes arguments (et mêmes données) = même résultat.
       - Banque : ordre mélangé propre à chaque cycle de n semaines ; aucun
         exercice ne revient avant que tous ceux du thème soient passés, et
         jamais deux semaines de suite (pour n >= 3).
       - Tirages 1 et 2 : même thème, différents du tirage 0 et entre eux,
         et si possible différents de l’exercice de la semaine suivante
         (puis de la semaine précédente).
       - Samedi : semaine d’index impair -> tirage 0 GÉNÉRÉ ; index pair ->
         tirage 0 pris dans la banque (une semaine sur deux, donc la banque du
         samedi avance d’un cran toutes les deux semaines). Tirages 1 et 2 du
         samedi : toujours générés, différents entre eux et du tirage 0.
       - Exercice généré : id "gen-<indexSujet>-<indexContrainte>",
         titre = sujet + " " + contrainte (majuscule initiale), duree 20,
         genere true, themeCle / themeNom du samedi.
       - Robustesse : null si la clé est invalide, si le thème manque, ou si
         aucune source n’est disponible. Le samedi, si le générateur manque ou
         est vide, on se rabat sur la banque (et inversement) ; null seulement
         si les deux manquent.
   L.exerciceParId(id)        -> copie enrichie (mêmes champs que ci-dessus) de
       l’exercice de la banque portant cet id, ou exercice généré reconstruit à
       partir de "gen-i-j" ; null si l’id est inconnu ou hors limites.
   L.exerciceGenere(indexSujet, indexContrainte) -> exercice généré, ou null.

   --------------------------------------------------------------------------
   3. SÉRIE, JOKER, PALIERS
   --------------------------------------------------------------------------
   « jours » est un objet dont les clés sont des clés de date (etat.jours) ;
   un jour est « fait » si la clé existe (propriété propre).

   Règle des séries : UN SEUL parcours chronologique, du plus ancien jour fait
   jusqu’à aujourd’hui, sert à calculerSerie, meilleureSerie et jokersHistorique.
     - Les jours postérieurs à aujourd’hui sont ignorés.
     - Une chaîne commence à un jour fait. Tant qu’elle est vivante, un jour
       fait lui ajoute 1 ; un jour manqué (strictement avant aujourd’hui)
       consomme le joker de sa semaine (lundi-dimanche) si aucun joker n’a
       déjà été consommé cette semaine-là, et la chaîne continue ; sinon la
       chaîne est rompue. Sans chaîne vivante, un jour manqué ne consomme rien.
     - Un joker consommé le reste pour sa semaine, même si la chaîne est rompue
       ensuite : un jour couvert ne change donc jamais de statut après coup.
     - Aujourd’hui non fait ne rompt pas la chaîne et ne consomme pas de joker.
     - Un jour couvert ne compte pas dans la longueur de la chaîne.
   Coût : un tri des jours faits, puis un parcours linéaire (indépendant du
   nombre de jours vides entre deux dessins).

   L.calculerSerie(jours, cleAujourdHui)
       -> { serie, jokers, faitAujourdHui, jokerDispoCetteSemaine }
       serie : longueur de la chaîne vivante à cleAujourdHui (nombre de jours
                faits ; 0 si elle est rompue ou s’il n’y en a pas).
       jokers : tableau trié croissant des clés des jours couverts par un
                joker DANS la chaîne vivante (vide si serie vaut 0).
       faitAujourdHui : booléen.
       jokerDispoCetteSemaine : vrai si aucun joker n’a été consommé dans la
                semaine de cleAujourdHui, toutes chaînes confondues.
       Clé ou « jours » invalides : { serie: 0, jokers: [], faitAujourdHui:
       false, jokerDispoCetteSemaine: true }. Ne modifie pas « jours ».
   L.jokersHistorique(jours, cleAujourdHui) -> tableau trié croissant des clés
       de TOUS les jours couverts par un joker depuis le début, anciennes
       chaînes comprises (pour le calendrier). [] si un argument est invalide.
   L.meilleureSerie(jours, cleAujourdHui) -> longueur de la plus longue chaîne
       du parcours (0 si aucun jour) ; jamais inférieure à calculerSerie().serie
       pour la même clé. cleAujourdHui est facultatif : s’il manque (ou s’il
       est invalide), le parcours va jusqu’au jour fait le plus récent.
   L.totalJours(jours)        -> nombre de jours faits (clés valides).
   L.compterMois(jours, annee, mois) -> nombre de jours faits dans le mois (1-12).
   L.PALIERS                  : tableau (gelé) de { seuil, nom }, seuils
       1, 3, 7, 14, 30, 50, 100, 200, 365, basés sur le TOTAL de jours dessinés.
   L.paliersAtteints(total)   -> tableau de copies { seuil, nom } (seuil <= total).
   L.prochainPalier(total)    -> copie { seuil, nom } du prochain palier, ou null
       si tous sont atteints.
   L.paliersNonVus(etat)      -> paliers atteints (d’après totalJours(etat.jours))
       dont le seuil n’est pas dans etat.paliersVus : ceux à fêter maintenant.

   --------------------------------------------------------------------------
   4. ÉTAT (pur : aucune de ces fonctions ne modifie son argument)
   --------------------------------------------------------------------------
   L.CLE_STOCKAGE = "dessin-du-jour:v1"   clé localStorage à utiliser.
   L.DUREES   = [15, 20, 30]              durées du minuteur, en minutes.
   L.DUREE_AUTO = "auto"                  réglage « conseillée par l’exercice ».
   L.THEMES_AFFICHAGE = ["auto", "clair", "sombre"]   pour reglages.theme.
   L.RESSENTIS = ["facile", "bien", "difficile"]
   L.etatInitial() ->
       { version: 1, jours: {}, tirage: { date: null, n: 0 },
         reglages: { duree: "auto", theme: "auto", son: true }, paliersVus: [] }
       reglages.duree : durée du minuteur. "auto" (défaut) = le minuteur
         présélectionne la durée conseillée par l’exercice du jour ; 15, 20
         ou 30 = il présélectionne toujours cette durée. Toute autre valeur
         est remplacée par "auto".
       jours[cle] = { exerciceId, titre, themeNom, duree, ressenti, faitLe }
         exerciceId : chaîne ("" si inconnu) ; titre, themeNom : chaînes ;
         duree : minutes, nombre entier de 0 à 600 (0 = inconnue) ;
         ressenti : "facile" | "bien" | "difficile" | null ;
         faitLe : horodatage ISO (chaîne, "" si inconnu).
   L.validerEtat(objet) -> { ok: true, etat } ou { ok: false, erreur }
       etat : NOUVEL objet nettoyé et complet (valeurs par défaut pour ce qui
       manque, clés de jours invalides écartées, chaînes tronquées, types
       vérifiés, propriétés inconnues ignorées). erreur : message en français,
       affichable tel quel. Refusé : tout ce qui n’est pas un objet simple, un
       objet sans « version: 1 » ni « jours », une version différente de 1, ou
       un champ « jours » qui n’est pas un objet. Sert au chargement et à l’import.
   L.depuisJSON(texte)        -> même résultat que validerEtat, à partir d’un
       texte JSON (lu dans localStorage ou dans un fichier importé).
   L.versJSON(etat, lisible)  -> texte JSON de l’état nettoyé (indenté si
       lisible est vrai, pour l’export).
   L.marquerFait(etat, cle, infos) -> NOUVEL état où le jour « cle » est fait.
       infos : { exerciceId, titre, themeNom, duree, ressenti, faitLe }, tous
       facultatifs. faitLe doit être fourni par l’appelant, par exemple
       new Date().toISOString() (logique.js ne lit pas l’horloge). Si le jour
       est déjà fait, les champs fournis remplacent les anciens et les autres
       sont conservés (pratique pour ajouter le ressenti après coup).
       Clé invalide : renvoie une copie inchangée.
   L.annulerFait(etat, cle)   -> NOUVEL état sans ce jour.
   L.tirageDuJour(etat, cle)  -> etat.tirage.n si etat.tirage.date === cle, sinon 0.
   L.tiragesRestants(etat, cle) -> MAX_TIRAGES - tirageDuJour(etat, cle).
   L.changerExercice(etat, cle) -> NOUVEL état, tirage incrémenté pour ce jour
       (plafonné à MAX_TIRAGES ; repart de 1 si le tirage mémorisé date d’un
       autre jour).
   L.modifierReglages(etat, modifs) -> NOUVEL état ; modifs peut contenir
       duree ("auto", 15, 20 ou 30), theme, son ; les valeurs invalides sont
       ignorées.
   L.marquerPaliersVus(etat, seuils) -> NOUVEL état, seuils (tableau de
       nombres) ajoutés à paliersVus (sans doublon, trié).

   Remarque : marquerFait, annulerFait, changerExercice, modifierReglages et
   marquerPaliersVus repassent l’état par validerEtat ; si l’état reçu n’est
   pas reconnaissable, elles repartent de etatInitial().

   --------------------------------------------------------------------------
   5. AIDES INTERNES (exposées surtout pour les tests)
   --------------------------------------------------------------------------
   L.hacher(chaine)           -> entier 32 bits non signé (FNV-1a).
   L.mulberry32(graine)       -> fonction () -> nombre dans [0, 1[.
   L.permutation(n, graine)   -> tableau des entiers 0..n-1 mélangés.
   ========================================================================== */

(function (racine) {
  "use strict";

  var DDJ = racine.DDJ = racine.DDJ || {};

  var MS_PAR_JOUR = 86400000;
  var CLE_ORIGINE = "2024-01-01"; /* un lundi : origine des index de semaine */
  var MAX_TIRAGES = 2;
  var CLE_STOCKAGE = "dessin-du-jour:v1";
  var DUREES = [15, 20, 30];
  var DUREE_AUTO = "auto"; /* réglage : le minuteur suit la durée conseillée par l’exercice */
  var THEMES_AFFICHAGE = ["auto", "clair", "sombre"];
  var RESSENTIS = ["facile", "bien", "difficile"];
  var CHAMPS_JOUR = ["exerciceId", "titre", "themeNom", "duree", "ressenti", "faitLe"];
  var MAX_TITRE = 120;
  var MAX_THEME = 60;
  var MAX_HORODATAGE = 40;
  var MAX_DUREE_JOUR = 600;
  var MAX_JOURS = 36600; /* garde-fou : cent ans de dessins */
  var RE_CLE = /^(\d{4})-(\d{2})-(\d{2})$/;
  var RE_ID = /^[A-Za-z0-9_-]{1,40}$/;
  var RE_ID_GENERE = /^gen-(\d{1,6})-(\d{1,6})$/;

  var NOMS_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var NOMS_MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre"];

  /* ------------------------------------------------------------------ */
  /* Petites aides                                                       */
  /* ------------------------------------------------------------------ */

  function possede(objet, nom) {
    return Object.prototype.hasOwnProperty.call(objet, nom);
  }

  function estTableau(v) {
    return Object.prototype.toString.call(v) === "[object Array]";
  }

  function estObjetSimple(v) {
    return v !== null && typeof v === "object" && !estTableau(v);
  }

  /* Valeur d’une propriété PROPRE (jamais héritée), sinon undefined. */
  function propre(objet, nom) {
    return possede(objet, nom) ? objet[nom] : undefined;
  }

  function estEntier(v) {
    return typeof v === "number" && isFinite(v) && Math.floor(v) === v;
  }

  function mod(a, n) {
    return ((a % n) + n) % n;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function pad4(n) {
    var s = "" + n;
    while (s.length < 4) {
      s = "0" + s;
    }
    return s;
  }

  function texteBorne(v, max) {
    return typeof v === "string" ? v.slice(0, max) : "";
  }

  function nombreBorne(v, min, max, defaut) {
    if (typeof v !== "number" || !isFinite(v)) {
      return defaut;
    }
    return Math.min(max, Math.max(min, Math.round(v)));
  }

  function majuscule(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function rogner(s) {
    return String(s).replace(/^\s+|\s+$/g, "");
  }

  /* ------------------------------------------------------------------ */
  /* 1. Dates                                                            */
  /* ------------------------------------------------------------------ */

  /* Millisecondes UTC du minuit de la clé (sans vérifier que la date existe), ou NaN. */
  function utcDepuisCle(cle) {
    var m;
    if (typeof cle !== "string") {
      return NaN;
    }
    m = RE_CLE.exec(cle);
    if (!m) {
      return NaN;
    }
    return Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

  function cleDepuisUtc(ms) {
    var d = new Date(ms);
    var annee = d.getUTCFullYear();
    if (isNaN(annee) || annee < 0 || annee > 9999) {
      return null;
    }
    return pad4(annee) + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
  }

  function estCleValide(chaine) {
    var ms = utcDepuisCle(chaine);
    if (isNaN(ms)) {
      return false;
    }
    /* Une date impossible (30 février, mois 13, année < 100) ne survit pas à l’aller-retour. */
    return cleDepuisUtc(ms) === chaine;
  }

  function cleDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return pad4(date.getFullYear()) + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  }

  function aujourdHui() {
    return cleDate(new Date());
  }

  function dateDepuisCle(cle) {
    var m;
    if (!estCleValide(cle)) {
      return null;
    }
    m = RE_CLE.exec(cle);
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 12, 0, 0, 0);
  }

  function ajouterJours(cle, n) {
    var decalage;
    if (!estCleValide(cle)) {
      return null;
    }
    decalage = (typeof n === "number" && isFinite(n)) ? Math.round(n) : 0;
    return cleDepuisUtc(utcDepuisCle(cle) + decalage * MS_PAR_JOUR);
  }

  function jourSemaine(cle) {
    if (!estCleValide(cle)) {
      return null;
    }
    return new Date(utcDepuisCle(cle)).getUTCDay();
  }

  function cleLundi(cle) {
    var js = jourSemaine(cle);
    if (js === null) {
      return null;
    }
    return ajouterJours(cle, -((js + 6) % 7));
  }

  function ecartJours(cleA, cleB) {
    if (!estCleValide(cleA) || !estCleValide(cleB)) {
      return null;
    }
    return Math.round((utcDepuisCle(cleB) - utcDepuisCle(cleA)) / MS_PAR_JOUR);
  }

  function grilleMois(annee, mois) {
    var prefixe, premier, nbJours, decalage, semaines, semaine, i, j;
    if (!estEntier(annee) || !estEntier(mois) || mois < 1 || mois > 12 || annee < 100 || annee > 9999) {
      return [];
    }
    prefixe = pad4(annee) + "-" + pad2(mois) + "-";
    premier = prefixe + "01";
    /* Le jour 0 du mois suivant est le dernier jour de ce mois. */
    nbJours = new Date(Date.UTC(annee, mois, 0)).getUTCDate();
    decalage = (jourSemaine(premier) + 6) % 7;
    semaines = [];
    semaine = [];
    for (i = 0; i < decalage; i++) {
      semaine.push(null);
    }
    for (j = 1; j <= nbJours; j++) {
      semaine.push(prefixe + pad2(j));
      if (semaine.length === 7) {
        semaines.push(semaine);
        semaine = [];
      }
    }
    if (semaine.length > 0) {
      while (semaine.length < 7) {
        semaine.push(null);
      }
      semaines.push(semaine);
    }
    return semaines;
  }

  function indexSemaine(cle) {
    var ecart = ecartJours(CLE_ORIGINE, cle);
    if (ecart === null) {
      return null;
    }
    return Math.floor(ecart / 7);
  }

  function formaterDate(cle, avecAnnee) {
    var m, jour, texte;
    if (!estCleValide(cle)) {
      return "";
    }
    m = RE_CLE.exec(cle);
    jour = parseInt(m[3], 10);
    texte = NOMS_JOURS[jourSemaine(cle)] + " " + (jour === 1 ? "1er" : "" + jour) + " " +
      NOMS_MOIS[parseInt(m[2], 10) - 1];
    if (avecAnnee) {
      texte += " " + parseInt(m[1], 10);
    }
    return texte;
  }

  /* ------------------------------------------------------------------ */
  /* Hasard déterministe                                                 */
  /* ------------------------------------------------------------------ */

  /* Multiplication entière 32 bits (Math.imul n’existe pas partout). */
  var imul = (typeof Math.imul === "function") ? Math.imul : function (a, b) {
    var ah = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
  };

  /* Hachage FNV-1a sur 32 bits : chaîne -> entier non signé. */
  function hacher(chaine) {
    var texte = String(chaine);
    var h = 0x811c9dc5;
    var i;
    for (i = 0; i < texte.length; i++) {
      h ^= texte.charCodeAt(i);
      h = imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /* Générateur pseudo-aléatoire à graine : renvoie une fonction () -> [0, 1[. */
  function mulberry32(graine) {
    var a = graine | 0;
    return function () {
      var t;
      a = (a + 0x6D2B79F5) | 0;
      t = a;
      t = imul(t ^ (t >>> 15), t | 1);
      t ^= t + imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Mélange de Fisher-Yates des entiers 0..n-1, piloté par la graine. */
  function permutation(n, graine) {
    var alea = mulberry32(graine);
    var t = [];
    var i, j, tmp;
    for (i = 0; i < n; i++) {
      t.push(i);
    }
    for (i = n - 1; i > 0; i--) {
      j = Math.floor(alea() * (i + 1));
      tmp = t[i];
      t[i] = t[j];
      t[j] = tmp;
    }
    return t;
  }

  /* ------------------------------------------------------------------ */
  /* 2. Exercice du jour                                                 */
  /* ------------------------------------------------------------------ */

  function themeParJour(js) {
    var themes = DDJ.themes;
    var theme;
    if (js === null || themes === null || typeof themes !== "object") {
      return null;
    }
    theme = themes[js];
    return estObjetSimple(theme) ? theme : null;
  }

  function themeDuJour(cle) {
    return themeParJour(jourSemaine(cle));
  }

  function cleDeTheme(theme, js) {
    return (typeof theme.cle === "string" && theme.cle !== "") ? theme.cle : "theme" + js;
  }

  function exercicesDe(theme) {
    return (theme && estTableau(theme.exercices)) ? theme.exercices : [];
  }

  function generateurValide() {
    var g = DDJ.generateur;
    if (!estObjetSimple(g) || !estTableau(g.sujets) || !estTableau(g.contraintes) ||
        g.sujets.length === 0 || g.contraintes.length === 0) {
      return null;
    }
    return g;
  }

  /* Copie d’un exercice de la banque, enrichie des infos du thème. */
  function enrichir(exercice, theme) {
    var copie, nom;
    if (!estObjetSimple(exercice) || !estObjetSimple(theme)) {
      return null;
    }
    copie = {};
    for (nom in exercice) {
      if (possede(exercice, nom)) {
        copie[nom] = estTableau(exercice[nom]) ? exercice[nom].slice() : exercice[nom];
      }
    }
    copie.themeCle = typeof theme.cle === "string" ? theme.cle : "";
    copie.themeNom = typeof theme.nom === "string" ? theme.nom : "";
    copie.genere = false;
    return copie;
  }

  /* Position, dans la banque d’un thème de n exercices, de l’exercice de rang donné.
     Le rang avance de 1 à chaque passage du thème ; chaque cycle de n rangs
     parcourt une permutation propre au thème et au numéro de cycle. */
  function indexBanque(cleTheme, n, rang) {
    var cycle, position, ordre, ordreAvant, tmp;
    if (n <= 1) {
      return 0;
    }
    cycle = Math.floor(rang / n);
    position = mod(rang, n);
    ordre = permutation(n, hacher(cleTheme + "|cycle|" + cycle));
    if (n >= 3) {
      /* Évite qu’un cycle commence par l’exercice qui terminait le précédent.
         L’échange ne touche que les positions 0 et 1 : la dernière position
         d’un cycle (n - 1 >= 2) n’est donc jamais modifiée, ce qui rend la
         règle cohérente d’un cycle à l’autre. */
      ordreAvant = permutation(n, hacher(cleTheme + "|cycle|" + (cycle - 1)));
      if (ordre[0] === ordreAvant[n - 1]) {
        tmp = ordre[0];
        ordre[0] = ordre[1];
        ordre[1] = tmp;
      }
    }
    return ordre[position];
  }

  /* Positions proposées pour les tirages 1, 2... : tout sauf l’exercice du
     tirage 0, en gardant pour la fin celui de la semaine précédente puis celui
     de la semaine suivante. */
  function alternatives(cleTheme, n, rang) {
    var base = indexBanque(cleTheme, n, rang);
    var suivant = indexBanque(cleTheme, n, rang + 1);
    var precedent = indexBanque(cleTheme, n, rang - 1);
    var melange = permutation(n, hacher(cleTheme + "|tirages|" + rang));
    var libres = [];
    var recents = [];
    var prochains = [];
    var i, k;
    for (i = 0; i < n; i++) {
      k = melange[i];
      if (k === base) {
        continue;
      }
      if (k === suivant) {
        prochains.push(k);
      } else if (k === precedent) {
        recents.push(k);
      } else {
        libres.push(k);
      }
    }
    return libres.concat(recents, prochains);
  }

  /* Les (MAX_TIRAGES + 1) couples [indexSujet, indexContrainte] d’une semaine,
     tous différents tant qu’il existe assez de combinaisons. */
  function pairesGenerees(semaine, generateur) {
    var ns = generateur.sujets.length;
    var nc = generateur.contraintes.length;
    var ordreSujets = permutation(ns, hacher("sujets|" + semaine));
    var ordreContraintes = permutation(nc, hacher("contraintes|" + semaine));
    var paires = [];
    var vues = {};
    var k, a, b, i, j, trouve;
    for (k = 0; k <= MAX_TIRAGES; k++) {
      a = ordreSujets[k % ns];
      b = ordreContraintes[k % nc];
      if (vues[a + "-" + b] === true) {
        trouve = false;
        for (i = 0; i < ns && !trouve; i++) {
          for (j = 0; j < nc && !trouve; j++) {
            if (vues[ordreSujets[i] + "-" + ordreContraintes[j]] !== true) {
              a = ordreSujets[i];
              b = ordreContraintes[j];
              trouve = true;
            }
          }
        }
      }
      vues[a + "-" + b] = true;
      paires.push([a, b]);
    }
    return paires;
  }

  function exerciceGenere(indexSujet, indexContrainte) {
    var g = generateurValide();
    var theme, sujet, contrainte, titre;
    if (!g || !estEntier(indexSujet) || !estEntier(indexContrainte) ||
        indexSujet < 0 || indexSujet >= g.sujets.length ||
        indexContrainte < 0 || indexContrainte >= g.contraintes.length) {
      return null;
    }
    sujet = rogner(g.sujets[indexSujet]);
    contrainte = rogner(g.contraintes[indexContrainte]);
    titre = majuscule(sujet + " " + contrainte);
    theme = themeParJour(6);
    return {
      id: "gen-" + indexSujet + "-" + indexContrainte,
      titre: titre,
      consigne: "Ton sujet du jour : « " + titre + " ». Interprète-le comme tu veux : " +
        "il n’y a pas de bonne réponse, seulement ta version.",
      etapes: [
        "5 min : cherche 3 petites idées en vignettes rapides, sans aucun détail.",
        "3 min : choisis celle qui t’amuse le plus.",
        "12 min : dessine-la pour de bon, en jouant le jeu de la contrainte jusqu’au bout. " +
          "S’il te reste du temps, tente une deuxième version."
      ],
      materiel: "Crayon ou stylo, et papier",
      siBloque: "Oublie la contrainte : dessine simplement " + sujet + ", à ta façon.",
      duree: 20,
      genere: true,
      themeCle: (theme && typeof theme.cle === "string") ? theme.cle : "imagination",
      themeNom: (theme && typeof theme.nom === "string") ? theme.nom : "Imagination"
    };
  }

  function normaliserTirage(tirage) {
    return nombreBorne(tirage, 0, MAX_TIRAGES, 0);
  }

  function exerciceDuJour(cle, tirage) {
    var js, theme, t, semaine, banque, n, generateur, cleTheme, rang, paires, ordre;
    if (!estCleValide(cle)) {
      return null;
    }
    js = jourSemaine(cle);
    theme = themeParJour(js);
    if (!theme) {
      return null;
    }
    t = normaliserTirage(tirage);
    semaine = indexSemaine(cle);
    banque = exercicesDe(theme);
    n = banque.length;
    cleTheme = cleDeTheme(theme, js);
    rang = semaine;

    if (js === 6) {
      generateur = generateurValide();
      if (generateur) {
        if (t > 0 || mod(semaine, 2) === 1 || n === 0) {
          paires = pairesGenerees(semaine, generateur);
          return exerciceGenere(paires[t][0], paires[t][1]);
        }
        /* Semaine paire, tirage 0 : la banque du samedi ne sert qu’une semaine
           sur deux, son rang avance donc deux fois moins vite. */
        return enrichir(banque[indexBanque(cleTheme, n, semaine / 2)], theme);
      }
      /* Pas de générateur : le samedi se comporte comme un jour ordinaire. */
    }

    if (n === 0) {
      return null;
    }
    if (t === 0) {
      return enrichir(banque[indexBanque(cleTheme, n, rang)], theme);
    }
    ordre = alternatives(cleTheme, n, rang);
    if (ordre.length === 0) {
      return enrichir(banque[0], theme);
    }
    return enrichir(banque[ordre[(t - 1) % ordre.length]], theme);
  }

  function exerciceParId(id) {
    var m, js, theme, banque, i;
    if (typeof id !== "string" || id === "") {
      return null;
    }
    m = RE_ID_GENERE.exec(id);
    if (m) {
      return exerciceGenere(parseInt(m[1], 10), parseInt(m[2], 10));
    }
    for (js = 0; js < 7; js++) {
      theme = themeParJour(js);
      banque = exercicesDe(theme);
      for (i = 0; i < banque.length; i++) {
        if (estObjetSimple(banque[i]) && banque[i].id === id) {
          return enrichir(banque[i], theme);
        }
      }
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* 3. Série, joker, paliers                                            */
  /* ------------------------------------------------------------------ */

  /* Les calculs de série se font sur des numéros de jour entiers (jours écoulés
     depuis le 1er janvier 1970), bien plus rapides à parcourir que des clés. */
  function numeroJour(cle) {
    return Math.round(utcDepuisCle(cle) / MS_PAR_JOUR);
  }

  function cleDepuisNumero(numero) {
    return cleDepuisUtc(numero * MS_PAR_JOUR);
  }

  /* Numéro de la semaine (lundi-dimanche) d’un numéro de jour.
     Le 1er janvier 1970 (numéro 0) était un jeudi, d’où le décalage de 3. */
  function numeroSemaine(numero) {
    return Math.floor((numero + 3) / 7);
  }

  function clesFaites(jours) {
    var cles = [];
    var nom;
    if (!estObjetSimple(jours)) {
      return cles;
    }
    for (nom in jours) {
      if (possede(jours, nom) && estCleValide(nom)) {
        cles.push(nom);
      }
    }
    return cles;
  }

  /* LE parcours chronologique des séries : calculerSerie, meilleureSerie et
     jokersHistorique lisent tous son bilan, pour ne jamais se contredire.
     numeroAujourdHui : numéro du jour courant, ou null pour s’arrêter au jour
     fait le plus récent. Renvoie, en numéros de jour :
       serie      longueur de la chaîne vivante à la fin du parcours (0 sinon)
       jokers     jours couverts dans cette chaîne vivante, croissants
       meilleure  longueur de la plus longue chaîne rencontrée
       historique tous les jours couverts depuis le début, croissants
       semaineDernierJoker  semaine du dernier joker consommé, ou null
       faitAujourdHui       vrai si le dernier jour du parcours est fait
     Coût : un tri, puis un passage linéaire sur les jours faits. Entre deux
     jours faits, la boucle des jours manqués s’arrête au plus tard au
     troisième (dimanche couvert, lundi couvert, mardi : rupture), quelle que
     soit la longueur du trou. */
  function parcourirSeries(jours, numeroAujourdHui) {
    var cles = clesFaites(jours).sort(); /* ordre des clés = ordre des dates */
    var bilan = {
      serie: 0, jokers: [], meilleure: 0, historique: [],
      semaineDernierJoker: null, faitAujourdHui: false
    };
    var faits = [];
    var vivante = false;
    var dernierFait = 0;
    var fin, i, numero, borne, jour, semaine;

    for (i = 0; i < cles.length; i++) {
      numero = numeroJour(cles[i]);
      /* Les jours postérieurs à aujourd’hui ne comptent pas. */
      if (numeroAujourdHui === null || numero <= numeroAujourdHui) {
        faits.push(numero);
      }
    }
    if (faits.length === 0) {
      return bilan;
    }
    fin = numeroAujourdHui === null ? faits[faits.length - 1] : numeroAujourdHui;
    bilan.faitAujourdHui = faits[faits.length - 1] === fin;

    for (i = 0; i <= faits.length; i++) {
      /* Jours manqués entre le dernier jour fait et le suivant ; au dernier
         tour, jusqu’à la veille d’aujourd’hui (aujourd’hui n’est jamais manqué). */
      borne = i < faits.length ? faits[i] : fin;
      for (jour = dernierFait + 1; vivante && jour < borne; jour++) {
        semaine = numeroSemaine(jour);
        if (semaine === bilan.semaineDernierJoker) {
          /* Joker de cette semaine déjà consommé : la chaîne est rompue. */
          vivante = false;
          bilan.serie = 0;
          bilan.jokers = [];
        } else {
          /* Les jokers sont consommés dans l’ordre du temps : retenir la
             semaine du dernier suffit pour savoir si celle-ci est prise. */
          bilan.semaineDernierJoker = semaine;
          bilan.jokers.push(jour);
          bilan.historique.push(jour);
        }
      }
      if (i < faits.length) {
        vivante = true;
        bilan.serie++;
        if (bilan.serie > bilan.meilleure) {
          bilan.meilleure = bilan.serie;
        }
        dernierFait = borne;
      }
    }
    return bilan;
  }

  function clesDepuisNumeros(numeros) {
    var cles = [];
    var i;
    for (i = 0; i < numeros.length; i++) {
      cles.push(cleDepuisNumero(numeros[i]));
    }
    return cles;
  }

  function calculerSerie(jours, cleAujourdHui) {
    var resultat = { serie: 0, jokers: [], faitAujourdHui: false, jokerDispoCetteSemaine: true };
    var numero, bilan;
    if (!estCleValide(cleAujourdHui) || !estObjetSimple(jours)) {
      return resultat;
    }
    numero = numeroJour(cleAujourdHui);
    bilan = parcourirSeries(jours, numero);
    resultat.serie = bilan.serie;
    resultat.jokers = clesDepuisNumeros(bilan.jokers);
    resultat.faitAujourdHui = bilan.faitAujourdHui;
    /* Toutes chaînes confondues : un joker consommé le reste pour sa semaine. */
    resultat.jokerDispoCetteSemaine = bilan.semaineDernierJoker !== numeroSemaine(numero);
    return resultat;
  }

  function jokersHistorique(jours, cleAujourdHui) {
    if (!estCleValide(cleAujourdHui) || !estObjetSimple(jours)) {
      return [];
    }
    return clesDepuisNumeros(parcourirSeries(jours, numeroJour(cleAujourdHui)).historique);
  }

  /* Sans clé du jour (ou avec une clé invalide), le parcours va jusqu’au jour
     fait le plus récent. */
  function meilleureSerie(jours, cleAujourdHui) {
    return parcourirSeries(jours, estCleValide(cleAujourdHui) ? numeroJour(cleAujourdHui) : null).meilleure;
  }

  function totalJours(jours) {
    return clesFaites(jours).length;
  }

  function compterMois(jours, annee, mois) {
    var cles, prefixe, total, i;
    if (!estEntier(annee) || !estEntier(mois) || mois < 1 || mois > 12) {
      return 0;
    }
    cles = clesFaites(jours);
    prefixe = pad4(annee) + "-" + pad2(mois) + "-";
    total = 0;
    for (i = 0; i < cles.length; i++) {
      if (cles[i].slice(0, 8) === prefixe) {
        total++;
      }
    }
    return total;
  }

  var PALIERS = [
    { seuil: 1, nom: "Premier trait" },
    { seuil: 3, nom: "Ça démarre" },
    { seuil: 7, nom: "Une semaine de dessins" },
    { seuil: 14, nom: "Le pli est pris" },
    { seuil: 30, nom: "Un mois de croquis" },
    { seuil: 50, nom: "Cinquante dessins" },
    { seuil: 100, nom: "Cent dessins" },
    { seuil: 200, nom: "Carnet bien rempli" },
    { seuil: 365, nom: "Une année de dessins" }
  ];

  (function gelerPaliers() {
    var i;
    if (typeof Object.freeze === "function") {
      for (i = 0; i < PALIERS.length; i++) {
        Object.freeze(PALIERS[i]);
      }
      Object.freeze(PALIERS);
    }
  })();

  function copiePalier(palier) {
    return { seuil: palier.seuil, nom: palier.nom };
  }

  function estSeuil(v) {
    var i;
    for (i = 0; i < PALIERS.length; i++) {
      if (PALIERS[i].seuil === v) {
        return true;
      }
    }
    return false;
  }

  function paliersAtteints(total) {
    var atteints = [];
    var i;
    for (i = 0; i < PALIERS.length; i++) {
      if (typeof total === "number" && PALIERS[i].seuil <= total) {
        atteints.push(copiePalier(PALIERS[i]));
      }
    }
    return atteints;
  }

  function prochainPalier(total) {
    var valeur = (typeof total === "number" && isFinite(total)) ? total : 0;
    var i;
    for (i = 0; i < PALIERS.length; i++) {
      if (PALIERS[i].seuil > valeur) {
        return copiePalier(PALIERS[i]);
      }
    }
    return null;
  }

  function paliersNonVus(etat) {
    var jours = (estObjetSimple(etat) && estObjetSimple(etat.jours)) ? etat.jours : {};
    var vus = (estObjetSimple(etat) && estTableau(etat.paliersVus)) ? etat.paliersVus : [];
    var atteints = paliersAtteints(totalJours(jours));
    var nonVus = [];
    var i, j, dejaVu;
    for (i = 0; i < atteints.length; i++) {
      dejaVu = false;
      for (j = 0; j < vus.length; j++) {
        if (vus[j] === atteints[i].seuil) {
          dejaVu = true;
        }
      }
      if (!dejaVu) {
        nonVus.push(atteints[i]);
      }
    }
    return nonVus;
  }

  /* ------------------------------------------------------------------ */
  /* 4. État                                                             */
  /* ------------------------------------------------------------------ */

  function etatInitial() {
    return {
      version: 1,
      jours: {},
      tirage: { date: null, n: 0 },
      reglages: { duree: DUREE_AUTO, theme: "auto", son: true },
      paliersVus: []
    };
  }

  function dans(liste, v) {
    var i;
    for (i = 0; i < liste.length; i++) {
      if (liste[i] === v) {
        return true;
      }
    }
    return false;
  }

  /* Fiche d’un jour nettoyée : toujours les 6 mêmes champs, bien typés. */
  function nettoyerJour(v) {
    var source = estObjetSimple(v) ? v : {};
    var id = propre(source, "exerciceId");
    var ressenti = propre(source, "ressenti");
    var faitLe = propre(source, "faitLe");
    return {
      exerciceId: (typeof id === "string" && RE_ID.test(id)) ? id : "",
      titre: texteBorne(propre(source, "titre"), MAX_TITRE),
      themeNom: texteBorne(propre(source, "themeNom"), MAX_THEME),
      duree: nombreBorne(propre(source, "duree"), 0, MAX_DUREE_JOUR, 0),
      ressenti: dans(RESSENTIS, ressenti) ? ressenti : null,
      faitLe: (typeof faitLe === "string" && faitLe.length <= MAX_HORODATAGE &&
        !isNaN(Date.parse(faitLe))) ? faitLe : ""
    };
  }

  function nettoyerJours(source) {
    var jours = {};
    var cles = [];
    var nom, i, valeur;
    for (nom in source) {
      if (possede(source, nom) && estCleValide(nom)) {
        valeur = source[nom];
        /* Un jour est une fiche (objet) ; on tolère aussi la simple valeur true. */
        if (estObjetSimple(valeur) || valeur === true) {
          cles.push(nom);
        }
      }
    }
    cles.sort();
    if (cles.length > MAX_JOURS) {
      cles = cles.slice(cles.length - MAX_JOURS);
    }
    for (i = 0; i < cles.length; i++) {
      jours[cles[i]] = nettoyerJour(source[cles[i]]);
    }
    return jours;
  }

  function nettoyerTirage(v) {
    var date, n;
    if (!estObjetSimple(v)) {
      return { date: null, n: 0 };
    }
    date = propre(v, "date");
    n = propre(v, "n");
    if (!estCleValide(date)) {
      return { date: null, n: 0 };
    }
    return { date: date, n: nombreBorne(n, 0, MAX_TIRAGES, 0) };
  }

  /* reglages.duree : "auto" (durée conseillée par l’exercice) ou une durée fixe. */
  function estDureeReglage(v) {
    return v === DUREE_AUTO || dans(DUREES, v);
  }

  function nettoyerReglages(v) {
    var source = estObjetSimple(v) ? v : {};
    var duree = propre(source, "duree");
    var theme = propre(source, "theme");
    var son = propre(source, "son");
    return {
      duree: estDureeReglage(duree) ? duree : DUREE_AUTO,
      theme: dans(THEMES_AFFICHAGE, theme) ? theme : "auto",
      son: typeof son === "boolean" ? son : true
    };
  }

  function nettoyerPaliersVus(v) {
    var vus = [];
    var i;
    if (!estTableau(v)) {
      return vus;
    }
    for (i = 0; i < PALIERS.length; i++) {
      if (dans(v, PALIERS[i].seuil)) {
        vus.push(PALIERS[i].seuil);
      }
    }
    return vus;
  }

  function validerEtat(objet) {
    var version, jours;
    if (!estObjetSimple(objet)) {
      return { ok: false, erreur: "Ce contenu n’est pas une sauvegarde de Dessin du jour." };
    }
    version = propre(objet, "version");
    jours = propre(objet, "jours");
    if (version === undefined && jours === undefined) {
      return { ok: false, erreur: "Ce fichier ne ressemble pas à une sauvegarde de Dessin du jour." };
    }
    if (version !== undefined && version !== 1) {
      if (typeof version === "number" && version > 1) {
        return {
          ok: false,
          erreur: "Cette sauvegarde vient d’une version plus récente de l’appli et ne peut pas être lue ici."
        };
      }
      return { ok: false, erreur: "La version de cette sauvegarde n’est pas reconnue." };
    }
    if (jours !== undefined && !estObjetSimple(jours)) {
      return { ok: false, erreur: "La liste des jours dessinés de cette sauvegarde est illisible." };
    }
    return {
      ok: true,
      etat: {
        version: 1,
        jours: nettoyerJours(jours === undefined ? {} : jours),
        tirage: nettoyerTirage(propre(objet, "tirage")),
        reglages: nettoyerReglages(propre(objet, "reglages")),
        paliersVus: nettoyerPaliersVus(propre(objet, "paliersVus"))
      }
    };
  }

  function depuisJSON(texte) {
    var objet;
    if (typeof texte !== "string" || rogner(texte) === "") {
      return { ok: false, erreur: "Il n’y a rien à lire : le contenu est vide." };
    }
    try {
      objet = JSON.parse(texte);
    } catch (e) {
      return { ok: false, erreur: "Ce contenu n’est pas un fichier de sauvegarde lisible (JSON invalide)." };
    }
    return validerEtat(objet);
  }

  /* État propre et tout neuf à partir de n’importe quoi. */
  function etatSur(etat) {
    var resultat = validerEtat(etat);
    return resultat.ok ? resultat.etat : etatInitial();
  }

  function versJSON(etat, lisible) {
    return lisible ? JSON.stringify(etatSur(etat), null, 2) : JSON.stringify(etatSur(etat));
  }

  function marquerFait(etat, cle, infos) {
    var nouveau = etatSur(etat);
    var ancien, fusion, i, champ, valeur;
    if (!estCleValide(cle)) {
      return nouveau;
    }
    ancien = possede(nouveau.jours, cle) ? nouveau.jours[cle] : null;
    fusion = {};
    for (i = 0; i < CHAMPS_JOUR.length; i++) {
      champ = CHAMPS_JOUR[i];
      valeur = estObjetSimple(infos) ? propre(infos, champ) : undefined;
      if (valeur === undefined && ancien !== null) {
        valeur = ancien[champ];
      }
      fusion[champ] = valeur;
    }
    nouveau.jours[cle] = nettoyerJour(fusion);
    return nouveau;
  }

  function annulerFait(etat, cle) {
    var nouveau = etatSur(etat);
    if (estCleValide(cle) && possede(nouveau.jours, cle)) {
      delete nouveau.jours[cle];
    }
    return nouveau;
  }

  function tirageDuJour(etat, cle) {
    if (!estObjetSimple(etat) || !estObjetSimple(etat.tirage) || !estCleValide(cle) ||
        etat.tirage.date !== cle) {
      return 0;
    }
    return nombreBorne(etat.tirage.n, 0, MAX_TIRAGES, 0);
  }

  function tiragesRestants(etat, cle) {
    return MAX_TIRAGES - tirageDuJour(etat, cle);
  }

  function changerExercice(etat, cle) {
    var nouveau = etatSur(etat);
    if (!estCleValide(cle)) {
      return nouveau;
    }
    nouveau.tirage = { date: cle, n: Math.min(MAX_TIRAGES, tirageDuJour(nouveau, cle) + 1) };
    return nouveau;
  }

  function modifierReglages(etat, modifs) {
    var nouveau = etatSur(etat);
    var duree, theme, son;
    if (!estObjetSimple(modifs)) {
      return nouveau;
    }
    duree = propre(modifs, "duree");
    theme = propre(modifs, "theme");
    son = propre(modifs, "son");
    if (estDureeReglage(duree)) {
      nouveau.reglages.duree = duree;
    }
    if (dans(THEMES_AFFICHAGE, theme)) {
      nouveau.reglages.theme = theme;
    }
    if (typeof son === "boolean") {
      nouveau.reglages.son = son;
    }
    return nouveau;
  }

  function marquerPaliersVus(etat, seuils) {
    var nouveau = etatSur(etat);
    if (estTableau(seuils)) {
      nouveau.paliersVus = nettoyerPaliersVus(nouveau.paliersVus.concat(seuils));
    }
    return nouveau;
  }

  /* ------------------------------------------------------------------ */
  /* API publique                                                        */
  /* ------------------------------------------------------------------ */

  DDJ.logique = {
    /* dates */
    cleDate: cleDate,
    aujourdHui: aujourdHui,
    estCleValide: estCleValide,
    dateDepuisCle: dateDepuisCle,
    ajouterJours: ajouterJours,
    jourSemaine: jourSemaine,
    cleLundi: cleLundi,
    ecartJours: ecartJours,
    grilleMois: grilleMois,
    indexSemaine: indexSemaine,
    formaterDate: formaterDate,
    NOMS_JOURS: NOMS_JOURS.slice(),
    NOMS_MOIS: NOMS_MOIS.slice(),

    /* exercice du jour */
    MAX_TIRAGES: MAX_TIRAGES,
    themeDuJour: themeDuJour,
    exerciceDuJour: exerciceDuJour,
    exerciceParId: exerciceParId,
    exerciceGenere: exerciceGenere,

    /* série, joker, paliers */
    calculerSerie: calculerSerie,
    jokersHistorique: jokersHistorique,
    meilleureSerie: meilleureSerie,
    totalJours: totalJours,
    compterMois: compterMois,
    PALIERS: PALIERS,
    paliersAtteints: paliersAtteints,
    prochainPalier: prochainPalier,
    paliersNonVus: paliersNonVus,

    /* état */
    CLE_STOCKAGE: CLE_STOCKAGE,
    DUREES: DUREES.slice(),
    DUREE_AUTO: DUREE_AUTO,
    THEMES_AFFICHAGE: THEMES_AFFICHAGE.slice(),
    RESSENTIS: RESSENTIS.slice(),
    etatInitial: etatInitial,
    validerEtat: validerEtat,
    depuisJSON: depuisJSON,
    versJSON: versJSON,
    marquerFait: marquerFait,
    annulerFait: annulerFait,
    tirageDuJour: tirageDuJour,
    tiragesRestants: tiragesRestants,
    changerExercice: changerExercice,
    modifierReglages: modifierReglages,
    marquerPaliersVus: marquerPaliersVus,

    /* aides internes */
    hacher: hacher,
    mulberry32: mulberry32,
    permutation: permutation
  };
})(typeof window !== "undefined" ? window : this);
