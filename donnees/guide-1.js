/* Dessin du jour — guide « Dessiner d’imagination, de A à Z ».
   Partie 1 : Voir en volumes (chapitres g01 à g04).
   Script classique : les chapitres s’ajoutent à window.DDJ.guide.chapitres.
   Les schémas sont décrits par des formes simples ; aucune couleur ici, elles viennent des classes. */
window.DDJ = window.DDJ || {};
DDJ.guide = DDJ.guide || {};
DDJ.guide.chapitres = DDJ.guide.chapitres || [];

DDJ.guide.parties = [
  { numero: 1, titre: "Voir en volumes" },
  { numero: 2, titre: "Remplir sa bibliothèque visuelle" },
  { numero: 3, titre: "Inventer" }
];

/* ───────────── Chapitre 1 ───────────── */
DDJ.guide.chapitres.push({
  id: "g01",
  numero: 1,
  partie: 1,
  titre: "D’où viennent les dessins d’imagination",
  resume: "Dessiner sans modèle n’est pas un don : c’est une construction qui repose sur trois piliers, et elle s’apprend.",
  blocs: [
    { type: "texte", contenu: "Certaines personnes sortent un cheval, une ville ou un dragon de leur crayon, sans aucun modèle. On dirait de la magie. C’est en réalité un savoir-faire qui se décompose, et chacun de ses morceaux s’apprend. Ce guide les prend un par un, dans l’ordre, en douze chapitres." },

    { type: "titre", contenu: "Pourquoi c’est difficile au début" },
    { type: "texte", contenu: "Quand on dessine de tête pour la première fois, la main ne trace pas ce que l’œil a vu : elle trace ce que la tête sait. Un œil devient une amande avec un rond, une maison un carré coiffé d’un triangle, un arbre une boule sur un bâton. Ce sont des symboles, une sorte d’écriture apprise dans l’enfance. Ils disent « œil » ou « maison », mais ils ne décrivent aucune forme réelle." },
    { type: "texte", contenu: "Ce n’est pas un manque de talent, c’est le fonctionnement normal de la mémoire : elle garde l’idée des choses, pas leur forme. Pour dessiner d’imagination, il faut donc lui donner autre chose à garder." },
    {
      type: "schema",
      legende: "À gauche, l’œil-symbole que la main trace par habitude. À droite, le même œil construit : une boule, et des paupières posées dessus.",
      alt: "Deux dessins d’un œil. À gauche, une amande plate avec un rond et trois cils. À droite, une sphère sur laquelle s’enroulent deux paupières, avec l’iris au centre.",
      largeur: 320,
      hauteur: 160,
      formes: [
        ["path", { d: "M 40 72 Q 80 42 120 72 Q 80 102 40 72 Z", classe: "trait" }],
        ["circle", { cx: 80, cy: 72, r: 12, classe: "trait" }],
        ["circle", { cx: 80, cy: 72, r: 5, classe: "plein" }],
        ["line", { x1: 64, y1: 59, x2: 59, y2: 49, classe: "trait" }],
        ["line", { x1: 80, y1: 57, x2: 80, y2: 46, classe: "trait" }],
        ["line", { x1: 96, y1: 59, x2: 101, y2: 49, classe: "trait" }],
        ["text", { x: 80, y: 140, ancre: "middle", classe: "etiquette" }, "Symbole"],
        ["circle", { cx: 235, cy: 72, r: 44, classe: "leger" }],
        ["path", { d: "M 189 70 Q 235 16 281 70", classe: "leger" }],
        ["path", { d: "M 193 78 Q 235 36 277 78", classe: "accent" }],
        ["path", { d: "M 193 78 Q 235 104 277 78", classe: "accent" }],
        ["circle", { cx: 235, cy: 74, r: 13, classe: "trait" }],
        ["circle", { cx: 235, cy: 74, r: 6, classe: "plein" }],
        ["line", { x1: 186, y1: 42, x2: 204, y2: 52, classe: "leger" }],
        ["text", { x: 184, y: 44, ancre: "end", classe: "etiquette" }, "paupière"],
        ["line", { x1: 188, y1: 108, x2: 200, y2: 101, classe: "leger" }],
        ["text", { x: 186, y: 114, ancre: "end", classe: "etiquette" }, "boule"],
        ["text", { x: 235, y: 140, ancre: "middle", classe: "etiquette" }, "Volume construit"]
      ]
    },
    { type: "texte", contenu: "Le symbole est plat, toujours vu de face, impossible à tourner. L’œil pensé comme un volume, lui, peut se pencher, s’éclairer, se regarder d’en dessous. Toute la différence est là." },

    { type: "titre", contenu: "Les trois piliers" },
    { type: "texte", contenu: "Dessiner d’imagination repose sur trois choses, et aucune n’est un don." },
    { type: "liste", elements: [
      "Construire des volumes simples (boîte, sphère, cylindre, cône) et savoir les tourner dans l’espace. C’est la première partie du guide.",
      "Avoir en tête une bibliothèque visuelle : des formes vraiment comprises, rangées en mémoire grâce à l’observation. C’est la deuxième partie.",
      "Suivre une méthode pour passer d’une idée vague à un dessin fini, étape par étape. C’est la troisième partie."
    ] },
    {
      type: "schema",
      legende: "Les trois piliers du dessin d’imagination. Chacun fait l’objet d’une partie du guide.",
      alt: "Un petit temple : un linteau marqué « Dessiner d’imagination » repose sur trois colonnes numérotées, nommées Volumes simples, Bibliothèque visuelle et Méthode pas à pas.",
      largeur: 320,
      hauteur: 176,
      formes: [
        ["rect", { x: 50, y: 48, width: 50, height: 80, classe: "surligne" }],
        ["rect", { x: 135, y: 48, width: 50, height: 80, classe: "surligne" }],
        ["rect", { x: 220, y: 48, width: 50, height: 80, classe: "surligne" }],
        ["rect", { x: 30, y: 18, width: 260, height: 30, classe: "trait" }],
        ["rect", { x: 50, y: 48, width: 50, height: 80, classe: "trait" }],
        ["rect", { x: 135, y: 48, width: 50, height: 80, classe: "trait" }],
        ["rect", { x: 220, y: 48, width: 50, height: 80, classe: "trait" }],
        ["line", { x1: 30, y1: 128, x2: 290, y2: 128, classe: "trait" }],
        ["text", { x: 160, y: 38, ancre: "middle", classe: "etiquette" }, "Dessiner d’imagination"],
        ["text", { x: 75, y: 93, ancre: "middle", classe: "etiquette-accent" }, "1"],
        ["text", { x: 160, y: 93, ancre: "middle", classe: "etiquette-accent" }, "2"],
        ["text", { x: 245, y: 93, ancre: "middle", classe: "etiquette-accent" }, "3"],
        ["text", { x: 75, y: 146, ancre: "middle", classe: "etiquette" }, "Volumes"],
        ["text", { x: 75, y: 162, ancre: "middle", classe: "etiquette" }, "simples"],
        ["text", { x: 160, y: 146, ancre: "middle", classe: "etiquette" }, "Bibliothèque"],
        ["text", { x: 160, y: 162, ancre: "middle", classe: "etiquette" }, "visuelle"],
        ["text", { x: 245, y: 146, ancre: "middle", classe: "etiquette" }, "Méthode"],
        ["text", { x: 245, y: 162, ancre: "middle", classe: "etiquette" }, "pas à pas"]
      ]
    },

    { type: "titre", contenu: "Le cycle qui remplit la mémoire" },
    { type: "texte", contenu: "Personne n’invente à partir de rien : on recompose ce qu’on a compris. La bibliothèque visuelle se remplit toujours de la même manière, en trois temps." },
    { type: "etapes", elements: [
      "Observer : regarder un sujet réel et le dessiner, en cherchant ses grandes formes plutôt que ses détails.",
      "Comprendre : se demander de quels volumes il est fait, et comment ils s’emboîtent.",
      "Reconstruire : cacher le modèle, puis le redessiner de tête, si possible sous un autre angle."
    ] },
    {
      type: "schema",
      legende: "Le cycle observer, comprendre, reconstruire. Chaque tour dépose une forme de plus dans la mémoire.",
      alt: "Trois cases disposées en triangle, Observer en haut, Comprendre en bas à droite, Reconstruire en bas à gauche, reliées par trois flèches qui tournent dans le sens des aiguilles d’une montre.",
      largeur: 320,
      hauteur: 196,
      formes: [
        ["rect", { x: 110, y: 22, width: 100, height: 30, rx: 8, ry: 8, classe: "trait" }],
        ["rect", { x: 204, y: 142, width: 100, height: 30, rx: 8, ry: 8, classe: "trait" }],
        ["rect", { x: 16, y: 142, width: 100, height: 30, rx: 8, ry: 8, classe: "trait" }],
        ["text", { x: 160, y: 42, ancre: "middle", classe: "etiquette" }, "Observer"],
        ["text", { x: 254, y: 162, ancre: "middle", classe: "etiquette" }, "Comprendre"],
        ["text", { x: 66, y: 162, ancre: "middle", classe: "etiquette" }, "Reconstruire"],
        ["line", { x1: 200, y1: 58, x2: 244, y2: 136, classe: "fleche" }],
        ["line", { x1: 198, y1: 157, x2: 122, y2: 157, classe: "fleche" }],
        ["line", { x1: 76, y1: 136, x2: 120, y2: 58, classe: "fleche" }],
        ["text", { x: 160, y: 112, ancre: "middle", classe: "etiquette-accent" }, "et on recommence"]
      ]
    },
    { type: "texte", contenu: "Dessiner d’après modèle n’est donc pas le contraire de l’imagination : c’est ce qui la nourrit." },

    { type: "titre", contenu: "Le matériel et l’état d’esprit" },
    { type: "texte", contenu: "Il suffit d’un crayon ou d’un stylo, et de papier ordinaire en quantité. Du papier bon marché vaut mieux qu’un beau carnet : on ose davantage le gâcher. La gomme est facultative." },
    { type: "texte", contenu: "Tu vas produire beaucoup de dessins bancals. Ce n’est pas le signe que ça ne marche pas : c’est le chemin lui-même. Chaque dessin raté montre précisément ce que ta mémoire ne sait pas encore, donc ce qu’il te reste à observer." },
    { type: "piege", contenu: "Croire qu’utiliser un modèle, c’est tricher. Toutes les personnes qui dessinent d’imagination ont passé, et passent encore, beaucoup de temps à observer. Regarder une référence avant ou pendant un dessin fait partie du travail." },
    { type: "piege", contenu: "Juger un dessin d’imagination en le comparant à une photo. Demande-toi plutôt : est-ce que je comprends mieux cette forme qu’hier ? C’est la seule mesure utile pour l’instant." },
    { type: "astuce", contenu: "Date tes pages et garde-les toutes, même celles qui te déplaisent. Dans un mois, elles montreront le chemin parcouru mieux que n’importe quel compliment." },
    { type: "texte", contenu: "La suite commence par le plus simple : avant les volumes, il faut des traits sûrs et quelques formes plates. C’est l’objet du chapitre 2." },

    {
      type: "exercice",
      titre: "Symbole ou forme ?",
      consigne: "Un petit test pour voir tes propres symboles à l’œuvre. Il n’y a rien à réussir : c’est l’écart entre les deux dessins qui est intéressant.",
      etapes: [
        "5 min : sans modèle, dessine de tête une tasse, une chaussure et une plante en pot. Ne corrige rien.",
        "5 min : pose l’un de ces trois objets devant toi et dessine-le en le regardant plus souvent que ta feuille.",
        "5 min : compare les deux versions et note à côté trois choses que ta mémoire avait oubliées ou simplifiées."
      ],
      materiel: "Crayon ou stylo, papier, un objet du quotidien",
      duree: 15
    },
    { type: "retenir", elements: [
      "On dessine d’abord des symboles : c’est normal, et ça se dépasse.",
      "Trois piliers : des volumes simples, une bibliothèque visuelle, une méthode.",
      "Observer, comprendre, reconstruire : ce cycle nourrit l’imagination."
    ] }
  ]
});

