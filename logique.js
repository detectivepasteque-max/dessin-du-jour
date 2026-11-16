/* ==========================================================================
   Dessin du jour — logique.js
   Logique PURE de l’appli, exposée dans window.DDJ.logique.
   Aucun accès au DOM ni à localStorage. Seule aujourdHui() lit l’horloge, et
   seule genererIdee() utilise le hasard natif du moteur (uniquement comme
   valeur par défaut de son option « alea »).
   Script classique (ES5, pas de module) : fonctionne en file:// comme en HTTP.
   À charger APRÈS donnees/exercices-semaine.js, donnees/exercices-weekend.js,
   donnees/idees.js et donnees/guide-1.js à guide-3.js (les données DDJ.themes,
   DDJ.generateur, DDJ.idees et DDJ.guide sont lues au moment des appels : un
   fichier absent ne provoque aucune exception, seulement des résultats vides).

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
         reglages: { duree: "auto", theme: "auto", son: true }, paliersVus: [],
         favoris: [], guide: { faits: {} } }
       favoris : idées gardées, de la plus récente à la plus ancienne, au plus
         MAX_FAVORIS, sans doublon sur le texte (voir la section 5).
       guide.faits : { "g03": "AAAA-MM-JJ" }, les chapitres du guide marqués
         comme faits et le jour où ils l’ont été (voir la section 6).
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
       Favoris : seuls les objets { texte, categorieCle, ajouteLe } dont le
       texte est une chaîne non vide sont gardés (texte rogné, coupé à 300
       caractères, puis rogné de nouveau si la coupe tombe après une espace ;
       categorieCle ramenée à "" si ce n’est pas une clé simple,
       ajouteLe ramené à "" si ce n’est pas un horodatage lisible), sans
       doublon sur le texte, dans l’ordre reçu, 50 au plus (seules les 1000
       premières entrées sont examinées).
       Guide : seules les clés au format « g » + deux chiffres dont la valeur
       est une clé de date valide sont gardées.
       Une sauvegarde ancienne, sans « favoris » ni « guide », est acceptée et
       complétée ([] et { faits: {} }) : la version reste 1.
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

   Remarque : marquerFait, annulerFait, changerExercice, modifierReglages,
   marquerPaliersVus, ajouterFavori, retirerFavori, marquerChapitre et
   annulerChapitre repassent l’état par validerEtat ; si l’état reçu n’est
   pas reconnaissable, elles repartent de etatInitial().

   Un jour peut être marqué fait avec un dessin venu des sections « Idées » ou
   « Apprendre » : marquerFait accepte tout exerciceId fait de 1 à 40 lettres,
   chiffres, tirets ou tirets bas, par exemple "idee" ou "guide-g03", avec un
   titre libre. exerciceParId renvoie alors simplement null.

   --------------------------------------------------------------------------
   5. IDÉES ET FAVORIS
   --------------------------------------------------------------------------
   Données lues dans DDJ.idees.categories (donnees/idees.js). Une catégorie
   n’est utilisée que si elle a une clé, au moins un morceau, et que chaque
   morceau a une clé et au moins un mot.

   L.CLE_SURPRISE = "surprise"   clé du choix « Surprise » de l’interface.
   L.categoriesIdees()        -> tableau de copies { cle, nom, description },
       dans l’ordre des données ; [] si les données manquent.
   L.genererIdee(cleCategorie, options) -> idée ou null.
       options (facultatif) :
         verrous : { cleMorceau: index } ; les morceaux verrouillés gardent
           leur mot. Un verrou invalide (clé inconnue, index non entier ou hors
           limites) est ignoré.
         alea : fonction () -> nombre dans [0, 1[. Par défaut, le hasard natif
           du moteur. Passer une suite fixe rend le tirage déterministe.
         eviter : texte d’une idée à ne pas rendre à l’identique.
       Idée renvoyée :
         { categorieCle, categorieNom, texte,
           morceaux: [ { cle, nom, index, texte }, ... ] }
         texte : le gabarit de la catégorie où chaque {cle} est remplacé par
           le mot tiré, avec majuscule initiale (sans gabarit : les mots
           séparés par une espace). morceaux : dans l’ordre des données.
       Ordre des appels à alea : d’abord un appel pour la catégorie (seulement
       en mode surprise sans verrou valide), puis un appel par morceau non
       verrouillé, dans l’ordre des morceaux. Index tiré = partie entière de
       alea() × nombre de mots.
       Catégorie :
         - une clé de catégorie : cette catégorie (null si elle est inconnue) ;
         - "surprise", undefined ou null : une catégorie tirée au hasard ;
           s’il y a des verrous valides, aucun tirage : on garde la catégorie
           qui accepte le plus de verrous. Deux catégories peuvent avoir des
           morceaux de même clé (« qui », par exemple) : à égalité, on préfère
           celle dont les mots verrouillés figurent tous dans « eviter »
           (le texte de l’idée affichée), sinon la première dans l’ordre des
           données. Le plus sûr, quand des verrous sont posés, reste de
           passer la categorieCle de l’idée affichée plutôt que "surprise".
       eviter : si le texte obtenu est identique et qu’une autre combinaison
       existe, on retire (20 essais au plus), puis, si l’aléa s’entête, on
       prend la combinaison voisine : le résultat diffère donc toujours de
       « eviter », sauf si tous les morceaux sont verrouillés ou n’ont qu’un mot.
       null si les données manquent ou si la catégorie est inconnue.
   L.ideeDepuisIndex(cleCategorie, indexParMorceau) -> idée (même forme) ou null.
       indexParMorceau : { cleMorceau: index } (par exemple construit à partir
       de idee.morceaux), ou tableau d’index dans l’ordre des morceaux.
       null si la catégorie est inconnue ou si un index manque ou est invalide.

   L.MAX_FAVORIS = 50
   etat.favoris : [ { texte, categorieCle, ajouteLe }, ... ] du plus récent
       au plus ancien. Le texte sert d’identité (rogné, 300 caractères au plus).
   L.ajouterFavori(etat, idee, horodatageISO) -> NOUVEL état, l’idée en tête
       des favoris. idee : une idée de genererIdee, ou tout objet
       { texte, categorieCle }, ou simplement un texte. horodatageISO : fourni
       par l’appelant (new Date().toISOString()). Texte vide ou déjà présent :
       copie inchangée (le favori existant garde sa place et sa date).
       Au-delà de MAX_FAVORIS, le plus ancien est retiré.
   L.retirerFavori(etat, texte) -> NOUVEL état sans ce favori.
   L.estFavori(etat, texte)   -> booléen.

   --------------------------------------------------------------------------
   6. GUIDE « APPRENDRE »
   --------------------------------------------------------------------------
   Données lues dans DDJ.guide (donnees/guide-1.js à guide-3.js). Un chapitre
   n’est pris en compte que s’il a un id au format « g » + deux chiffres et un
   numero (nombre) ; en cas d’id en double, seul le premier compte.

   L.partiesGuide()           -> copies { numero, titre } triées par numéro ;
       [] si les données manquent.
   L.chapitresGuide()         -> copies (en profondeur) des chapitres, triées
       par numero ; [] si les données manquent.
       Chapitre : { id, numero, partie, titre, resume, blocs: [ ... ] }.
   L.chapitreParId(id)        -> copie du chapitre, ou null.
   L.chapitreVoisin(id, sens) -> copie du chapitre précédent (sens -1) ou
       suivant (sens 1) dans l’ordre des numéros ; null aux extrémités, pour
       un id inconnu ou pour un autre sens.
   L.marquerChapitre(etat, id, cleDate) -> NOUVEL état où le chapitre est fait
       ce jour-là (un chapitre déjà fait prend la nouvelle date). id mal formé
       ou clé de date invalide : copie inchangée. L’id n’a pas besoin d’exister
       dans les données (l’état ne dépend pas d’elles).
   L.annulerChapitre(etat, id) -> NOUVEL état sans ce chapitre.
   L.chapitreFait(etat, id)   -> booléen.
   L.dateChapitre(etat, id)   -> clé du jour où le chapitre a été fait, ou null.
   L.nombreChapitresFaits(etat) -> nombre de chapitres DU GUIDE marqués faits
       (un id absent des données ne compte pas).
   L.prochainChapitre(etat)   -> copie du premier chapitre non fait, dans
       l’ordre des numéros ; null si tout est fait ou si le guide manque.

   --------------------------------------------------------------------------
   7. SCHÉMAS DU GUIDE (règles partagées par l’interface et les tests)
   --------------------------------------------------------------------------
   L.SCHEMA_BALISES   : ["line", "rect", "circle", "ellipse", "polyline",
                         "polygon", "path", "text"]
   L.SCHEMA_ATTRIBUTS : ["x1", "y1", "x2", "y2", "x", "y", "width", "height",
                         "rx", "ry", "cx", "cy", "r", "points", "d",
                         "transform", "classe", "ancre"]
   L.SCHEMA_CLASSES   : ["trait", "leger", "pointille", "accent", "fleche",
                         "plein", "ombre", "ombre-forte", "surligne",
                         "etiquette", "etiquette-accent"]
   L.SCHEMA_ANCRES    : ["start", "middle", "end"]
   L.SCHEMA_LARGEUR = 320, L.SCHEMA_HAUTEUR_MIN = 120,
   L.SCHEMA_HAUTEUR_MAX = 240, L.SCHEMA_MAX_FORMES = 40,
   L.SCHEMA_MARGE = 6 (marge conseillée entre un dessin et le bord du cadre).
   L.validerForme(forme, largeur, hauteur, marge) -> { ok: true } ou
       { ok: false, erreur } (message en français). largeur, hauteur et marge
       sont facultatifs (marge : 0 par défaut). Règles :
       - forme : tableau [balise, attributs] ou ["text", attributs, texte] ;
         le texte (chaîne non vide) est obligatoire pour « text » et interdit
         ailleurs ;
       - balise dans SCHEMA_BALISES ; attributs : objet dont chaque propriété
         est dans SCHEMA_ATTRIBUTS ET a un sens pour la balise :
           line     x1 y1 x2 y2            (tous obligatoires)
           rect     x y width height       (obligatoires), rx ry (facultatifs)
           circle   cx cy r                (obligatoires)
           ellipse  cx cy rx ry            (obligatoires)
           polyline, polygon   points      (obligatoire)
           path     d                      (obligatoire)
           text     x y                    (obligatoires), ancre (facultatif)
         plus, pour toutes : classe (obligatoire) et transform (facultatif) ;
       - valeurs numériques : de vrais nombres finis (jamais de chaînes) ;
         width, height, r et les rayons d’une ellipse strictement positifs ;
         rx et ry d’un rect positifs ou nuls ;
       - points : chaîne "x,y x,y ..." (2 points au moins, 3 pour polygon) ;
       - d : chaîne commençant par M, faite uniquement des commandes
         M L H V C S Q T A Z (majuscules : coordonnées absolues) suivies du
         bon nombre de nombres décimaux simples ("12", "-3.5", ".5" ; pas
         "5." ni "1e2"). Séparateurs : ceux de la grammaire SVG et rien
         d’autre, soit des blancs (espace, tabulation, saut de ligne) et une
         virgule au plus, placée entre deux nombres ("M 10,10 L 50,50" ;
         refusés : "M 10 10, L 50 50", "M 10,,10", une virgule en tête ou en
         fin, une espace insécable). Les deux drapeaux d’un arc s’écrivent
         exactement 0 ou 1, séparés du reste ("0 1", pas "01" ni "1.0") ;
       - transform : exactement "rotate(angle cx cy)" ;
       - classe : une seule, dans SCHEMA_CLASSES ; « fleche » seulement sur
         line et path ; « etiquette » et « etiquette-accent » sur text
         seulement, et text n’accepte qu’elles ;
       - ancre : dans SCHEMA_ANCRES ;
       - si largeur et hauteur sont fournis : la forme (rotation comprise)
         tient dans le cadre 0,0 - largeur,hauteur, à « marge » du bord au
         moins. Sont vérifiés : extrémités des lignes, coins des rectangles,
         bords des cercles et des ellipses (pour une ellipse tournée : sa
         vraie boîte englobante, plus large que ses quatre sommets), points
         des polylignes et polygones, points de passage des tracés (pas
         leurs points de contrôle), point d’ancrage des textes.
       La longueur des étiquettes, la place qu’elles occupent et leurs
       chevauchements ne sont pas jugés ici (ils le sont dans tests.html).
   L.validerSchema(bloc)      -> { ok: true } ou { ok: false, erreur }.
       bloc : { type: "schema", legende, alt, largeur, hauteur, formes } et
       rien d’autre ; largeur 320 ; hauteur de 120 à 240 ; legende et alt
       non vides ; 1 à 40 formes, toutes acceptées par validerForme avec une
       marge de 0 (l’erreur indique le numéro de la première forme refusée).
       Un schéma accepté peut donc être affiché tel quel ; le respect de
       SCHEMA_MARGE se vérifie à part : validerForme(forme, 320, hauteur, 6).

   --------------------------------------------------------------------------
   8. AIDES INTERNES (exposées surtout pour les tests)
   --------------------------------------------------------------------------
   L.hacher(chaine)           -> entier 32 bits non signé (FNV-1a).
   L.mulberry32(graine)       -> fonction () -> nombre dans [0, 1[.
   L.permutation(n, graine)   -> tableau des entiers 0..n-1 mélangés.

   --------------------------------------------------------------------------
   9. COMPLÉMENTS (fonctions « avec Claude » de l’appli publiée en artefact)
   --------------------------------------------------------------------------
   Rien ici n’appelle Claude : ce sont les garde-fous par lesquels passe tout
   texte reçu avant d’être rangé. L’état gagne deux champs FACULTATIFS,
   présents seulement s’ils ont un contenu (une progression sans eux garde
   exactement sa forme d’avant, et la version reste 1) :
     retours    { "AAAA-MM-JJ": texte } : retour de Claude sur le dessin d’un
                jour coché (L.MAX_RETOUR caractères au plus). Un retour dont
                le jour n’est pas coché n’est pas gardé.
     adaptation { date, base, titre, consigne, etapes, materiel, siBloque,
                  duree, pourquoi } : version adaptée de l’exercice « base »
                pour le jour « date ».
   L.retourDuJour(etat, cle)            -> texte, "" s’il n’y en a pas.
   L.noterRetour(etat, cle, texte)      -> nouvel état (texte vide : retire).
   L.poserAdaptation(etat, cle, base, proposition) -> nouvel état ; inchangé
       si la proposition est inutilisable (titre ou consigne vides, moins de
       deux étapes). duree hors de L.DUREES : ramenée à 20.
   L.retirerAdaptation(etat)            -> nouvel état.
   L.adaptationDuJour(etat, cle)        -> exercice (id "adapte-<base>",
       adapte: true, pourquoi) ou null. L.changerExercice l’abandonne.
   L.nettoyerIdeesSurMesure(valeur)     -> au plus 4 textes d’une ligne.
   L.texteChapitre(id)                  -> le chapitre du guide à plat, "".
   L.contexteProgression(etat, cle, n)  -> { total, serie, recents, chapitresFaits }.
   L.estEtatVierge(etat)                -> booléen.
   L.fusionnerEtats(a, b)               -> réunion de deux progressions sans
       rien perdre ; à égalité « a » l’emporte, sauf pour un même jour, où la
       fiche cochée le plus tard est gardée. Réglages de « a ».
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
  var CLE_SURPRISE = "surprise"; /* choix « Surprise » : catégorie d’idées tirée au hasard */
  var MAX_ESSAIS_IDEE = 20; /* tirages au plus pour éviter de rendre la même idée */
  var MAX_FAVORIS = 50;
  var MAX_TEXTE_FAVORI = 300;
  var MAX_LECTURE_FAVORIS = 1000; /* garde-fou : entrées examinées dans une sauvegarde */
  var MAX_PROFONDEUR_COPIE = 12;
  var RE_ID_CHAPITRE = /^g\d{2}$/;
  var MAX_RETOUR = 1500;          /* retour de Claude sur un dessin */
  var PREFIXE_ADAPTE = "adapte-"; /* id d’un exercice adapté : "adapte-lun-03" */
  var MAX_CONSIGNE = 600;
  var MAX_ETAPE = 260;
  var MAX_ETAPES_ADAPTE = 4;
  var MAX_MATERIEL = 160;
  var MAX_SI_BLOQUE = 400;
  var MAX_POURQUOI = 300;
  var MAX_IDEES_MESURE = 4;
  var MAX_TEXTE_IDEE = 160;

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
      paliersVus: [],
      favoris: [],
      guide: { faits: {} }
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
    var version, jours, etat, retours, adaptation;
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
    etat = {
      version: 1,
      jours: nettoyerJours(jours === undefined ? {} : jours),
      tirage: nettoyerTirage(propre(objet, "tirage")),
      reglages: nettoyerReglages(propre(objet, "reglages")),
      paliersVus: nettoyerPaliersVus(propre(objet, "paliersVus")),
      favoris: nettoyerFavoris(propre(objet, "favoris")),
      guide: nettoyerGuide(propre(objet, "guide"))
    };
    /* Champs facultatifs : présents seulement s’ils ont un contenu, pour
       qu’une progression sans eux garde exactement sa forme d’avant. */
    retours = nettoyerRetours(propre(objet, "retours"), etat.jours);
    if (retours !== null) {
      etat.retours = retours;
    }
    adaptation = nettoyerAdaptation(propre(objet, "adaptation"));
    if (adaptation !== null) {
      etat.adaptation = adaptation;
    }
    return { ok: true, etat: etat };
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
    /* Le retour noté sur ce jour part avec lui. */
    return etatSur(nouveau);
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
    /* Changer d’exercice abandonne la version adaptée de l’ancien. */
    delete nouveau.adaptation;
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
  /* 5. Idées et favoris                                                 */
  /* ------------------------------------------------------------------ */

  function texteOuVide(v) {
    return typeof v === "string" ? v : "";
  }

  function morceauUtilisable(m) {
    return estObjetSimple(m) && typeof m.cle === "string" && m.cle !== "" &&
      estTableau(m.mots) && m.mots.length > 0;
  }

  function categorieUtilisable(c) {
    var i;
    if (!estObjetSimple(c) || typeof c.cle !== "string" || c.cle === "" ||
        !estTableau(c.morceaux) || c.morceaux.length === 0) {
      return false;
    }
    for (i = 0; i < c.morceaux.length; i++) {
      if (!morceauUtilisable(c.morceaux[i])) {
        return false;
      }
    }
    return true;
  }

  /* Les catégories d’origine (à ne pas modifier) dont on peut tirer une idée. */
  function categoriesUtilisables() {
    var idees = DDJ.idees;
    var liste = [];
    var i;
    if (!estObjetSimple(idees) || !estTableau(idees.categories)) {
      return liste;
    }
    for (i = 0; i < idees.categories.length; i++) {
      if (categorieUtilisable(idees.categories[i])) {
        liste.push(idees.categories[i]);
      }
    }
    return liste;
  }

  function categoriesIdees() {
    var source = categoriesUtilisables();
    var liste = [];
    var i;
    for (i = 0; i < source.length; i++) {
      liste.push({
        cle: source[i].cle,
        nom: texteOuVide(source[i].nom),
        description: texteOuVide(source[i].description)
      });
    }
    return liste;
  }

  function trouverCategorie(categories, cle) {
    var i;
    if (typeof cle !== "string") {
      return null;
    }
    for (i = 0; i < categories.length; i++) {
      if (categories[i].cle === cle) {
        return categories[i];
      }
    }
    return null;
  }

  /* Idée complète à partir d’une catégorie et d’un index par morceau
     (tableau dans l’ordre des morceaux, déjà vérifié). */
  function construireIdee(categorie, index) {
    var parCle = {};
    var mots = [];
    var morceaux = [];
    var i, m, mot, texte;
    for (i = 0; i < categorie.morceaux.length; i++) {
      m = categorie.morceaux[i];
      mot = rogner(m.mots[index[i]]);
      /* Préfixe : une clé de morceau ne peut pas viser une propriété héritée. */
      parCle["m:" + m.cle] = mot;
      mots.push(mot);
      morceaux.push({ cle: m.cle, nom: texteOuVide(m.nom), index: index[i], texte: mot });
    }
    if (typeof categorie.gabarit === "string" && rogner(categorie.gabarit) !== "") {
      texte = categorie.gabarit.replace(/\{([^{}]*)\}/g, function (tout, cle) {
        return possede(parCle, "m:" + cle) ? parCle["m:" + cle] : tout;
      });
    } else {
      texte = mots.join(" ");
    }
    /* Un mot vide ne doit pas laisser deux espaces à la suite. */
    texte = rogner(texte.replace(/ {2,}/g, " "));
    return {
      categorieCle: categorie.cle,
      categorieNom: texteOuVide(categorie.nom),
      texte: majuscule(texte),
      morceaux: morceaux
    };
  }

  /* Entier de 0 à n - 1 tiré avec alea (toute valeur douteuse donne 0). */
  function tirerIndex(alea, n) {
    var v = alea();
    if (typeof v !== "number" || !isFinite(v)) {
      return 0;
    }
    return Math.min(n - 1, Math.max(0, Math.floor(v * n)));
  }

  function indexValide(v, morceau) {
    return estEntier(v) && v >= 0 && v < morceau.mots.length;
  }

  function estVerrouille(verrous, morceau) {
    return indexValide(propre(verrous, morceau.cle), morceau);
  }

  /* En mode surprise : la catégorie qui accepte le plus de verrous, ou null.
     À égalité, celle dont les mots verrouillés figurent tous dans « eviter »
     (le texte de l’idée affichée) passe devant ; sinon la première gagne. */
  function categorieDesVerrous(categories, verrous, eviter) {
    var repere = eviter === null ? null : eviter.toLowerCase();
    var meilleure = null;
    var reconnue = false;
    var max = 0;
    var i, j, n, m, presents;
    for (i = 0; i < categories.length; i++) {
      n = 0;
      presents = true;
      for (j = 0; j < categories[i].morceaux.length; j++) {
        m = categories[i].morceaux[j];
        if (estVerrouille(verrous, m)) {
          n++;
          if (repere !== null && repere.indexOf(rogner(m.mots[verrous[m.cle]]).toLowerCase()) === -1) {
            presents = false;
          }
        }
      }
      if (n > max || (n === max && n > 0 && presents && !reconnue)) {
        max = n;
        meilleure = categories[i];
        reconnue = presents;
      }
    }
    return meilleure;
  }

  function tirerLesIndex(categorie, verrous, alea) {
    var index = [];
    var i, m;
    for (i = 0; i < categorie.morceaux.length; i++) {
      m = categorie.morceaux[i];
      index.push(estVerrouille(verrous, m) ? verrous[m.cle] : tirerIndex(alea, m.mots.length));
    }
    return index;
  }

  /* Première idée voisine (un seul morceau non verrouillé décalé) dont le
     texte diffère de « eviter », ou null. Coût borné par le nombre de mots. */
  function ideeVoisine(categorie, index, verrous, eviter) {
    var i, k, m, essai, idee;
    for (i = 0; i < categorie.morceaux.length; i++) {
      m = categorie.morceaux[i];
      if (estVerrouille(verrous, m)) {
        continue;
      }
      for (k = 1; k < m.mots.length; k++) {
        essai = index.slice();
        essai[i] = (index[i] + k) % m.mots.length;
        idee = construireIdee(categorie, essai);
        if (idee.texte !== eviter) {
          return idee;
        }
      }
    }
    return null;
  }

  function genererIdee(cleCategorie, options) {
    var opts = estObjetSimple(options) ? options : {};
    /* Seul endroit du fichier où le hasard natif est permis : valeur par défaut. */
    var alea = typeof opts.alea === "function" ? opts.alea : Math.random;
    var verrous = estObjetSimple(opts.verrous) ? opts.verrous : {};
    var eviter = typeof opts.eviter === "string" ? opts.eviter : null;
    var categories = categoriesUtilisables();
    var surprise = cleCategorie === undefined || cleCategorie === null || cleCategorie === CLE_SURPRISE;
    var imposee = null;
    var categorie, index, idee, voisine, essai, i, zeros, j;
    if (categories.length === 0) {
      return null;
    }
    if (surprise) {
      imposee = categorieDesVerrous(categories, verrous, eviter);
    } else {
      imposee = trouverCategorie(categories, cleCategorie);
      if (imposee === null) {
        return null;
      }
    }
    for (essai = 0; essai < MAX_ESSAIS_IDEE; essai++) {
      categorie = imposee !== null ? imposee : categories[tirerIndex(alea, categories.length)];
      index = tirerLesIndex(categorie, verrous, alea);
      idee = construireIdee(categorie, index);
      if (eviter === null || idee.texte !== eviter) {
        return idee;
      }
    }
    /* L’aléa s’entête : on prend la combinaison voisine, si elle existe. */
    voisine = ideeVoisine(categorie, index, verrous, eviter);
    if (voisine !== null) {
      return voisine;
    }
    if (imposee === null) {
      /* Surprise sans verrou : une autre catégorie fait aussi l’affaire. */
      for (i = 0; i < categories.length; i++) {
        if (categories[i] !== categorie) {
          zeros = [];
          for (j = 0; j < categories[i].morceaux.length; j++) {
            zeros.push(0);
          }
          voisine = construireIdee(categories[i], zeros);
          if (voisine.texte === eviter) {
            voisine = ideeVoisine(categories[i], zeros, {}, eviter);
          }
          if (voisine !== null) {
            return voisine;
          }
        }
      }
    }
    return idee;
  }

  function ideeDepuisIndex(cleCategorie, indexParMorceau) {
    var categorie = trouverCategorie(categoriesUtilisables(), cleCategorie);
    var enTableau = estTableau(indexParMorceau);
    var index = [];
    var i, m, v;
    if (categorie === null || (!enTableau && !estObjetSimple(indexParMorceau))) {
      return null;
    }
    if (enTableau && indexParMorceau.length !== categorie.morceaux.length) {
      return null;
    }
    for (i = 0; i < categorie.morceaux.length; i++) {
      m = categorie.morceaux[i];
      v = enTableau ? indexParMorceau[i] : propre(indexParMorceau, m.cle);
      if (!indexValide(v, m)) {
        return null;
      }
      index.push(v);
    }
    return construireIdee(categorie, index);
  }

  /* --- Favoris ------------------------------------------------------- */

  /* Le texte d’un favori, tel qu’il est rangé et comparé. Rogné une seconde
     fois après la coupe : si elle tombe juste après une espace, le texte
     rangé ne doit pas changer quand il repasse par ici. */
  function texteFavori(v) {
    return typeof v === "string" ? rogner(rogner(v).slice(0, MAX_TEXTE_FAVORI)) : "";
  }

  function horodatageSur(v) {
    return (typeof v === "string" && v.length <= MAX_HORODATAGE && !isNaN(Date.parse(v))) ? v : "";
  }

  /* Favori nettoyé { texte, categorieCle, ajouteLe }, ou null s’il est inutilisable. */
  function nettoyerFavori(v) {
    var texte, cle;
    if (!estObjetSimple(v)) {
      return null;
    }
    texte = texteFavori(propre(v, "texte"));
    if (texte === "") {
      return null;
    }
    cle = propre(v, "categorieCle");
    return {
      texte: texte,
      categorieCle: (typeof cle === "string" && RE_ID.test(cle)) ? cle : "",
      ajouteLe: horodatageSur(propre(v, "ajouteLe"))
    };
  }

  function nettoyerFavoris(v) {
    var favoris = [];
    var vus = {};
    var fin, i, f;
    if (!estTableau(v)) {
      return favoris;
    }
    fin = Math.min(v.length, MAX_LECTURE_FAVORIS);
    for (i = 0; i < fin && favoris.length < MAX_FAVORIS; i++) {
      f = nettoyerFavori(v[i]);
      /* Préfixe : aucun texte ne peut viser une propriété héritée de « vus ». */
      if (f !== null && vus["t:" + f.texte] !== true) {
        vus["t:" + f.texte] = true;
        favoris.push(f);
      }
    }
    return favoris;
  }

  function positionFavori(favoris, texte) {
    var i;
    for (i = 0; i < favoris.length; i++) {
      if (estObjetSimple(favoris[i]) && texteFavori(favoris[i].texte) === texte) {
        return i;
      }
    }
    return -1;
  }

  function estFavori(etat, texte) {
    var cherche = texteFavori(texte);
    if (cherche === "" || !estObjetSimple(etat) || !estTableau(etat.favoris)) {
      return false;
    }
    return positionFavori(etat.favoris, cherche) !== -1;
  }

  function ajouterFavori(etat, idee, horodatageISO) {
    var nouveau = etatSur(etat);
    var source = typeof idee === "string" ? { texte: idee } : idee;
    var favori = null;
    if (estObjetSimple(source)) {
      favori = nettoyerFavori({
        texte: propre(source, "texte"),
        categorieCle: propre(source, "categorieCle"),
        ajouteLe: horodatageISO
      });
    }
    if (favori === null || positionFavori(nouveau.favoris, favori.texte) !== -1) {
      return nouveau;
    }
    nouveau.favoris = [favori].concat(nouveau.favoris).slice(0, MAX_FAVORIS);
    return nouveau;
  }

  function retirerFavori(etat, texte) {
    var nouveau = etatSur(etat);
    var cherche = texteFavori(texte);
    var gardes = [];
    var i;
    for (i = 0; i < nouveau.favoris.length; i++) {
      if (nouveau.favoris[i].texte !== cherche) {
        gardes.push(nouveau.favoris[i]);
      }
    }
    nouveau.favoris = gardes;
    return nouveau;
  }

  /* ------------------------------------------------------------------ */
  /* 6. Guide « Apprendre »                                              */
  /* ------------------------------------------------------------------ */

  /* Copie en profondeur de données simples (tableaux, objets, valeurs). */
  function copieProfonde(v, profondeur) {
    var p = profondeur === undefined ? 0 : profondeur;
    var copie, i, nom;
    if (p >= MAX_PROFONDEUR_COPIE) {
      return null;
    }
    if (estTableau(v)) {
      copie = [];
      for (i = 0; i < v.length; i++) {
        copie.push(copieProfonde(v[i], p + 1));
      }
      return copie;
    }
    if (estObjetSimple(v)) {
      copie = {};
      for (nom in v) {
        if (possede(v, nom) && nom !== "__proto__") {
          copie[nom] = copieProfonde(v[nom], p + 1);
        }
      }
      return copie;
    }
    return v;
  }

  function estIdChapitre(id) {
    return typeof id === "string" && RE_ID_CHAPITRE.test(id);
  }

  /* Les chapitres d’origine (à ne pas modifier), triés par numéro. */
  function chapitresTries() {
    var guide = DDJ.guide;
    var rangs = [];
    var liste = [];
    var vus = {};
    var i, c;
    if (!estObjetSimple(guide) || !estTableau(guide.chapitres)) {
      return liste;
    }
    for (i = 0; i < guide.chapitres.length; i++) {
      c = guide.chapitres[i];
      if (estObjetSimple(c) && estIdChapitre(c.id) && typeof c.numero === "number" &&
          isFinite(c.numero) && vus[c.id] !== true) {
        vus[c.id] = true;
        rangs.push({ chapitre: c, rang: i });
      }
    }
    /* À numéro égal, l’ordre des données est gardé (tri stable partout). */
    rangs.sort(function (a, b) {
      return (a.chapitre.numero - b.chapitre.numero) || (a.rang - b.rang);
    });
    for (i = 0; i < rangs.length; i++) {
      liste.push(rangs[i].chapitre);
    }
    return liste;
  }

  function positionChapitre(chapitres, id) {
    var i;
    if (!estIdChapitre(id)) {
      return -1;
    }
    for (i = 0; i < chapitres.length; i++) {
      if (chapitres[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  function partiesGuide() {
    var guide = DDJ.guide;
    var parties = [];
    var i, p;
    if (!estObjetSimple(guide) || !estTableau(guide.parties)) {
      return parties;
    }
    for (i = 0; i < guide.parties.length; i++) {
      p = guide.parties[i];
      if (estObjetSimple(p) && typeof p.numero === "number" && isFinite(p.numero)) {
        parties.push({ numero: p.numero, titre: texteOuVide(p.titre), rang: i });
      }
    }
    parties.sort(function (a, b) {
      return (a.numero - b.numero) || (a.rang - b.rang);
    });
    for (i = 0; i < parties.length; i++) {
      delete parties[i].rang;
    }
    return parties;
  }

  function chapitresGuide() {
    return copieProfonde(chapitresTries());
  }

  function chapitreParId(id) {
    var chapitres = chapitresTries();
    var position = positionChapitre(chapitres, id);
    return position === -1 ? null : copieProfonde(chapitres[position]);
  }

  function chapitreVoisin(id, sens) {
    var chapitres = chapitresTries();
    var position = positionChapitre(chapitres, id);
    if (position === -1 || (sens !== -1 && sens !== 1)) {
      return null;
    }
    position += sens;
    if (position < 0 || position >= chapitres.length) {
      return null;
    }
    return copieProfonde(chapitres[position]);
  }

  /* etat.guide nettoyé : { faits: { "gNN": clé de date } }, clés triées. */
  function nettoyerGuide(v) {
    var source = estObjetSimple(v) ? propre(v, "faits") : undefined;
    var faits = {};
    var cles = [];
    var nom, i;
    if (estObjetSimple(source)) {
      for (nom in source) {
        if (possede(source, nom) && estIdChapitre(nom) && estCleValide(source[nom])) {
          cles.push(nom);
        }
      }
      cles.sort();
      for (i = 0; i < cles.length; i++) {
        faits[cles[i]] = source[cles[i]];
      }
    }
    return { faits: faits };
  }

  function dateChapitre(etat, id) {
    var faits, date;
    if (!estIdChapitre(id) || !estObjetSimple(etat) || !estObjetSimple(etat.guide) ||
        !estObjetSimple(etat.guide.faits)) {
      return null;
    }
    faits = etat.guide.faits;
    date = propre(faits, id);
    return estCleValide(date) ? date : null;
  }

  function chapitreFait(etat, id) {
    return dateChapitre(etat, id) !== null;
  }

  function marquerChapitre(etat, id, cleDate) {
    var nouveau = etatSur(etat);
    if (estIdChapitre(id) && estCleValide(cleDate)) {
      nouveau.guide.faits[id] = cleDate;
      nouveau.guide = nettoyerGuide(nouveau.guide); /* remet les clés dans l’ordre */
    }
    return nouveau;
  }

  function annulerChapitre(etat, id) {
    var nouveau = etatSur(etat);
    if (estIdChapitre(id) && possede(nouveau.guide.faits, id)) {
      delete nouveau.guide.faits[id];
    }
    return nouveau;
  }

  function nombreChapitresFaits(etat) {
    var chapitres = chapitresTries();
    var total = 0;
    var i;
    for (i = 0; i < chapitres.length; i++) {
      if (chapitreFait(etat, chapitres[i].id)) {
        total++;
      }
    }
    return total;
  }

  function prochainChapitre(etat) {
    var chapitres = chapitresTries();
    var i;
    for (i = 0; i < chapitres.length; i++) {
      if (!chapitreFait(etat, chapitres[i].id)) {
        return copieProfonde(chapitres[i]);
      }
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* 7. Schémas du guide                                                 */
  /* ------------------------------------------------------------------ */

  var SCHEMA_BALISES = ["line", "rect", "circle", "ellipse", "polyline", "polygon", "path", "text"];
  var SCHEMA_ATTRIBUTS = ["x1", "y1", "x2", "y2", "x", "y", "width", "height", "rx", "ry",
    "cx", "cy", "r", "points", "d", "transform", "classe", "ancre"];
  var SCHEMA_CLASSES = ["trait", "leger", "pointille", "accent", "fleche", "plein", "ombre",
    "ombre-forte", "surligne", "etiquette", "etiquette-accent"];
  var SCHEMA_ANCRES = ["start", "middle", "end"];
  var SCHEMA_LARGEUR = 320;
  var SCHEMA_HAUTEUR_MIN = 120;
  var SCHEMA_HAUTEUR_MAX = 240;
  var SCHEMA_MAX_FORMES = 40;
  var SCHEMA_MARGE = 6;
  var SCHEMA_CHAMPS_BLOC = ["type", "legende", "alt", "largeur", "hauteur", "formes"];
  var SCHEMA_NUMERIQUES = ["x1", "y1", "x2", "y2", "x", "y", "width", "height", "rx", "ry", "cx", "cy", "r"];
  var SCHEMA_CLASSES_TEXTE = ["etiquette", "etiquette-accent"];
  /* Attributs propres à chaque balise (classe et transform valent pour toutes). */
  var SCHEMA_PAR_BALISE = {
    line: { requis: ["x1", "y1", "x2", "y2"], facultatifs: [] },
    rect: { requis: ["x", "y", "width", "height"], facultatifs: ["rx", "ry"] },
    circle: { requis: ["cx", "cy", "r"], facultatifs: [] },
    ellipse: { requis: ["cx", "cy", "rx", "ry"], facultatifs: [] },
    polyline: { requis: ["points"], facultatifs: [] },
    polygon: { requis: ["points"], facultatifs: [] },
    path: { requis: ["d"], facultatifs: [] },
    text: { requis: ["x", "y"], facultatifs: ["ancre"] }
  };
  var MAX_TEXTE_TRACE = 2000;
  var TOLERANCE_CADRE = 1e-6;
  /* Nombre décimal simple : -?chiffres, puis une éventuelle partie décimale. */
  var RE_POINTS = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?(?: +-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)+$/;
  var RE_ROTATION = /^rotate\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)$/;
  /* Nombre d’arguments de chaque commande de tracé (coordonnées absolues). */
  var ARGUMENTS_TRACE = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

  function refus(message) {
    return { ok: false, erreur: message };
  }

  /* Petit aperçu d’une valeur pour un message d’erreur. */
  function apercu(v) {
    return typeof v === "string" ? "« " + v.slice(0, 30) + " »" : "(" + typeof v + ")";
  }

  /* "x,y x,y ..." -> { ok, points: [[x, y], ...] } ou { ok: false, erreur }. */
  function analyserPoints(texte, minimum) {
    var points = [];
    var paires, i, xy;
    if (typeof texte !== "string" || texte.length > MAX_TEXTE_TRACE || !RE_POINTS.test(texte)) {
      return refus("L’attribut « points » doit s’écrire x,y x,y ... avec au moins deux points.");
    }
    paires = texte.split(/ +/);
    for (i = 0; i < paires.length; i++) {
      xy = paires[i].split(",");
      points.push([parseFloat(xy[0]), parseFloat(xy[1])]);
    }
    if (points.length < minimum) {
      return refus("Il faut au moins " + minimum + " points.");
    }
    return { ok: true, points: points };
  }

  /* Tracé « d » -> { ok, points: points de passage } ou { ok: false, erreur }.
     Seules les commandes M L H V C S Q T A Z (majuscules) sont acceptées.
     On suit la grammaire des tracés SVG, sans rien tolérer de plus qu’elle
     (un navigateur arrête le dessin à la première erreur) : blancs = espace,
     tabulation ou saut de ligne ; une virgule au plus, et seulement entre
     deux nombres ; pas de point sans chiffre derrière (« 5. ») ; drapeaux
     d’arc écrits 0 ou 1. */
  function analyserTrace(d) {
    var jeton = /([MLHVCSQTAZ])|(-?(?:\d+(?:\.\d+)?|\.\d+))|([ \t\n\r]*,[ \t\n\r]*)|[ \t\n\r]+/g;
    var precedent = ""; /* nature du dernier jeton utile : "lettre", "nombre" ou "virgule" */
    var commandes = [];
    var points = [];
    var position = 0;
    var courante = null;
    var x = 0;
    var y = 0;
    var departX = 0;
    var departY = 0;
    var m, i, k, c, a, n, t;
    if (typeof d !== "string" || rogner(d) === "" || d.length > MAX_TEXTE_TRACE) {
      return refus("L’attribut « d » doit être un tracé non vide.");
    }
    jeton.lastIndex = 0;
    m = jeton.exec(d);
    while (m !== null) {
      if (m.index !== position) {
        return refus("Le tracé « d » contient un caractère non permis : " + apercu(d.slice(position, position + 12)) + ".");
      }
      position = jeton.lastIndex;
      if (m[1] !== undefined && m[1] !== "") {
        if (precedent === "virgule") {
          return refus("Le tracé « d » contient une virgule mal placée (elle ne sépare que deux nombres).");
        }
        courante = { lettre: m[1], nombres: [], textes: [] };
        commandes.push(courante);
        precedent = "lettre";
      } else if (m[2] !== undefined && m[2] !== "") {
        if (courante === null) {
          return refus("Le tracé « d » doit commencer par la commande M.");
        }
        courante.nombres.push(parseFloat(m[2]));
        courante.textes.push(m[2]);
        precedent = "nombre";
      } else if (m[3] !== undefined && m[3] !== "") {
        if (precedent !== "nombre") {
          return refus("Le tracé « d » contient une virgule mal placée (elle ne sépare que deux nombres).");
        }
        precedent = "virgule";
      }
      m = jeton.exec(d);
    }
    if (position !== d.length) {
      return refus("Le tracé « d » contient un caractère non permis : " + apercu(d.slice(position, position + 12)) + ".");
    }
    if (precedent === "virgule") {
      return refus("Le tracé « d » contient une virgule mal placée (elle ne sépare que deux nombres).");
    }
    if (commandes.length === 0 || commandes[0].lettre !== "M") {
      return refus("Le tracé « d » doit commencer par la commande M.");
    }
    for (i = 0; i < commandes.length; i++) {
      c = commandes[i];
      a = c.nombres;
      t = c.textes;
      n = ARGUMENTS_TRACE[c.lettre];
      if ((n === 0 && a.length !== 0) || (n > 0 && (a.length === 0 || a.length % n !== 0))) {
        return refus("La commande " + c.lettre + " du tracé « d » n’a pas le bon nombre de valeurs.");
      }
      if (c.lettre === "Z") {
        x = departX;
        y = departY;
        continue;
      }
      for (k = 0; k < a.length; k += n) {
        if (c.lettre === "H") {
          x = a[k];
        } else if (c.lettre === "V") {
          y = a[k];
        } else {
          /* Drapeaux jugés sur leur écriture : SVG lit « 01 » comme deux drapeaux. */
          if (c.lettre === "A" && (a[k] < 0 || a[k + 1] < 0 ||
              (t[k + 3] !== "0" && t[k + 3] !== "1") || (t[k + 4] !== "0" && t[k + 4] !== "1"))) {
            return refus("Un arc du tracé « d » a des rayons négatifs ou des drapeaux autres que 0 et 1.");
          }
          /* Le point d’arrivée est toujours le dernier couple de la commande. */
          x = a[k + n - 2];
          y = a[k + n - 1];
        }
        if (c.lettre === "M" && k === 0) {
          departX = x;
          departY = y;
        }
        points.push([x, y]);
      }
    }
    return { ok: true, points: points };
  }

  /* Image d’un point par rotate(angle cx cy), comme la calcule SVG. */
  function tourner(point, rotation) {
    var angle, cos, sin, dx, dy;
    if (rotation === null) {
      return point;
    }
    angle = rotation.angle * Math.PI / 180;
    cos = Math.cos(angle);
    sin = Math.sin(angle);
    dx = point[0] - rotation.cx;
    dy = point[1] - rotation.cy;
    return [rotation.cx + dx * cos - dy * sin, rotation.cy + dx * sin + dy * cos];
  }

  function dansLeCadre(point, largeur, hauteur, marge) {
    return point[0] >= marge - TOLERANCE_CADRE && point[0] <= largeur - marge + TOLERANCE_CADRE &&
      point[1] >= marge - TOLERANCE_CADRE && point[1] <= hauteur - marge + TOLERANCE_CADRE;
  }

  function validerForme(forme, largeur, hauteur, marge) {
    var avecCadre = largeur !== undefined || hauteur !== undefined || marge !== undefined;
    var bord = marge === undefined ? 0 : marge;
    var balise, a, regle, nom, i, classe, analyse, rotation, m, points, centre, p, angle, demiX, demiY;
    if (!estTableau(forme) || forme.length < 2 || forme.length > 3) {
      return refus("Une forme est un tableau [balise, attributs], ou [text, attributs, texte] pour une étiquette.");
    }
    balise = forme[0];
    if (typeof balise !== "string" || !dans(SCHEMA_BALISES, balise)) {
      return refus("Balise non permise : " + apercu(balise) + ".");
    }
    a = forme[1];
    if (!estObjetSimple(a)) {
      return refus("Les attributs de « " + balise + " » doivent être un objet.");
    }
    if (balise === "text") {
      if (forme.length !== 3 || typeof forme[2] !== "string" || rogner(forme[2]) === "") {
        return refus("Une forme « text » a besoin d’un texte non vide en troisième position.");
      }
    } else if (forme.length !== 2) {
      return refus("Seule une forme « text » peut porter un texte (« " + balise + " » n’en a pas).");
    }
    if (avecCadre && (typeof largeur !== "number" || !isFinite(largeur) || largeur <= 0 ||
        typeof hauteur !== "number" || !isFinite(hauteur) || hauteur <= 0)) {
      return refus("La largeur et la hauteur du cadre doivent être deux nombres positifs.");
    }
    if (typeof bord !== "number" || !isFinite(bord) || bord < 0) {
      return refus("La marge du cadre doit être un nombre positif ou nul.");
    }

    /* Attributs : tous permis, tous à leur place, aucun requis ne manque. */
    regle = SCHEMA_PAR_BALISE[balise];
    for (nom in a) {
      if (possede(a, nom)) {
        if (!dans(SCHEMA_ATTRIBUTS, nom)) {
          return refus("Attribut non permis sur « " + balise + " » : " + apercu(nom) + ".");
        }
        if (nom !== "classe" && nom !== "transform" && !dans(regle.requis, nom) && !dans(regle.facultatifs, nom)) {
          return refus("L’attribut « " + nom + " » ne s’utilise pas sur « " + balise + " ».");
        }
      }
    }
    for (i = 0; i < regle.requis.length; i++) {
      if (!possede(a, regle.requis[i])) {
        return refus("Il manque l’attribut « " + regle.requis[i] + " » sur « " + balise + " ».");
      }
    }

    /* Classe : une seule, permise, et compatible avec la balise. */
    classe = propre(a, "classe");
    if (typeof classe !== "string" || !dans(SCHEMA_CLASSES, classe)) {
      return refus("Classe absente ou non permise sur « " + balise + " » : " + apercu(classe) + ".");
    }
    if (classe === "fleche" && balise !== "line" && balise !== "path") {
      return refus("La classe « fleche » ne s’utilise que sur line et path.");
    }
    if (balise === "text" && !dans(SCHEMA_CLASSES_TEXTE, classe)) {
      return refus("Un texte utilise la classe « etiquette » ou « etiquette-accent », pas « " + classe + " ».");
    }
    if (balise !== "text" && dans(SCHEMA_CLASSES_TEXTE, classe)) {
      return refus("La classe « " + classe + " » est réservée aux textes.");
    }

    /* Valeurs numériques : de vrais nombres finis, tailles positives. */
    for (i = 0; i < SCHEMA_NUMERIQUES.length; i++) {
      nom = SCHEMA_NUMERIQUES[i];
      if (possede(a, nom) && (typeof a[nom] !== "number" || !isFinite(a[nom]))) {
        return refus("L’attribut « " + nom + " » de « " + balise + " » doit être un nombre fini.");
      }
    }
    if (balise === "rect" && (a.width <= 0 || a.height <= 0 ||
        (possede(a, "rx") && a.rx < 0) || (possede(a, "ry") && a.ry < 0))) {
      return refus("Un rectangle a une largeur et une hauteur positives, et des arrondis positifs ou nuls.");
    }
    if (balise === "circle" && a.r <= 0) {
      return refus("Le rayon d’un cercle doit être positif.");
    }
    if (balise === "ellipse" && (a.rx <= 0 || a.ry <= 0)) {
      return refus("Les rayons d’une ellipse doivent être positifs.");
    }
    if (possede(a, "ancre") && (typeof a.ancre !== "string" || !dans(SCHEMA_ANCRES, a.ancre))) {
      return refus("L’ancre d’un texte vaut start, middle ou end.");
    }

    /* Rotation éventuelle. */
    rotation = null;
    if (possede(a, "transform")) {
      m = typeof a.transform === "string" ? RE_ROTATION.exec(a.transform) : null;
      if (m === null) {
        return refus("L’attribut « transform » doit s’écrire exactement rotate(angle cx cy).");
      }
      rotation = { angle: parseFloat(m[1]), cx: parseFloat(m[2]), cy: parseFloat(m[3]) };
    }

    /* Points qui doivent tenir dans le cadre. */
    points = [];
    if (balise === "line") {
      points = [[a.x1, a.y1], [a.x2, a.y2]];
    } else if (balise === "rect") {
      points = [[a.x, a.y], [a.x + a.width, a.y], [a.x, a.y + a.height], [a.x + a.width, a.y + a.height]];
    } else if (balise === "ellipse") {
      points = [[a.cx - a.rx, a.cy], [a.cx + a.rx, a.cy], [a.cx, a.cy - a.ry], [a.cx, a.cy + a.ry]];
    } else if (balise === "text") {
      points = [[a.x, a.y]];
    } else if (balise === "polyline" || balise === "polygon") {
      analyse = analyserPoints(a.points, balise === "polygon" ? 3 : 2);
      if (!analyse.ok) {
        return analyse;
      }
      points = analyse.points;
    } else if (balise === "path") {
      analyse = analyserTrace(a.d);
      if (!analyse.ok) {
        return analyse;
      }
      points = analyse.points;
    }
    if (!avecCadre) {
      return { ok: true };
    }
    if (balise === "circle") {
      /* Un cercle qui tourne reste un cercle : seul son centre se déplace. */
      centre = tourner([a.cx, a.cy], rotation);
      points = [[centre[0] - a.r, centre[1]], [centre[0] + a.r, centre[1]],
        [centre[0], centre[1] - a.r], [centre[0], centre[1] + a.r]];
      rotation = null;
    } else if (balise === "ellipse" && rotation !== null) {
      /* Une ellipse tournée dépasse ses quatre sommets : on prend sa vraie boîte. */
      centre = tourner([a.cx, a.cy], rotation);
      angle = rotation.angle * Math.PI / 180;
      demiX = Math.sqrt(Math.pow(a.rx * Math.cos(angle), 2) + Math.pow(a.ry * Math.sin(angle), 2));
      demiY = Math.sqrt(Math.pow(a.rx * Math.sin(angle), 2) + Math.pow(a.ry * Math.cos(angle), 2));
      points = [[centre[0] - demiX, centre[1]], [centre[0] + demiX, centre[1]],
        [centre[0], centre[1] - demiY], [centre[0], centre[1] + demiY]];
      rotation = null;
    }
    for (i = 0; i < points.length; i++) {
      p = tourner(points[i], rotation);
      if (!dansLeCadre(p, largeur, hauteur, bord)) {
        return refus("La forme « " + balise + " » sort du cadre " + largeur + " × " + hauteur +
          (bord > 0 ? " (marge de " + bord + ")" : "") +
          " : point " + (Math.round(p[0] * 10) / 10) + "," + (Math.round(p[1] * 10) / 10) + ".");
      }
    }
    return { ok: true };
  }

  function validerSchema(bloc) {
    var nom, largeur, hauteur, formes, i, r;
    if (!estObjetSimple(bloc) || propre(bloc, "type") !== "schema") {
      return refus("Ce bloc n’est pas un schéma.");
    }
    for (nom in bloc) {
      if (possede(bloc, nom) && !dans(SCHEMA_CHAMPS_BLOC, nom)) {
        return refus("Propriété inconnue dans un schéma : " + apercu(nom) + ".");
      }
    }
    largeur = propre(bloc, "largeur");
    hauteur = propre(bloc, "hauteur");
    formes = propre(bloc, "formes");
    if (largeur !== SCHEMA_LARGEUR) {
      return refus("La largeur d’un schéma vaut " + SCHEMA_LARGEUR + ".");
    }
    if (typeof hauteur !== "number" || !isFinite(hauteur) || hauteur < SCHEMA_HAUTEUR_MIN || hauteur > SCHEMA_HAUTEUR_MAX) {
      return refus("La hauteur d’un schéma va de " + SCHEMA_HAUTEUR_MIN + " à " + SCHEMA_HAUTEUR_MAX + ".");
    }
    if (typeof propre(bloc, "legende") !== "string" || rogner(bloc.legende) === "") {
      return refus("Un schéma a besoin d’une légende.");
    }
    if (typeof propre(bloc, "alt") !== "string" || rogner(bloc.alt) === "") {
      return refus("Un schéma a besoin d’une description (alt).");
    }
    if (!estTableau(formes) || formes.length < 1 || formes.length > SCHEMA_MAX_FORMES) {
      return refus("Un schéma contient de 1 à " + SCHEMA_MAX_FORMES + " formes.");
    }
    for (i = 0; i < formes.length; i++) {
      r = validerForme(formes[i], largeur, hauteur);
      if (!r.ok) {
        return refus("Forme n° " + (i + 1) + " : " + r.erreur);
      }
    }
    return { ok: true };
  }

  /* ------------------------------------------------------------------ */
  /* 9. Compléments : retours, exercice adapté, idées sur mesure, fusion */
  /* ------------------------------------------------------------------ */

  /* Tout ce qui suit sert aux fonctions « avec Claude » de l’appli publiée
     comme artefact. Rien ici n’appelle Claude : ce sont les garde-fous par
     lesquels passe tout texte reçu avant d’être rangé ou affiché. */

  /* Texte d’une seule ligne : espaces et sauts de ligne ramenés à une espace. */
  function uneLigne(v, max) {
    if (typeof v !== "string") {
      return "";
    }
    return rogner(rogner(v.replace(/\s+/g, " ")).slice(0, max));
  }

  /* Texte de plusieurs paragraphes : sauts de ligne gardés, trois d’affilée au plus. */
  function plusieursLignes(v, max) {
    if (typeof v !== "string") {
      return "";
    }
    return rogner(rogner(v.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ")
      .replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n")).slice(0, max));
  }

  /* etat.retours nettoyé : { cle de jour: texte }, seulement pour des jours
     cochés ; null s’il n’y en a aucun. */
  function nettoyerRetours(v, jours) {
    var retours = {};
    var cles = [];
    var nom, i, texte;
    if (!estObjetSimple(v) || !estObjetSimple(jours)) {
      return null;
    }
    for (nom in v) {
      if (possede(v, nom) && estCleValide(nom) && possede(jours, nom)) {
        cles.push(nom);
      }
    }
    cles.sort();
    for (i = 0; i < cles.length; i++) {
      texte = plusieursLignes(v[cles[i]], MAX_RETOUR);
      if (texte !== "") {
        retours[cles[i]] = texte;
      }
    }
    for (nom in retours) {
      if (possede(retours, nom)) {
        return retours;
      }
    }
    return null;
  }

  function retourDuJour(etat, cle) {
    var texte;
    if (!estObjetSimple(etat) || !estObjetSimple(etat.retours) || !estCleValide(cle)) {
      return "";
    }
    texte = propre(etat.retours, cle);
    return typeof texte === "string" ? texte : "";
  }

  /* Range (ou, avec un texte vide, retire) le retour d’un jour coché. */
  function noterRetour(etat, cle, texte) {
    var nouveau = etatSur(etat);
    var retours = {};
    var nom;
    if (!estCleValide(cle) || !possede(nouveau.jours, cle)) {
      return nouveau;
    }
    if (estObjetSimple(nouveau.retours)) {
      for (nom in nouveau.retours) {
        if (possede(nouveau.retours, nom)) {
          retours[nom] = nouveau.retours[nom];
        }
      }
    }
    retours[cle] = typeof texte === "string" ? texte : "";
    nouveau.retours = retours;
    return etatSur(nouveau);
  }

  /* Étapes d’un exercice adapté : 2 à 4 lignes non vides. */
  function nettoyerEtapes(v) {
    var etapes = [];
    var i, ligne;
    if (!estTableau(v)) {
      return etapes;
    }
    for (i = 0; i < v.length && etapes.length < MAX_ETAPES_ADAPTE; i++) {
      ligne = uneLigne(v[i], MAX_ETAPE);
      if (ligne !== "") {
        etapes.push(ligne);
      }
    }
    return etapes;
  }

  /* etat.adaptation nettoyé, ou null s’il est inutilisable :
     { date, base, titre, consigne, etapes, materiel, siBloque, duree, pourquoi }. */
  function nettoyerAdaptation(v) {
    var date, base, titre, consigne, etapes, duree;
    if (!estObjetSimple(v)) {
      return null;
    }
    date = propre(v, "date");
    base = propre(v, "base");
    titre = uneLigne(propre(v, "titre"), MAX_TITRE);
    consigne = uneLigne(propre(v, "consigne"), MAX_CONSIGNE);
    etapes = nettoyerEtapes(propre(v, "etapes"));
    duree = propre(v, "duree");
    if (!estCleValide(date) || typeof base !== "string" || !RE_ID.test(PREFIXE_ADAPTE + base) ||
        titre === "" || consigne === "" || etapes.length < 2) {
      return null;
    }
    return {
      date: date,
      base: base,
      titre: titre,
      consigne: consigne,
      etapes: etapes,
      materiel: uneLigne(propre(v, "materiel"), MAX_MATERIEL),
      siBloque: uneLigne(propre(v, "siBloque"), MAX_SI_BLOQUE),
      duree: dans(DUREES, duree) ? duree : DUREES[1],
      pourquoi: uneLigne(propre(v, "pourquoi"), MAX_POURQUOI)
    };
  }

  /* Range la version adaptée de l’exercice « base » pour le jour « cle ».
     proposition : ce que Claude a renvoyé (jamais cru sur parole). Si elle
     est inutilisable, l’état revient inchangé. */
  function poserAdaptation(etat, cle, base, proposition) {
    var nouveau = etatSur(etat);
    var source = estObjetSimple(proposition) ? proposition : {};
    var adaptation = nettoyerAdaptation({
      date: cle,
      base: base,
      titre: propre(source, "titre"),
      consigne: propre(source, "consigne"),
      etapes: propre(source, "etapes"),
      materiel: propre(source, "materiel"),
      siBloque: propre(source, "siBloque"),
      duree: propre(source, "duree"),
      pourquoi: propre(source, "pourquoi")
    });
    if (adaptation !== null) {
      nouveau.adaptation = adaptation;
    }
    return nouveau;
  }

  function retirerAdaptation(etat) {
    var nouveau = etatSur(etat);
    delete nouveau.adaptation;
    return nouveau;
  }

  /* L’exercice adapté du jour « cle », sous la forme d’un exercice ordinaire
     (id "adapte-<base>", adapte: true), ou null. */
  function adaptationDuJour(etat, cle) {
    var a = estObjetSimple(etat) ? nettoyerAdaptation(etat.adaptation) : null;
    var origine;
    if (a === null || !estCleValide(cle) || a.date !== cle) {
      return null;
    }
    origine = exerciceParId(a.base);
    return {
      id: PREFIXE_ADAPTE + a.base,
      titre: a.titre,
      consigne: a.consigne,
      etapes: a.etapes,
      materiel: a.materiel,
      siBloque: a.siBloque,
      duree: a.duree,
      pourquoi: a.pourquoi,
      themeCle: origine ? origine.themeCle : "",
      themeNom: origine ? origine.themeNom : "",
      genere: false,
      adapte: true
    };
  }

  /* Idées reçues de Claude : au plus 4 textes d’une ligne, sans doublon. */
  function nettoyerIdeesSurMesure(v) {
    var idees = [];
    var vus = {};
    var i, texte;
    if (!estTableau(v)) {
      return idees;
    }
    for (i = 0; i < v.length && idees.length < MAX_IDEES_MESURE; i++) {
      texte = estObjetSimple(v[i]) ? propre(v[i], "texte") : v[i];
      texte = uneLigne(texte, MAX_TEXTE_IDEE).replace(/^["«»\s]+|["«»\s]+$/g, "");
      if (texte !== "" && vus["t:" + texte.toLowerCase()] !== true) {
        vus["t:" + texte.toLowerCase()] = true;
        idees.push(majuscule(texte));
      }
    }
    return idees;
  }

  /* Le texte d’un chapitre du guide, à plat (pour le donner à lire). */
  function texteChapitre(id) {
    var chapitres = chapitresTries();
    var position = positionChapitre(chapitres, id);
    var lignes = [];
    var c, blocs, i, j, b, type, elements;
    if (position === -1) {
      return "";
    }
    c = chapitres[position];
    lignes.push("Chapitre " + c.numero + " : " + texteOuVide(c.titre));
    if (texteOuVide(c.resume) !== "") {
      lignes.push(texteOuVide(c.resume));
    }
    blocs = estTableau(c.blocs) ? c.blocs : [];
    for (i = 0; i < blocs.length; i++) {
      b = blocs[i];
      if (!estObjetSimple(b)) {
        continue;
      }
      type = texteOuVide(b.type);
      elements = estTableau(b.elements) ? b.elements : (estTableau(b.etapes) ? b.etapes : []);
      if (type === "titre") {
        lignes.push("");
        lignes.push("## " + texteOuVide(b.contenu));
      } else if (type === "texte") {
        lignes.push(texteOuVide(b.contenu));
      } else if (type === "astuce" || type === "piege") {
        lignes.push((type === "astuce" ? "Astuce : " : "Piège : ") + texteOuVide(b.contenu));
      } else if (type === "schema") {
        lignes.push("[Schéma : " + texteOuVide(b.legende) + "]");
      } else if (type === "exercice") {
        lignes.push("Exercice (" + (typeof b.duree === "number" ? b.duree : "?") + " min) : " +
          texteOuVide(b.titre) + ". " + texteOuVide(b.consigne));
      } else if (type === "retenir") {
        lignes.push("À retenir :");
      }
      if (type === "liste" || type === "etapes" || type === "retenir" || type === "exercice") {
        for (j = 0; j < elements.length; j++) {
          if (texteOuVide(elements[j]) !== "") {
            lignes.push("- " + texteOuVide(elements[j]));
          }
        }
      }
    }
    return lignes.join("\n");
  }

  /* Ce que l’appli sait de la pratique récente, pour adapter un exercice :
     { total, serie, recents: [ { date, titre, theme, duree, ressenti } ],
       chapitresFaits: [ numéros ] }. Les « recents » sont les jours cochés
     les plus proches de « cle », du plus récent au plus ancien. */
  function contexteProgression(etat, cle, combien) {
    var sur = etatSur(etat);
    var max = estEntier(combien) && combien > 0 ? combien : 7;
    var cles = clesFaites(sur.jours).sort();
    var recents = [];
    var numeros = [];
    var chapitres = chapitresTries();
    var i, fiche;
    for (i = cles.length - 1; i >= 0 && recents.length < max; i--) {
      if (!estCleValide(cle) || cles[i] <= cle) {
        fiche = sur.jours[cles[i]];
        recents.push({
          date: cles[i],
          titre: fiche.titre,
          theme: fiche.themeNom,
          duree: fiche.duree,
          ressenti: fiche.ressenti
        });
      }
    }
    for (i = 0; i < chapitres.length; i++) {
      if (chapitreFait(sur, chapitres[i].id)) {
        numeros.push(chapitres[i].numero);
      }
    }
    return {
      total: totalJours(sur.jours),
      serie: estCleValide(cle) ? calculerSerie(sur.jours, cle).serie : 0,
      recents: recents,
      chapitresFaits: numeros
    };
  }

  /* Vrai si l’état ne contient encore rien (ni jour, ni favori, ni réglage changé). */
  function estEtatVierge(etat) {
    return versJSON(etat, false) === versJSON(etatInitial(), false);
  }

  /* Réunit deux progressions (deux appareils qui ont avancé chacun de leur
     côté) sans rien perdre : tout jour coché, favori, exercice du guide ou
     palier présent d’un côté est gardé. À égalité, « a » l’emporte, sauf pour
     un même jour, où la fiche cochée le plus tard est gardée. Les réglages
     sont ceux de « a ». */
  function fusionnerEtats(a, b) {
    var ea = etatSur(a);
    var eb = etatSur(b);
    var fusion = etatSur(ea);
    var retours = {};
    var nom, i, da, db;

    for (nom in eb.jours) {
      if (possede(eb.jours, nom) && (!possede(fusion.jours, nom) ||
          eb.jours[nom].faitLe > fusion.jours[nom].faitLe)) {
        fusion.jours[nom] = eb.jours[nom];
      }
    }
    for (nom in fusion.jours) {
      if (possede(fusion.jours, nom)) {
        /* Le retour suit la fiche gardée ; à défaut, celui qui existe. */
        da = retourDuJour(ea, nom);
        db = retourDuJour(eb, nom);
        if (possede(eb.jours, nom) && fusion.jours[nom] === eb.jours[nom]) {
          retours[nom] = db !== "" ? db : da;
        } else {
          retours[nom] = da !== "" ? da : db;
        }
      }
    }
    fusion.retours = retours;

    fusion.favoris = ea.favoris.concat(eb.favoris);
    for (nom in eb.guide.faits) {
      if (possede(eb.guide.faits, nom) && (!possede(fusion.guide.faits, nom) ||
          eb.guide.faits[nom] < fusion.guide.faits[nom])) {
        fusion.guide.faits[nom] = eb.guide.faits[nom];
      }
    }
    fusion.paliersVus = ea.paliersVus.concat(eb.paliersVus);

    da = ea.tirage.date;
    db = eb.tirage.date;
    if (db !== null && (da === null || db > da || (db === da && eb.tirage.n > ea.tirage.n))) {
      fusion.tirage = eb.tirage;
    }
    if (eb.adaptation && (!ea.adaptation || eb.adaptation.date > ea.adaptation.date)) {
      fusion.adaptation = eb.adaptation;
    }
    /* etatSur remet tout d’aplomb : doublons de favoris, tri, plafonds. */
    i = etatSur(fusion);
    return i;
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

    /* idées et favoris */
    CLE_SURPRISE: CLE_SURPRISE,
    categoriesIdees: categoriesIdees,
    genererIdee: genererIdee,
    ideeDepuisIndex: ideeDepuisIndex,
    MAX_FAVORIS: MAX_FAVORIS,
    ajouterFavori: ajouterFavori,
    retirerFavori: retirerFavori,
    estFavori: estFavori,

    /* guide */
    partiesGuide: partiesGuide,
    chapitresGuide: chapitresGuide,
    chapitreParId: chapitreParId,
    chapitreVoisin: chapitreVoisin,
    marquerChapitre: marquerChapitre,
    annulerChapitre: annulerChapitre,
    chapitreFait: chapitreFait,
    dateChapitre: dateChapitre,
    nombreChapitresFaits: nombreChapitresFaits,
    prochainChapitre: prochainChapitre,

    /* schémas du guide */
    SCHEMA_BALISES: SCHEMA_BALISES.slice(),
    SCHEMA_ATTRIBUTS: SCHEMA_ATTRIBUTS.slice(),
    SCHEMA_CLASSES: SCHEMA_CLASSES.slice(),
    SCHEMA_ANCRES: SCHEMA_ANCRES.slice(),
    SCHEMA_LARGEUR: SCHEMA_LARGEUR,
    SCHEMA_HAUTEUR_MIN: SCHEMA_HAUTEUR_MIN,
    SCHEMA_HAUTEUR_MAX: SCHEMA_HAUTEUR_MAX,
    SCHEMA_MAX_FORMES: SCHEMA_MAX_FORMES,
    SCHEMA_MARGE: SCHEMA_MARGE,
    validerForme: validerForme,
    validerSchema: validerSchema,

    /* compléments : retours, exercice adapté, idées sur mesure, fusion */
    MAX_RETOUR: MAX_RETOUR,
    PREFIXE_ADAPTE: PREFIXE_ADAPTE,
    retourDuJour: retourDuJour,
    noterRetour: noterRetour,
    poserAdaptation: poserAdaptation,
    retirerAdaptation: retirerAdaptation,
    adaptationDuJour: adaptationDuJour,
    nettoyerIdeesSurMesure: nettoyerIdeesSurMesure,
    texteChapitre: texteChapitre,
    contexteProgression: contexteProgression,
    estEtatVierge: estEtatVierge,
    fusionnerEtats: fusionnerEtats,

    /* aides internes */
    hacher: hacher,
    mulberry32: mulberry32,
    permutation: permutation
  };
})(typeof window !== "undefined" ? window : this);