/* ───────────── Chapitre 2 ───────────── */
DDJ.guide.chapitres.push({
  id: "g02",
  numero: 2,
  partie: 1,
  titre: "Des traits sûrs et des formes simples",
  resume: "Avant les volumes, on apprend à tracer d’un geste franc et à résumer n’importe quel sujet en quelques formes plates.",
  blocs: [
    { type: "texte", contenu: "Au chapitre 1, on a vu que dessiner d’imagination, c’est construire. Toute construction commence avec deux outils très modestes : un trait franc, tracé d’un seul geste, et trois formes plates." },

    { type: "titre", contenu: "Pourquoi le trait compte" },
    { type: "texte", contenu: "Un dessin construit se fait en deux passes : des traits légers pour chercher, puis des traits appuyés pour affirmer. Si chaque ligne est hachée en petits bouts hésitants, la forme devient floue et l’on ne voit plus ce que l’on construit. Un trait tracé d’un seul geste, même un peu faux, se lit et se corrige bien plus facilement." },
    {
      type: "schema",
      legende: "La même ligne, tracée par petits bouts puis d’un seul geste entre deux points.",
      alt: "En haut, une ligne faite d’une dizaine de petits traits qui se chevauchent, d’aspect hésitant. En bas, une ligne nette et continue tracée entre deux points.",
      largeur: 320,
      hauteur: 130,
      formes: [
        ["line", { x1: 30, y1: 37, x2: 68, y2: 34, classe: "trait" }],
        ["line", { x1: 54, y1: 33, x2: 92, y2: 36, classe: "trait" }],
        ["line", { x1: 78, y1: 37, x2: 116, y2: 35, classe: "trait" }],
        ["line", { x1: 102, y1: 34, x2: 140, y2: 37, classe: "trait" }],
        ["line", { x1: 126, y1: 36, x2: 164, y2: 33, classe: "trait" }],
        ["line", { x1: 150, y1: 34, x2: 188, y2: 37, classe: "trait" }],
        ["line", { x1: 174, y1: 37, x2: 212, y2: 35, classe: "trait" }],
        ["line", { x1: 198, y1: 33, x2: 236, y2: 36, classe: "trait" }],
        ["line", { x1: 222, y1: 36, x2: 260, y2: 34, classe: "trait" }],
        ["line", { x1: 246, y1: 35, x2: 284, y2: 38, classe: "trait" }],
        ["line", { x1: 262, y1: 36, x2: 290, y2: 34, classe: "trait" }],
        ["text", { x: 160, y: 60, ancre: "middle", classe: "etiquette" }, "Trait hésitant"],
        ["line", { x1: 30, y1: 94, x2: 290, y2: 94, classe: "trait" }],
        ["circle", { cx: 30, cy: 94, r: 3, classe: "plein" }],
        ["circle", { cx: 290, cy: 94, r: 3, classe: "plein" }],
        ["text", { x: 160, y: 118, ancre: "middle", classe: "etiquette" }, "Trait sûr : un seul geste"]
      ]
    },

    { type: "titre", contenu: "Dessiner depuis l’épaule" },
    { type: "texte", contenu: "Le poignet ne sait tracer que de petites courbes. Pour une longue ligne ou un grand rond, c’est tout le bras qui doit bouger, depuis l’épaule, la main glissant sur la feuille. Le geste paraît étrange les premiers jours, puis il devient naturel. Pour le préparer, on répète d’abord le mouvement dans le vide : c’est le trait fantôme." },
    { type: "etapes", elements: [
      "Marque deux points sur la feuille.",
      "Fais deux ou trois allers-retours de l’un à l’autre, la pointe juste au-dessus du papier, sans le toucher.",
      "Sans arrêter le mouvement, pose la pointe et trace d’un seul geste, à vitesse moyenne.",
      "Regarde où le trait est arrivé, puis passe au suivant sans le repasser."
    ] },
    { type: "texte", contenu: "Même principe pour les ronds et les ellipses (une ellipse, c’est un rond vu de biais, donc aplati) : tourne deux ou trois fois dans le vide, laisse la pointe se poser et fais deux tours. Une ellipse réussie est symétrique et n’a aucun coin." },
    { type: "astuce", contenu: "Tourne ta feuille autant que tu veux. Chaque main a une direction où le trait part mieux : amène la ligne à tracer dans cette direction plutôt que de te tordre le bras." },

    { type: "titre", contenu: "Trois formes pour tout résumer" },
    { type: "texte", contenu: "Avant de penser volume, il faut voir simple. Presque tous les sujets se résument, à plat, par des ronds, des carrés et des triangles, étirés, écrasés ou combinés. C’est le premier geste du dessin d’imagination : remplacer un sujet compliqué par quelques formes que l’on maîtrise." },
    {
      type: "schema",
      legende: "Les trois formes de base. Étirées ou écrasées, elles donnent l’ovale, le rectangle et tous les triangles.",
      alt: "Trois formes plates alignées : un rond, un carré et un triangle, chacune avec son nom en dessous.",
      largeur: 320,
      hauteur: 136,
      formes: [
        ["circle", { cx: 60, cy: 58, r: 36, classe: "trait" }],
        ["rect", { x: 124, y: 22, width: 72, height: 72, classe: "trait" }],
        ["polygon", { points: "224,94 296,94 260,22", classe: "trait" }],
        ["text", { x: 60, y: 118, ancre: "middle", classe: "etiquette" }, "Rond"],
        ["text", { x: 160, y: 118, ancre: "middle", classe: "etiquette" }, "Carré"],
        ["text", { x: 260, y: 118, ancre: "middle", classe: "etiquette" }, "Triangle"]
      ]
    },
    { type: "texte", contenu: "Pour décomposer un sujet, commence par la plus grande forme, ajoute les moyennes, et laisse les détails pour plus tard. Une théière vue de profil, par exemple, tient en cinq formes." },
    {
      type: "schema",
      legende: "Une théière de profil, résumée en cinq formes plates qui se chevauchent.",
      alt: "Une théière schématique : un grand rond pour le corps, un triangle à gauche pour le bec, un ovale à droite pour l’anse, un rectangle pour le couvercle et un petit rond pour son bouton.",
      largeur: 320,
      hauteur: 176,
      formes: [
        ["circle", { cx: 160, cy: 112, r: 44, classe: "trait" }],
        ["rect", { x: 140, y: 60, width: 40, height: 10, classe: "trait" }],
        ["circle", { cx: 160, cy: 54, r: 6, classe: "trait" }],
        ["polygon", { points: "122,128 120,98 84,80", classe: "trait" }],
        ["ellipse", { cx: 208, cy: 110, rx: 15, ry: 24, classe: "trait" }],
        ["text", { x: 160, y: 116, ancre: "middle", classe: "etiquette-accent" }, "rond"],
        ["text", { x: 66, y: 112, ancre: "middle", classe: "etiquette-accent" }, "triangle"],
        ["text", { x: 232, y: 114, ancre: "start", classe: "etiquette-accent" }, "ovale"],
        ["text", { x: 190, y: 68, ancre: "start", classe: "etiquette-accent" }, "rectangle"],
        ["text", { x: 146, y: 50, ancre: "end", classe: "etiquette-accent" }, "petit rond"]
      ]
    },

    { type: "titre", contenu: "La silhouette" },
    { type: "texte", contenu: "La silhouette, c’est le contour extérieur d’un sujet, rempli de noir comme une ombre chinoise. Si elle suffit à faire reconnaître le sujet, le dessin sera lisible, quels que soient les détails ajoutés ensuite. C’est aussi un bon test pour choisir sous quel angle montrer un objet." },
    {
      type: "schema",
      legende: "La même théière en silhouette. De profil, le bec et l’anse la font reconnaître ; de face, ils disparaissent dans la masse.",
      alt: "Deux silhouettes noires. À gauche, la théière de profil, avec son bec et son anse bien visibles. À droite, la théière de face : un rond surmonté d’un couvercle, difficile à identifier.",
      largeur: 320,
      hauteur: 170,
      formes: [
        ["polygon", { points: "54,113 52,89 22,74", classe: "plein" }],
        ["path", { d: "M 113 100 A 14 22 0 1 1 141 100 A 14 22 0 1 1 113 100 Z M 119 100 A 8 15 0 1 0 135 100 A 8 15 0 1 0 119 100 Z", classe: "plein" }],
        ["circle", { cx: 85, cy: 100, r: 36, classe: "plein" }],
        ["rect", { x: 69, y: 57, width: 32, height: 9, classe: "plein" }],
        ["circle", { cx: 85, cy: 53, r: 5, classe: "plein" }],
        ["circle", { cx: 235, cy: 100, r: 36, classe: "plein" }],
        ["rect", { x: 219, y: 57, width: 32, height: 9, classe: "plein" }],
        ["circle", { cx: 235, cy: 53, r: 5, classe: "plein" }],
        ["text", { x: 85, y: 158, ancre: "middle", classe: "etiquette" }, "De profil : lisible"],
        ["text", { x: 235, y: 158, ancre: "middle", classe: "etiquette" }, "De face : peu lisible"]
      ]
    },
    { type: "piege", contenu: "Le trait « poilu », fait de dizaines de petits coups de crayon. Il rassure, mais il cache la forme. Préfère un seul trait léger ; s’il est faux, trace-en un second à côté, et n’appuie que sur le bon." },
    { type: "piege", contenu: "Commencer par un détail (un œil, une poignée) et construire le reste autour. Les proportions partent alors de travers. Pose toujours la plus grande forme en premier." },
    { type: "astuce", contenu: "Pour juger une silhouette sans la noircir, plisse les yeux : les détails s’effacent et il ne reste que la masse." },
    { type: "texte", contenu: "Ces formes plates sont des plans de départ. Au chapitre 3, on leur donne de l’épaisseur : le carré devient boîte, le rond devient sphère." },

    {
      type: "exercice",
      titre: "Traits fantômes et formes plates",
      consigne: "Un échauffement en trois temps, à refaire aussi souvent que tu veux avant de dessiner. Vise des traits décidés, pas des traits parfaits.",
      etapes: [
        "5 min : sème des paires de points sur la page et relie-les d’un seul geste, après deux passages fantômes au-dessus du papier.",
        "5 min : remplis une demi-page de ronds et d’ellipses de toutes tailles, en faisant deux tours sur chacun.",
        "5 min : choisis trois objets autour de toi, résume chacun en trois à cinq formes plates, puis noircis la silhouette de celui que tu préfères."
      ],
      materiel: "Crayon ou stylo, papier",
      duree: 15
    },
    { type: "retenir", elements: [
      "Un trait franc, préparé par un geste fantôme, vaut mieux que dix petits traits hésitants.",
      "Tout sujet se résume d’abord à quelques formes plates : rond, carré, triangle.",
      "Une silhouette lisible annonce un dessin qui se comprendra."
    ] }
  ]
});

/* ───────────── Chapitre 3 ───────────── */
DDJ.guide.chapitres.push({
  id: "g03",
  numero: 3,
  partie: 1,
  titre: "Du plat au volume",
  resume: "Quatre volumes suffisent pour tout construire : la boîte, la sphère, le cylindre et le cône.",
  blocs: [
    { type: "texte", contenu: "Au chapitre 2, on a résumé les sujets par des formes plates. Il leur manque une dimension : la profondeur. C’est elle qui permet de tourner un objet dans sa tête, donc de le dessiner sous un angle que l’on n’a jamais vu." },

    { type: "titre", contenu: "Pourquoi quatre volumes suffisent" },
    { type: "texte", contenu: "La boîte, la sphère, le cylindre et le cône sont assez simples pour être dessinés sans modèle, sous tous les angles. Et presque tous les objets s’y ramènent, en les étirant, en les coupant ou en les assemblant : un livre est une boîte, un bras un cylindre, un chapeau pointu un cône. Apprendre ces quatre volumes, c’est apprendre l’alphabet de tout le reste." },

    { type: "titre", contenu: "Du carré à la boîte" },
    { type: "texte", contenu: "Une forme plate n’a qu’une face. Un volume en a plusieurs, et l’on n’en voit jamais qu’une partie : trois au maximum pour une boîte." },
    { type: "etapes", elements: [
      "Trace un carré : c’est la face avant.",
      "De trois de ses coins, tire trois traits de même longueur, parallèles entre eux, qui partent en biais vers l’arrière.",
      "Relie leurs extrémités par deux traits parallèles aux côtés du carré : la boîte est fermée.",
      "Ajoute en traits légers les arêtes cachées, comme si la boîte était en verre."
    ] },
    {
      type: "schema",
      legende: "Le carré devient la face avant d’une boîte. En pointillés, les trois arêtes cachées.",
      alt: "À gauche, un carré. Une flèche mène à une boîte dont ce carré est la face avant : trois arêtes parallèles partent en biais vers l’arrière, et les arêtes cachées sont en pointillés.",
      largeur: 320,
      hauteur: 156,
      formes: [
        ["rect", { x: 30, y: 55, width: 70, height: 70, classe: "surligne" }],
        ["rect", { x: 185, y: 55, width: 70, height: 70, classe: "surligne" }],
        ["rect", { x: 30, y: 55, width: 70, height: 70, classe: "trait" }],
        ["line", { x1: 116, y1: 90, x2: 166, y2: 90, classe: "fleche" }],
        ["line", { x1: 185, y1: 125, x2: 220, y2: 100, classe: "pointille" }],
        ["line", { x1: 220, y1: 100, x2: 290, y2: 100, classe: "pointille" }],
        ["line", { x1: 220, y1: 100, x2: 220, y2: 30, classe: "pointille" }],
        ["rect", { x: 185, y: 55, width: 70, height: 70, classe: "trait" }],
        ["polyline", { points: "185,55 220,30 290,30 255,55", classe: "trait" }],
        ["polyline", { points: "290,30 290,100 255,125", classe: "trait" }],
        ["text", { x: 65, y: 144, ancre: "middle", classe: "etiquette" }, "Carré"],
        ["text", { x: 237, y: 144, ancre: "middle", classe: "etiquette" }, "Boîte"]
      ]
    },
    { type: "texte", contenu: "Tracer aussi les arêtes cachées s’appelle dessiner à travers. C’est l’habitude la plus utile de ce chapitre : elle oblige à penser l’objet en entier, et pas seulement sa façade. Ici, les traits qui partent vers l’arrière restent parallèles. C’est une simplification commode ; au chapitre 4, on les fera se rapprocher, comme dans la réalité." },

    { type: "titre", contenu: "Du rond à la sphère" },
    { type: "texte", contenu: "Une sphère a la même silhouette qu’un rond : un cercle. Ce qui lui donne du volume, ce sont les lignes de contour, des lignes imaginaires qui font le tour de la forme comme un élastique autour d’un ballon. Vues de biais, elles deviennent des ellipses, et elles montrent vers où la sphère est tournée." },
    {
      type: "schema",
      legende: "Deux lignes de contour suffisent à transformer un rond en sphère. En pointillés, leur moitié cachée, de l’autre côté.",
      alt: "À gauche, un simple rond. Une flèche mène au même rond devenu sphère grâce à deux ellipses qui en font le tour, l’une couchée, l’autre debout, et qui se croisent sur le devant.",
      largeur: 320,
      hauteur: 156,
      formes: [
        ["circle", { cx: 65, cy: 75, r: 40, classe: "trait" }],
        ["line", { x1: 120, y1: 75, x2: 170, y2: 75, classe: "fleche" }],
        ["path", { d: "M 195 75 A 45 14 0 0 1 285 75", classe: "pointille" }],
        ["path", { d: "M 244.71 30.24 A 13.7 45 6 0 1 235.29 119.76", classe: "pointille" }],
        ["circle", { cx: 240, cy: 75, r: 45, classe: "trait" }],
        ["path", { d: "M 195 75 A 45 14 0 0 0 285 75", classe: "accent" }],
        ["path", { d: "M 244.71 30.24 A 13.7 45 6 0 0 235.29 119.76", classe: "accent" }],
        ["text", { x: 65, y: 144, ancre: "middle", classe: "etiquette" }, "Rond"],
        ["text", { x: 240, y: 144, ancre: "middle", classe: "etiquette" }, "Sphère"]
      ]
    },

    { type: "titre", contenu: "Le cylindre et le cône" },
    { type: "texte", contenu: "Un cylindre, c’est deux ellipses reliées par deux traits droits. Trace d’abord son axe, la ligne qui le traverse par le centre sur toute sa longueur, puis une ellipse à chaque bout. Règle à garder : la grande largeur de l’ellipse croise l’axe à angle droit, que le cylindre soit debout ou penché." },
    {
      type: "schema",
      legende: "Debout ou penché, un cylindre se construit sur son axe. En couleur, la grande largeur de l’ellipse : elle croise l’axe à angle droit.",
      alt: "Deux cylindres, l’un debout, l’autre penché vers la droite. Chacun a un axe en pointillés, une ellipse à chaque bout, et un trait de couleur en travers de l’ellipse du haut, perpendiculaire à l’axe.",
      largeur: 320,
      hauteur: 206,
      formes: [
        ["line", { x1: 100, y1: 24, x2: 100, y2: 180, classe: "pointille" }],
        ["path", { d: "M 50 150 A 50 15 0 0 1 150 150", classe: "pointille" }],
        ["ellipse", { cx: 100, cy: 54, rx: 50, ry: 15, classe: "trait" }],
        ["line", { x1: 50, y1: 54, x2: 50, y2: 150, classe: "trait" }],
        ["line", { x1: 150, y1: 54, x2: 150, y2: 150, classe: "trait" }],
        ["path", { d: "M 50 150 A 50 15 0 0 0 150 150", classe: "trait" }],
        ["line", { x1: 50, y1: 54, x2: 150, y2: 54, classe: "accent" }],
        ["text", { x: 106, y: 32, ancre: "start", classe: "etiquette" }, "axe"],
        ["text", { x: 100, y: 196, ancre: "middle", classe: "etiquette" }, "Cylindre debout"],
        ["line", { x1: 235, y1: 40, x2: 235, y2: 168, transform: "rotate(30 235 104)", classe: "pointille" }],
        ["path", { d: "M 205 146 A 30 9 0 0 1 265 146", transform: "rotate(30 235 104)", classe: "pointille" }],
        ["ellipse", { cx: 235, cy: 62, rx: 30, ry: 9, transform: "rotate(30 235 104)", classe: "trait" }],
        ["line", { x1: 205, y1: 62, x2: 205, y2: 146, transform: "rotate(30 235 104)", classe: "trait" }],
        ["line", { x1: 265, y1: 62, x2: 265, y2: 146, transform: "rotate(30 235 104)", classe: "trait" }],
        ["path", { d: "M 205 146 A 30 9 0 0 0 265 146", transform: "rotate(30 235 104)", classe: "trait" }],
        ["line", { x1: 205, y1: 62, x2: 265, y2: 62, transform: "rotate(30 235 104)", classe: "accent" }],
        ["text", { x: 235, y: 196, ancre: "middle", classe: "etiquette" }, "Cylindre penché"]
      ]
    },
    { type: "texte", contenu: "Le cône part d’une seule ellipse : un axe, une pointe posée sur cet axe, et deux traits qui descendent de la pointe jusqu’aux bords de l’ellipse. Coupé avant la pointe, il donne un pot de fleurs, un abat-jour ou un gobelet." },
    {
      type: "schema",
      legende: "Un cône entier, puis un cône coupé et retourné : la forme d’un pot de fleurs.",
      alt: "À gauche, un cône : une ellipse à la base, une pointe au-dessus sur l’axe, et deux traits droits qui les relient. À droite, un pot de fleurs fait d’une grande ellipse en haut et d’une petite en bas.",
      largeur: 320,
      hauteur: 176,
      formes: [
        ["line", { x1: 90, y1: 22, x2: 90, y2: 132, classe: "pointille" }],
        ["path", { d: "M 40.47 129.96 A 50 15 0 0 1 139.53 129.96", classe: "pointille" }],
        ["path", { d: "M 40.47 129.96 A 50 15 0 1 0 139.53 129.96", classe: "trait" }],
        ["line", { x1: 90, y1: 22, x2: 40.47, y2: 129.96, classe: "trait" }],
        ["line", { x1: 90, y1: 22, x2: 139.53, y2: 129.96, classe: "trait" }],
        ["text", { x: 100, y: 26, ancre: "start", classe: "etiquette" }, "pointe"],
        ["text", { x: 90, y: 164, ancre: "middle", classe: "etiquette" }, "Cône"],
        ["path", { d: "M 207 134 A 28 8 0 0 1 263 134", classe: "pointille" }],
        ["ellipse", { cx: 235, cy: 62, rx: 45, ry: 13, classe: "trait" }],
        ["line", { x1: 190, y1: 62, x2: 207, y2: 134, classe: "trait" }],
        ["line", { x1: 280, y1: 62, x2: 263, y2: 134, classe: "trait" }],
        ["path", { d: "M 207 134 A 28 8 0 0 0 263 134", classe: "trait" }],
        ["text", { x: 235, y: 164, ancre: "middle", classe: "etiquette" }, "Cône coupé : un pot"]
      ]
    },
    { type: "piege", contenu: "Les ellipses en forme de ballon de rugby, avec deux pointes sur les côtés. Une ellipse est arrondie partout : ralentis dans les virages et garde-les bien ronds." },
    { type: "piege", contenu: "Fermer le bas d’un cylindre par un trait droit. Le fond est un cercle vu de biais, exactement comme le dessus : il se dessine lui aussi avec une courbe d’ellipse." },
    { type: "astuce", contenu: "Sur chaque volume, trace une ou deux lignes de contour, même sur une boîte. C’est le moyen le plus rapide de vérifier que tu le penses en trois dimensions." },
    { type: "texte", contenu: "Tu sais maintenant donner de l’épaisseur à une forme. Au chapitre 4, on place ces volumes dans l’espace pour les voir de dessus, de face ou de dessous." },

    {
      type: "exercice",
      titre: "Une page de volumes",
      consigne: "Remplis une page avec les quatre volumes, sans chercher à faire joli. Des boîtes de travers et des ellipses cabossées sont exactement ce qu’on attend d’une première page.",
      etapes: [
        "5 min : dessine six carrés de tailles variées et transforme chacun en boîte, arêtes cachées comprises.",
        "5 min : dessine quatre cylindres et deux cônes, debout puis penchés, en commençant chaque fois par l’axe.",
        "10 min : dessine cinq sphères avec deux lignes de contour qui se croisent, puis invente un petit objet en assemblant deux ou trois volumes."
      ],
      materiel: "Crayon, papier",
      duree: 20
    },
    { type: "retenir", elements: [
      "Boîte, sphère, cylindre, cône : quatre volumes pour tout construire.",
      "Dessine à travers : les arêtes cachées font exister le volume.",
      "La grande largeur d’une ellipse est perpendiculaire à l’axe du cylindre."
    ] }
  ]
});

/* ───────────── Chapitre 4 ───────────── */
DDJ.guide.chapitres.push({
  id: "g04",
  numero: 4,
  partie: 1,
  titre: "Tourner les volumes dans l’espace",
  resume: "Avec une ligne d’horizon et un ou deux points de fuite, tu places une boîte où tu veux et tu la regardes de dessus, de face ou de dessous.",
  blocs: [
    { type: "texte", contenu: "Au chapitre 3, les boîtes avaient des arêtes parallèles. C’était pratique, mais il leur manquait ce qui donne l’impression d’espace : dans la réalité, ce qui s’éloigne paraît plus petit. La perspective est simplement la méthode qui permet de dessiner ce rétrécissement de façon cohérente. Deux ou trois idées suffisent pour s’en servir à main levée." },

    { type: "titre", contenu: "La ligne d’horizon, c’est la hauteur de tes yeux" },
    { type: "texte", contenu: "La ligne d’horizon est une ligne horizontale imaginaire, située exactement à la hauteur des yeux de la personne qui regarde. Si tu t’accroupis, elle descend ; si tu montes sur une chaise, elle monte. Ce qui se trouve plus bas que tes yeux, tu le vois de dessus ; ce qui se trouve plus haut, de dessous. Elle se trace en premier, car elle fixe le point de vue de tout le dessin." },

    { type: "titre", contenu: "Un point de fuite" },
    { type: "texte", contenu: "Des lignes parallèles qui s’éloignent de toi, comme les bords d’une route droite, semblent se rejoindre en un point : le point de fuite. Pour des lignes horizontales, ce point est sur la ligne d’horizon. Un seul point de fuite suffit quand on regarde une boîte bien en face." },
    { type: "etapes", elements: [
      "Trace la ligne d’horizon et place un point de fuite dessus.",
      "Dessine la face avant de la boîte : un rectangle ordinaire, aux côtés bien horizontaux et verticaux.",
      "Relie par des traits légers les coins du rectangle au point de fuite : ce sont les fuyantes.",
      "Choisis la profondeur, puis ferme l’arrière de la boîte par une horizontale et une verticale, entre les fuyantes."
    ] },
    {
      type: "schema",
      legende: "Une boîte à un point de fuite : la face avant reste un rectangle, et toutes les arêtes qui s’éloignent visent le même point.",
      alt: "Une ligne d’horizon avec un point de fuite. En dessous à gauche, une boîte dont la face avant est un rectangle ; trois fuyantes en pointillés relient ses coins au point de fuite et délimitent le dessus et le côté droit.",
      largeur: 320,
      hauteur: 190,
      formes: [
        ["line", { x1: 8, y1: 50, x2: 312, y2: 50, classe: "leger" }],
        ["line", { x1: 40, y1: 110, x2: 220, y2: 50, classe: "pointille" }],
        ["line", { x1: 120, y1: 110, x2: 220, y2: 50, classe: "pointille" }],
        ["line", { x1: 120, y1: 170, x2: 220, y2: 50, classe: "pointille" }],
        ["rect", { x: 40, y: 110, width: 80, height: 60, classe: "trait" }],
        ["polyline", { points: "40,110 112,86 160,86 120,110", classe: "trait" }],
        ["polyline", { points: "160,86 160,122 120,170", classe: "trait" }],
        ["circle", { cx: 220, cy: 50, r: 3, classe: "plein" }],
        ["text", { x: 10, y: 42, ancre: "start", classe: "etiquette" }, "ligne d’horizon"],
        ["text", { x: 240, y: 38, ancre: "middle", classe: "etiquette-accent" }, "point de fuite"],
        ["text", { x: 80, y: 144, ancre: "middle", classe: "etiquette" }, "face avant"],
        ["text", { x: 196, y: 100, ancre: "start", classe: "etiquette" }, "fuyantes"]
      ]
    },

    { type: "titre", contenu: "Deux points de fuite" },
    { type: "texte", contenu: "Si la boîte est tournée et te présente une arête plutôt qu’une face, ses côtés partent dans deux directions : il faut deux points de fuite, tous deux sur la ligne d’horizon. Seules les verticales restent verticales. Commence par l’arête la plus proche, tire des fuyantes de ses deux bouts vers chaque point, puis ferme les côtés par deux verticales. Pour le dessus, relie le haut de ces deux verticales au point de fuite opposé : les deux traits se croisent au coin arrière. Si la boîte montre son dessous, pars du bas." },
    {
      type: "schema",
      legende: "Une boîte à deux points de fuite, vue de dessus. Chaque arête qui s’éloigne vise l’un des deux points de fuite ; les verticales restent verticales.",
      alt: "Une ligne d’horizon avec un point de fuite à chaque bout. En dessous, une boîte présentée par une arête verticale : ses côtés convergent l’un vers le point de gauche, l’autre vers le point de droite, et le dessus est fermé par deux fuyantes qui se croisent à l’arrière.",
      largeur: 320,
      hauteur: 160,
      formes: [
        ["line", { x1: 8, y1: 36, x2: 312, y2: 36, classe: "leger" }],
        ["line", { x1: 150, y1: 76, x2: 14, y2: 36, classe: "pointille" }],
        ["line", { x1: 150, y1: 124, x2: 14, y2: 36, classe: "pointille" }],
        ["line", { x1: 150, y1: 76, x2: 306, y2: 36, classe: "pointille" }],
        ["line", { x1: 150, y1: 124, x2: 306, y2: 36, classe: "pointille" }],
        ["line", { x1: 99, y1: 61, x2: 306, y2: 36, classe: "pointille" }],
        ["line", { x1: 189, y1: 66, x2: 14, y2: 36, classe: "pointille" }],
        ["polygon", { points: "150,76 99,61 134.69,56.69 189,66", classe: "trait" }],
        ["line", { x1: 150, y1: 76, x2: 150, y2: 124, classe: "trait" }],
        ["line", { x1: 99, y1: 61, x2: 99, y2: 91, classe: "trait" }],
        ["line", { x1: 189, y1: 66, x2: 189, y2: 102, classe: "trait" }],
        ["line", { x1: 150, y1: 124, x2: 99, y2: 91, classe: "trait" }],
        ["line", { x1: 150, y1: 124, x2: 189, y2: 102, classe: "trait" }],
        ["circle", { cx: 14, cy: 36, r: 3, classe: "plein" }],
        ["circle", { cx: 306, cy: 36, r: 3, classe: "plein" }],
        ["text", { x: 8, y: 26, ancre: "start", classe: "etiquette-accent" }, "point de fuite"],
        ["text", { x: 160, y: 26, ancre: "middle", classe: "etiquette" }, "ligne d’horizon"],
        ["text", { x: 312, y: 26, ancre: "end", classe: "etiquette-accent" }, "point de fuite"],
        ["text", { x: 150, y: 143, ancre: "middle", classe: "etiquette" }, "arête la plus proche"]
      ]
    },
    { type: "texte", contenu: "Il existe aussi une perspective à trois points de fuite, pour les vues prises de très haut ou de très bas. Tu peux l’ignorer pour l’instant : un ou deux points couvrent la plupart des dessins." },

    { type: "titre", contenu: "Dessus, face, dessous" },
    { type: "texte", contenu: "La position d’une boîte par rapport à la ligne d’horizon décide de ce qu’on en voit. Plus elle s’en éloigne, vers le haut ou vers le bas, plus son dessous ou son dessus se découvre." },
    {
      type: "schema",
      legende: "Trois boîtes identiques et un seul point de fuite. Seule leur hauteur par rapport à la ligne d’horizon change ce qu’on en voit.",
      alt: "Trois boîtes empilées à distance, à gauche d’un point de fuite. Celle du haut, au-dessus de la ligne d’horizon, montre son dessous ; celle du milieu, à cheval sur la ligne, ne montre ni dessus ni dessous ; celle du bas montre son dessus.",
      largeur: 320,
      hauteur: 230,
      formes: [
        ["polygon", { points: "120,60 180,60 210,76.5 168,76.5", classe: "surligne" }],
        ["polygon", { points: "120,170 168,153.5 210,153.5 180,170", classe: "surligne" }],
        ["line", { x1: 8, y1: 115, x2: 120, y2: 115, classe: "leger" }],
        ["line", { x1: 210, y1: 115, x2: 312, y2: 115, classe: "leger" }],
        ["line", { x1: 168, y1: 76.5, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 76.5, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 48.5, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 101, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 129, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 168, y1: 153.5, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 153.5, x2: 280, y2: 115, classe: "pointille" }],
        ["line", { x1: 210, y1: 181.5, x2: 280, y2: 115, classe: "pointille" }],
        ["rect", { x: 120, y: 20, width: 60, height: 40, classe: "trait" }],
        ["polygon", { points: "120,60 180,60 210,76.5 168,76.5", classe: "trait" }],
        ["polyline", { points: "180,20 210,48.5 210,76.5", classe: "trait" }],
        ["rect", { x: 120, y: 95, width: 60, height: 40, classe: "trait" }],
        ["polyline", { points: "180,95 210,101 210,129 180,135", classe: "trait" }],
        ["rect", { x: 120, y: 170, width: 60, height: 40, classe: "trait" }],
        ["polygon", { points: "120,170 168,153.5 210,153.5 180,170", classe: "trait" }],
        ["polyline", { points: "210,153.5 210,181.5 180,210", classe: "trait" }],
        ["circle", { cx: 280, cy: 115, r: 3, classe: "plein" }],
        ["text", { x: 10, y: 36, ancre: "start", classe: "etiquette-accent" }, "on voit"],
        ["text", { x: 10, y: 52, ancre: "start", classe: "etiquette-accent" }, "le dessous"],
        ["text", { x: 10, y: 107, ancre: "start", classe: "etiquette" }, "ligne d’horizon"],
        ["text", { x: 10, y: 133, ancre: "start", classe: "etiquette-accent" }, "ni dessus"],
        ["text", { x: 10, y: 149, ancre: "start", classe: "etiquette-accent" }, "ni dessous"],
        ["text", { x: 10, y: 190, ancre: "start", classe: "etiquette-accent" }, "on voit"],
        ["text", { x: 10, y: 206, ancre: "start", classe: "etiquette-accent" }, "le dessus"]
      ]
    },

    { type: "titre", contenu: "Les ellipses suivent la même règle" },
    { type: "texte", contenu: "Un cercle posé à plat, comme le bord d’un verre, se dessine en ellipse. À hauteur d’yeux, on le voit par la tranche : c’est un simple trait. Plus il s’éloigne de la ligne d’horizon, plus l’ellipse s’ouvre. Voilà pourquoi le fond d’un verre posé sur la table est un peu plus rond que son bord." },
    {
      type: "schema",
      legende: "Le même cercle à cinq hauteurs. Sur la ligne d’horizon, c’est un trait ; plus il s’en éloigne, plus l’ellipse s’ouvre.",
      alt: "Un tube vertical transparent traversé par la ligne d’horizon. À cette hauteur, sa section est un simple trait ; au-dessus et en dessous, les sections sont des ellipses de plus en plus ouvertes, signalées par deux flèches.",
      largeur: 320,
      hauteur: 224,
      formes: [
        ["line", { x1: 8, y1: 118, x2: 40, y2: 118, classe: "leger" }],
        ["line", { x1: 150, y1: 118, x2: 312, y2: 118, classe: "leger" }],
        ["line", { x1: 40, y1: 46, x2: 40, y2: 190, classe: "leger" }],
        ["line", { x1: 150, y1: 46, x2: 150, y2: 190, classe: "leger" }],
        ["ellipse", { cx: 95, cy: 46, rx: 55, ry: 14, classe: "trait" }],
        ["ellipse", { cx: 95, cy: 82, rx: 55, ry: 7, classe: "trait" }],
        ["ellipse", { cx: 95, cy: 154, rx: 55, ry: 7, classe: "trait" }],
        ["ellipse", { cx: 95, cy: 190, rx: 55, ry: 14, classe: "trait" }],
        ["line", { x1: 40, y1: 118, x2: 150, y2: 118, classe: "accent" }],
        ["line", { x1: 162, y1: 106, x2: 162, y2: 50, classe: "fleche" }],
        ["line", { x1: 162, y1: 130, x2: 162, y2: 186, classe: "fleche" }],
        ["text", { x: 172, y: 82, ancre: "start", classe: "etiquette" }, "elle s’ouvre"],
        ["text", { x: 312, y: 110, ancre: "end", classe: "etiquette" }, "ligne d’horizon"],
        ["text", { x: 172, y: 136, ancre: "start", classe: "etiquette-accent" }, "ici : un simple trait"],
        ["text", { x: 172, y: 166, ancre: "start", classe: "etiquette" }, "elle s’ouvre"]
      ]
    },
    { type: "piege", contenu: "Placer les deux points de fuite trop près l’un de l’autre : la boîte paraît étirée et pointue. Écarte-les au maximum, quitte à les mettre au bord de la feuille, voire en dehors." },
    { type: "piege", contenu: "Laisser les fuyantes d’un même côté partir chacune dans sa direction. Toutes les lignes parallèles entre elles dans la réalité vont vers le même point de fuite." },
    { type: "astuce", contenu: "À main levée, inutile de tracer chaque fuyante jusqu’au bout. Vise le point de fuite du regard, fais un trait fantôme dans sa direction, puis ne trace que la partie utile." },
    { type: "texte", contenu: "Tu sais désormais construire des volumes et les tourner : c’est le premier pilier. La deuxième partie s’en sert pour construire de vrais objets, dès le chapitre 5." },

    {
      type: "exercice",
      titre: "Des boîtes plein l’espace",
      consigne: "Une page de boîtes en perspective, à main levée. Les fuyantes n’ont pas à être exactes : il suffit qu’elles visent à peu près le même point.",
      etapes: [
        "5 min : trace une ligne d’horizon et un point de fuite, puis trois boîtes vues de face : une au-dessus de la ligne, une à cheval dessus, une en dessous.",
        "10 min : sur une nouvelle ligne d’horizon, place deux points de fuite très écartés et dessine cinq boîtes tournées, à des hauteurs différentes.",
        "5 min : dessine une pile de cinq ellipses de même largeur, de plus en plus ouvertes en s’éloignant de la ligne d’horizon, puis relie-les pour obtenir un cylindre."
      ],
      materiel: "Crayon, papier ; une règle si tu préfères",
      duree: 20
    },
    { type: "retenir", elements: [
      "La ligne d’horizon est à la hauteur des yeux : elle se trace en premier.",
      "Les parallèles qui s’éloignent se rejoignent en un point de fuite.",
      "Plus une forme est loin de la ligne d’horizon, plus on voit son dessus ou son dessous."
    ] }
  ]
});
