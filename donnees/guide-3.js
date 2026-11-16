/* Dessin du jour — guide « Dessiner d’imagination, de A à Z », partie 3 : Inventer.
   Script classique : ajoute les chapitres g09 à g12 à window.DDJ.guide.chapitres.
   Les schémas ne portent aucune couleur : tout passe par les classes (trait, leger,
   pointille, accent, fleche, plein, ombre, ombre-forte, surligne, etiquette,
   etiquette-accent), pour suivre les thèmes clair et sombre. Repère : 0,0 en haut à gauche. */
window.DDJ = window.DDJ || {};
DDJ.guide = DDJ.guide || {};
DDJ.guide.chapitres = DDJ.guide.chapitres || [];

/* ───────────── Chapitre 9 : Inventer la lumière ───────────── */
DDJ.guide.chapitres.push({
  id: "g09",
  numero: 9,
  partie: 3,
  titre: "Inventer la lumière",
  resume: "Une seule source de lumière et trois valeurs de gris suffisent à donner du poids à tes volumes.",
  blocs: [
    { type: "texte", contenu: "Tu sais maintenant construire des volumes, les tourner dans l’espace et puiser dans ta bibliothèque visuelle. Cette troisième partie t’apprend à inventer, et on commence par la lumière : c’est elle qui donne du poids à tout ce que tu construis." },

    { type: "titre", contenu: "Pourquoi la lumière fait le volume" },
    { type: "texte", contenu: "Un contour dit où une forme s’arrête, pas comment elle tourne. Ce qui fait sentir le volume, c’est la différence entre les faces claires et les faces sombres. Devant un modèle, il suffit de regarder. D’imagination, personne ne te montre les ombres : c’est à toi de les décider. Bonne nouvelle, elles découlent toutes d’une seule décision." },

    { type: "titre", contenu: "Une seule source, choisie d’abord" },
    { type: "texte", contenu: "Avant de griser quoi que ce soit, décide d’où vient la lumière et dessine une petite flèche dans un coin de la feuille. Pour commencer, fais-la venir d’en haut, à gauche ou à droite : c’est l’éclairage le plus familier, celui du soleil ou d’une lampe au plafond. Ensuite, pose la même question à chaque surface : regarde-t-elle la flèche, ou lui tourne-t-elle le dos ?" },

    { type: "titre", contenu: "Deux ombres à ne pas confondre" },
    { type: "texte", contenu: "L’ombre propre est sur l’objet lui-même : c’est la partie qui tourne le dos à la lumière. L’ombre portée est celle que l’objet projette sur le sol ou sur ce qui l’entoure. Elle part du pied de l’objet et s’étire du côté opposé à la lumière. Plus la source est basse, plus l’ombre s’allonge." },
    {
      type: "schema",
      legende: "Une sphère éclairée d’en haut à gauche : l’ombre propre forme un croissant du côté opposé à la flèche, l’ombre portée s’étire sur le sol dans la même direction.",
      alt: "Une flèche de lumière arrive d’en haut à gauche sur une sphère. Le côté gauche reste clair, un croissant gris couvre le bas à droite, et une ombre ovale s’allonge sur le sol vers la droite.",
      largeur: 320,
      hauteur: 196,
      formes: [
        ["path", { d: "M 186.8 76.4 A 46 23 -36.87 0 1 113.2 131.6 A 46 6.9 -36.87 0 0 186.8 76.4 Z", classe: "ombre" }],
        ["path", { d: "M 186.8 76.4 A 46 46 0 0 1 113.2 131.6 A 46 23 -36.87 0 0 186.8 76.4 Z", classe: "ombre-forte" }],
        ["ellipse", { cx: 184.5, cy: 157, rx: 57.5, ry: 8, classe: "ombre-forte" }],
        ["circle", { cx: 150, cy: 104, r: 46, classe: "trait" }],
        ["line", { x1: 84, y1: 16, x2: 114, y2: 56, classe: "fleche" }],
        ["line", { x1: 222, y1: 97, x2: 198, y2: 110, classe: "leger" }],
        ["text", { x: 76, y: 26, ancre: "end", classe: "etiquette-accent" }, "lumière"],
        ["text", { x: 96, y: 122, ancre: "end", classe: "etiquette" }, "côté éclairé"],
        ["text", { x: 226, y: 100, ancre: "start", classe: "etiquette" }, "ombre propre"],
        ["text", { x: 184, y: 184, ancre: "middle", classe: "etiquette" }, "ombre portée"]
      ]
    },

    { type: "titre", contenu: "Trois valeurs suffisent" },
    { type: "texte", contenu: "Une valeur, c’est le degré de clair ou de foncé d’un gris. La réalité en compte une infinité, avec des dégradés et des reflets. Pour dessiner d’imagination, trois suffisent : c’est une simplification, mais elle donne déjà un volume convaincant." },
    { type: "liste", elements: [
      "Clair : ce qui regarde la lumière. Tu laisses le blanc du papier.",
      "Moyen : ce que la lumière ne fait qu’effleurer. Un gris léger.",
      "Foncé : ce qui tourne le dos à la lumière, et les ombres portées. Un gris soutenu."
    ] },

    { type: "titre", contenu: "Sur la boîte, le cylindre et la sphère" },
    { type: "texte", contenu: "La boîte est le cas le plus simple : une valeur par face. Le dessus regarde la lumière, il reste clair. Des deux côtés visibles, celui qui est tourné vers la flèche reçoit le gris moyen, l’autre le gris foncé. La limite de l’ombre tombe pile sur une arête." },
    {
      type: "schema",
      legende: "Une boîte en trois valeurs : une seule par face. L’ombre portée part du pied de la boîte, à l’opposé de la flèche.",
      alt: "Une boîte éclairée d’en haut à gauche. Le dessus est blanc, le côté gauche gris léger, le côté droit gris soutenu, et une ombre portée s’étale sur le sol à droite.",
      largeur: 320,
      hauteur: 160,
      formes: [
        ["polygon", { points: "150,70 90,50 90,110 150,130", classe: "ombre" }],
        ["polygon", { points: "150,70 200,45 200,105 150,130", classe: "ombre-forte" }],
        ["polygon", { points: "150,130 220,120 270,95 210,75 200,76.4 200,105", classe: "ombre-forte" }],
        ["polygon", { points: "150,70 90,50 140,25 200,45", classe: "trait" }],
        ["polyline", { points: "90,50 90,110 150,130 200,105 200,45", classe: "trait" }],
        ["line", { x1: 150, y1: 70, x2: 150, y2: 130, classe: "trait" }],
        ["line", { x1: 30, y1: 12, x2: 65, y2: 37, classe: "fleche" }],
        ["line", { x1: 228, y1: 55, x2: 204, y2: 66, classe: "leger" }],
        ["text", { x: 72, y: 22, ancre: "start", classe: "etiquette-accent" }, "lumière"],
        ["text", { x: 145, y: 52, ancre: "middle", classe: "etiquette" }, "clair"],
        ["text", { x: 120, y: 94, ancre: "middle", classe: "etiquette" }, "moyen"],
        ["text", { x: 232, y: 58, ancre: "start", classe: "etiquette" }, "foncé"],
        ["text", { x: 236, y: 142, ancre: "middle", classe: "etiquette" }, "ombre portée"]
      ]
    },
    { type: "texte", contenu: "Sur une surface courbe, il n’y a pas d’arête : l’ombre arrive progressivement. Sur le cylindre, les trois valeurs deviennent trois bandes parallèles à ses bords. Sur la sphère, des croissants, comme les phases de la lune. Dans tous les cas, la limite de l’ombre épouse la forme du volume, comme les lignes de contour du chapitre 3." },
    {
      type: "schema",
      legende: "Sur le cylindre, les valeurs se rangent en bandes droites, du clair vers le foncé en s’éloignant de la lumière. Le dessus, tourné vers le haut, reste clair.",
      alt: "Un cylindre debout éclairé d’en haut à gauche. Sa gauche est blanche, puis viennent une bande gris léger et une bande gris soutenu le long du bord droit. Son ombre portée s’allonge sur le sol à droite.",
      largeur: 320,
      hauteur: 186,
      formes: [
        ["path", { d: "M 138 61.8 L 138 151.8 A 40 11 0 0 0 156 149.4 L 156 59.4 A 40 11 0 0 1 138 61.8 Z", classe: "ombre" }],
        ["path", { d: "M 156 59.4 L 156 149.4 A 40 11 0 0 0 170 141 L 170 51 A 40 11 0 0 1 156 59.4 Z", classe: "ombre-forte" }],
        ["path", { d: "M 170 130 L 200 130 A 40 11 0 0 1 200 152 L 130 152 A 40 11 0 0 0 170 141 Z", classe: "ombre-forte" }],
        ["ellipse", { cx: 130, cy: 51, rx: 40, ry: 11, classe: "trait" }],
        ["line", { x1: 90, y1: 51, x2: 90, y2: 141, classe: "trait" }],
        ["line", { x1: 170, y1: 51, x2: 170, y2: 141, classe: "trait" }],
        ["path", { d: "M 90 141 A 40 11 0 0 0 170 141", classe: "trait" }],
        ["line", { x1: 40, y1: 14, x2: 68, y2: 50, classe: "fleche" }],
        ["line", { x1: 192, y1: 69, x2: 147, y2: 80, classe: "leger" }],
        ["line", { x1: 192, y1: 97, x2: 174, y2: 101, classe: "leger" }],
        ["text", { x: 76, y: 24, ancre: "start", classe: "etiquette-accent" }, "lumière"],
        ["text", { x: 82, y: 100, ancre: "end", classe: "etiquette" }, "clair"],
        ["text", { x: 196, y: 72, ancre: "start", classe: "etiquette" }, "moyen"],
        ["text", { x: 196, y: 100, ancre: "start", classe: "etiquette" }, "foncé"],
        ["text", { x: 186, y: 174, ancre: "middle", classe: "etiquette" }, "ombre portée"]
      ]
    },
    { type: "piege", contenu: "Griser tout le tour d’une forme, comme un halo, parce qu’on ombre en suivant le contour. Le volume s’aplatit. L’ombre ne va que d’un côté, celui qui est à l’opposé de ta flèche : l’autre bord reste clair." },

    { type: "titre", contenu: "Changer la lumière change tout" },
    { type: "texte", contenu: "Une fois la règle comprise, tu peux déplacer la source à volonté. Les faces sombres changent alors de côté et les ombres portées partent dans l’autre sens. Si tu sais éclairer une boîte de deux côtés différents, tu as compris l’essentiel." },
    {
      type: "schema",
      legende: "La même boîte, deux lumières : le côté foncé et l’ombre portée passent de l’autre côté. Rien d’autre ne change dans le dessin.",
      alt: "Deux boîtes identiques. Celle de gauche est éclairée par la gauche : son côté droit est foncé et son ombre part à droite. Celle de droite est éclairée par la droite : son côté gauche est foncé et son ombre part à gauche.",
      largeur: 320,
      hauteur: 146,
      formes: [
        ["polygon", { points: "70,70 34,58 34,94 70,106", classe: "ombre" }],
        ["polygon", { points: "70,70 100,55 100,91 70,106", classe: "ombre-forte" }],
        ["polygon", { points: "70,106 112,100 142,85 106,73 100,73.9 100,91", classe: "ombre-forte" }],
        ["polygon", { points: "70,70 34,58 64,43 100,55", classe: "trait" }],
        ["polyline", { points: "34,58 34,94 70,106 100,91 100,55", classe: "trait" }],
        ["line", { x1: 70, y1: 70, x2: 70, y2: 106, classe: "trait" }],
        ["line", { x1: 12, y1: 14, x2: 40, y2: 34, classe: "fleche" }],
        ["polygon", { points: "250,70 214,58 214,94 250,106", classe: "ombre-forte" }],
        ["polygon", { points: "250,70 280,55 280,91 250,106", classe: "ombre" }],
        ["polygon", { points: "250,106 208,104.5 172,92.5 202,77.5 214,77.9 214,94", classe: "ombre-forte" }],
        ["polygon", { points: "250,70 214,58 244,43 280,55", classe: "trait" }],
        ["polyline", { points: "214,58 214,94 250,106 280,91 280,55", classe: "trait" }],
        ["line", { x1: 250, y1: 70, x2: 250, y2: 106, classe: "trait" }],
        ["line", { x1: 308, y1: 14, x2: 280, y2: 37, classe: "fleche" }],
        ["text", { x: 88, y: 132, ancre: "middle", classe: "etiquette" }, "lumière à gauche"],
        ["text", { x: 232, y: 132, ancre: "middle", classe: "etiquette" }, "lumière à droite"]
      ]
    },
    { type: "piege", contenu: "Changer de lumière en cours de route : un objet éclairé par la gauche, son voisin par la droite. L’image devient confuse sans qu’on sache pourquoi. Vérifie chaque objet avec ta flèche." },
    { type: "astuce", contenu: "Grise par hachures : des traits parallèles serrés, tous dans le même sens, sans appuyer. Pour le foncé, repasse une seconde couche plutôt que d’écraser la mine. Et fais toucher l’ombre portée à l’objet : sans ce contact, il semble flotter." },
    { type: "texte", contenu: "Tes volumes ont maintenant du poids. Reste à savoir quoi en faire : le chapitre suivant t’aide à fabriquer des idées." },
    {
      type: "exercice",
      titre: "Trois volumes, une lumière",
      consigne: "Dessine une sphère, une boîte et un cylindre posés sur une table, puis éclaire-les tous les trois avec la même source, en trois valeurs.",
      etapes: [
        "5 min : dessine légèrement les trois volumes côte à côte, puis une flèche de lumière dans un coin de la feuille, en haut à gauche.",
        "5 min : place les ombres propres. Laisse en blanc ce qui regarde la flèche, grise en moyen ce qu’elle effleure et en foncé ce qui lui tourne le dos.",
        "5 min : ajoute les trois ombres portées, du côté opposé à la flèche. S’il te reste du temps, redessine la boîte éclairée depuis la droite."
      ],
      materiel: "Crayon et papier",
      duree: 15
    },
    { type: "retenir", elements: [
      "Une seule source de lumière, décidée avant de griser et notée par une flèche.",
      "L’ombre propre est sur l’objet, l’ombre portée sur le sol : toutes deux du côté opposé à la lumière.",
      "Trois valeurs suffisent : clair, moyen, foncé."
    ] }
  ]
});

/* ───────────── Chapitre 10 : Trouver des idées ───────────── */
DDJ.guide.chapitres.push({
  id: "g10",
  numero: 10,
  partie: 3,
  titre: "Trouver des idées : combiner, exagérer, détourner",
  resume: "Une idée ne s’attend pas, elle se fabrique : quatre leviers et une recherche en tout petit suffisent.",
  blocs: [
    { type: "texte", contenu: "Tu sais construire des volumes et les éclairer. Reste la question qui intimide le plus devant la feuille blanche : que dessiner ? Ce chapitre te donne des outils pour fabriquer des idées, au lieu de les attendre." },

    { type: "titre", contenu: "Pourquoi l’imagination a besoin de matière" },
    { type: "texte", contenu: "Personne n’invente à partir de rien. Imaginer, c’est assembler autrement des choses déjà vues : un dragon, c’est un lézard, des ailes de chauve-souris et un peu de feu. Voilà pourquoi tu as rempli ta bibliothèque visuelle dans la deuxième partie : elle fournit les pièces. Il te faut maintenant des façons de les assembler. En voici quatre, à utiliser seules ou ensemble." },

    { type: "titre", contenu: "Quatre leviers pour fabriquer une idée" },
    { type: "liste", elements: [
      "Combiner : mélange deux choses qui n’ont rien à voir. Un escargot et une caravane, un chat et un poisson, une théière et un éléphant.",
      "Changer d’échelle : rends immense ce qui est petit, ou l’inverse. Un champignon grand comme une maison, une ville dans un bocal.",
      "Exagérer : repère le trait le plus marquant de ton sujet et pousse-le bien plus loin. Un cou encore plus long, un chapeau encore plus large.",
      "Détourner : donne à un objet un usage qui n’est pas le sien. Un parapluie devient un bateau, une baignoire devient un jardin."
    ] },
    { type: "texte", contenu: "Commence par combiner, c’est le levier le plus simple. Choisis deux sujets, cherche ce qui fait reconnaître chacun (les oreilles et les moustaches du chat, le corps et la queue du poisson), puis greffe les signes de l’un sur la forme de l’autre." },
    {
      type: "schema",
      legende: "Combiner : le corps du poisson reste entier, on lui greffe seulement les deux signes qui font reconnaître le chat, les oreilles et les moustaches.",
      alt: "À gauche, une tête de chat. Au milieu, un poisson. À droite, le résultat de leur mélange : un poisson avec deux oreilles pointues et des moustaches de chat.",
      largeur: 320,
      hauteur: 140,
      formes: [
        ["circle", { cx: 46, cy: 78, r: 22, classe: "trait" }],
        ["polyline", { points: "26.9,67 22.9,50.4 38.5,57.3", classe: "trait" }],
        ["polyline", { points: "65.1,67 69.1,50.4 53.5,57.3", classe: "trait" }],
        ["circle", { cx: 38, cy: 74, r: 2.2, classe: "plein" }],
        ["circle", { cx: 54, cy: 74, r: 2.2, classe: "plein" }],
        ["polygon", { points: "43.5,81 48.5,81 46,84.5", classe: "plein" }],
        ["line", { x1: 37, y1: 85, x2: 14, y2: 81, classe: "trait" }],
        ["line", { x1: 37, y1: 88, x2: 14, y2: 91, classe: "trait" }],
        ["line", { x1: 55, y1: 85, x2: 78, y2: 81, classe: "trait" }],
        ["line", { x1: 55, y1: 88, x2: 78, y2: 91, classe: "trait" }],
        ["text", { x: 94, y: 83, ancre: "middle", classe: "etiquette" }, "+"],
        ["ellipse", { cx: 136, cy: 78, rx: 28, ry: 15, classe: "trait" }],
        ["polygon", { points: "164,78 182,66 182,90", classe: "trait" }],
        ["circle", { cx: 120, cy: 74, r: 2.2, classe: "plein" }],
        ["path", { d: "M 131 67 Q 137 78 131 89", classe: "trait" }],
        ["text", { x: 201, y: 83, ancre: "middle", classe: "etiquette" }, "="],
        ["ellipse", { cx: 258, cy: 78, rx: 28, ry: 15, classe: "trait" }],
        ["polygon", { points: "286,78 304,66 304,90", classe: "trait" }],
        ["circle", { cx: 242, cy: 74, r: 2.2, classe: "plein" }],
        ["path", { d: "M 253 67 Q 259 78 253 89", classe: "trait" }],
        ["polyline", { points: "233.8,70.5 233,55 241.9,65.7", classe: "accent" }],
        ["polyline", { points: "246.2,64.4 250,50 258,63", classe: "accent" }],
        ["line", { x1: 236, y1: 80, x2: 216, y2: 75, classe: "accent" }],
        ["line", { x1: 236, y1: 82, x2: 215, y2: 83, classe: "accent" }],
        ["line", { x1: 236, y1: 84, x2: 216, y2: 91, classe: "accent" }],
        ["text", { x: 46, y: 126, ancre: "middle", classe: "etiquette" }, "chat"],
        ["text", { x: 140, y: 126, ancre: "middle", classe: "etiquette" }, "poisson"],
        ["text", { x: 262, y: 126, ancre: "middle", classe: "etiquette-accent" }, "poisson-chat"]
      ]
    },
    { type: "texte", contenu: "Le changement d’échelle, lui, demande un témoin : quelque chose dont tout le monde connaît la taille, comme une personne, une porte ou un arbre. Sans ce témoin, impossible de savoir si ton champignon est minuscule ou géant." },
    {
      type: "schema",
      legende: "Le même champignon à trois échelles. C’est le personnage qui donne la taille : sans lui, on ne saurait pas si le champignon est minuscule ou géant.",
      alt: "Trois scènes sur un même sol. À gauche, un champignon minuscule aux pieds d’un personnage. Au milieu, un champignon aussi haut que lui. À droite, un champignon géant avec une porte, et un personnage tout petit à son pied.",
      largeur: 320,
      hauteur: 152,
      formes: [
        ["path", { d: "M 65 112 A 7 6 0 0 1 79 112 Z", classe: "surligne" }],
        ["path", { d: "M 150 72 A 26 24 0 0 1 202 72 Z", classe: "surligne" }],
        ["path", { d: "M 222 74 A 45 44 0 0 1 312 74 Z", classe: "surligne" }],
        ["line", { x1: 10, y1: 118, x2: 312, y2: 118, classe: "leger" }],
        ["circle", { cx: 40, cy: 54, r: 6, classe: "trait" }],
        ["line", { x1: 40, y1: 60, x2: 40, y2: 92, classe: "trait" }],
        ["polyline", { points: "30,84 40,70 50,84", classe: "trait" }],
        ["polyline", { points: "33,118 40,92 47,118", classe: "trait" }],
        ["path", { d: "M 65 112 A 7 6 0 0 1 79 112 Z", classe: "trait" }],
        ["rect", { x: 70.5, y: 112, width: 3, height: 6, classe: "trait" }],
        ["circle", { cx: 128, cy: 54, r: 6, classe: "trait" }],
        ["line", { x1: 128, y1: 60, x2: 128, y2: 92, classe: "trait" }],
        ["polyline", { points: "118,84 128,70 138,84", classe: "trait" }],
        ["polyline", { points: "121,118 128,92 135,118", classe: "trait" }],
        ["path", { d: "M 150 72 A 26 24 0 0 1 202 72 Z", classe: "trait" }],
        ["rect", { x: 173, y: 72, width: 6, height: 46, classe: "trait" }],
        ["path", { d: "M 222 74 A 45 44 0 0 1 312 74 Z", classe: "trait" }],
        ["rect", { x: 253, y: 74, width: 28, height: 44, classe: "trait" }],
        ["rect", { x: 263, y: 102, width: 8, height: 16, classe: "trait" }],
        ["circle", { cx: 238, cy: 106, r: 2, classe: "trait" }],
        ["line", { x1: 238, y1: 108, x2: 238, y2: 113, classe: "trait" }],
        ["polyline", { points: "236,118 238,113 240,118", classe: "trait" }],
        ["text", { x: 56, y: 140, ancre: "middle", classe: "etiquette" }, "minuscule"],
        ["text", { x: 160, y: 140, ancre: "middle", classe: "etiquette" }, "à ta taille"],
        ["text", { x: 267, y: 140, ancre: "middle", classe: "etiquette" }, "géant"]
      ]
    },
    { type: "piege", contenu: "Vouloir tout mélanger d’un coup : cinq animaux, trois objets, deux époques. Le résultat devient illisible. Deux ingrédients suffisent, et l’un des deux doit dominer : on reconnaît d’abord un poisson, ensuite seulement les oreilles de chat." },

    { type: "titre", contenu: "Chercher petit avant de choisir" },
    { type: "texte", contenu: "La première idée qui vient est souvent celle qui viendrait à tout le monde. Les suivantes sont plus personnelles, à condition de leur laisser une chance. Pour cela, on cherche en tout petit, de deux façons." },
    { type: "texte", contenu: "La silhouette, d’abord : la forme pleine du sujet, sans aucun détail intérieur, comme une ombre chinoise. Si on reconnaît ton sujet en silhouette, il restera lisible une fois fini. La vignette, ensuite : un croquis de la taille d’une boîte d’allumettes, fait en une ou deux minutes. À cette taille, les détails sont impossibles et il ne reste que l’essentiel. Et comme une vignette ne coûte presque rien, tu oses des essais que tu n’aurais jamais tentés en grand." },
    { type: "etapes", elements: [
      "Dessine six silhouettes du même sujet, une à deux minutes chacune.",
      "Change franchement quelque chose à chaque fois : les proportions, la forme générale, la posture.",
      "Prends du recul et garde celle qui se lit le mieux, pas la mieux dessinée.",
      "Redessine-la en grand, en la construisant avec des volumes simples."
    ] },
    {
      type: "schema",
      legende: "Six silhouettes pour un même sujet, un petit robot. Aucune n’est soignée, toutes sont différentes : on choisit ensuite celle qui se lit le mieux.",
      alt: "Une rangée de six petites silhouettes noires de robots, aux proportions très différentes : carrée, ronde, longue et fine, en pointe sur une roue, large sur deux roues, en cône. La quatrième est entourée.",
      largeur: 320,
      hauteur: 146,
      formes: [
        ["rect", { x: 25, y: 36, width: 20, height: 16, classe: "plein" }],
        ["rect", { x: 22, y: 56, width: 26, height: 32, classe: "plein" }],
        ["rect", { x: 25, y: 88, width: 7, height: 22, classe: "plein" }],
        ["rect", { x: 38, y: 88, width: 7, height: 22, classe: "plein" }],
        ["rect", { x: 33.5, y: 28, width: 3, height: 8, classe: "plein" }],
        ["circle", { cx: 35, cy: 26, r: 3.5, classe: "plein" }],
        ["circle", { cx: 85, cy: 78, r: 22, classe: "plein" }],
        ["circle", { cx: 85, cy: 47, r: 10, classe: "plein" }],
        ["rect", { x: 73, y: 97, width: 9, height: 13, classe: "plein" }],
        ["rect", { x: 88, y: 97, width: 9, height: 13, classe: "plein" }],
        ["circle", { cx: 135, cy: 37, r: 7, classe: "plein" }],
        ["rect", { x: 130, y: 46, width: 10, height: 40, classe: "plein" }],
        ["rect", { x: 119, y: 50, width: 32, height: 3, classe: "plein" }],
        ["rect", { x: 130, y: 86, width: 3, height: 24, classe: "plein" }],
        ["rect", { x: 137, y: 86, width: 3, height: 24, classe: "plein" }],
        ["polygon", { points: "165,52 205,52 185,92", classe: "plein" }],
        ["rect", { x: 177, y: 34, width: 16, height: 15, classe: "plein" }],
        ["circle", { cx: 185, cy: 100, r: 10, classe: "plein" }],
        ["rect", { x: 213, y: 74, width: 44, height: 24, rx: 6, ry: 6, classe: "plein" }],
        ["path", { d: "M 223 75 A 12 12 0 0 1 247 75 Z", classe: "plein" }],
        ["circle", { cx: 222, cy: 103, r: 7, classe: "plein" }],
        ["circle", { cx: 248, cy: 103, r: 7, classe: "plein" }],
        ["rect", { x: 234, y: 50, width: 2, height: 14, classe: "plein" }],
        ["circle", { cx: 235, cy: 48, r: 3, classe: "plein" }],
        ["polygon", { points: "285,42 266,96 304,96", classe: "plein" }],
        ["circle", { cx: 285, cy: 38, r: 9, classe: "plein" }],
        ["rect", { x: 270, y: 96, width: 10, height: 14, classe: "plein" }],
        ["rect", { x: 290, y: 96, width: 10, height: 14, classe: "plein" }],
        ["rect", { x: 161, y: 24, width: 48, height: 92, rx: 6, ry: 6, classe: "accent" }],
        ["text", { x: 185, y: 134, ancre: "middle", classe: "etiquette-accent" }, "celle qu’on garde"]
      ]
    },
    { type: "piege", contenu: "S’arrêter à la première idée, ou soigner chaque vignette comme un vrai dessin. Dans les deux cas, la recherche s’arrête. Fixe un nombre, six, et un temps, deux minutes au plus chacune, puis respecte-les." },
    { type: "astuce", contenu: "En panne de sujet ? La section « Idées » de l’appli en tire un au hasard. Prends-le comme point de départ, puis applique-lui un des quatre leviers." },
    { type: "texte", contenu: "Tu as maintenant un sujet et une silhouette qui se lit. Le chapitre suivant t’apprend à l’installer dans une image : c’est la composition." },
    {
      type: "exercice",
      titre: "Six silhouettes pour une créature",
      consigne: "Invente une créature en combinant deux animaux, ou un animal et un objet. Cherche-la en six silhouettes, puis construis la meilleure.",
      etapes: [
        "5 min : choisis tes deux ingrédients, ou tire un sujet dans la section « Idées », et note pour chacun deux ou trois signes qui le font reconnaître.",
        "10 min : dessine six petites silhouettes pleines de ta créature, en changeant franchement les proportions de l’une à l’autre.",
        "5 min : garde la plus lisible et redessine-la plus grande, en la construisant avec des volumes simples."
      ],
      materiel: "Crayon et papier",
      duree: 20
    },
    { type: "retenir", elements: [
      "Imaginer, c’est assembler autrement ce que tu as déjà observé.",
      "Quatre leviers : combiner, changer d’échelle, exagérer, détourner.",
      "Cherche en petit et en nombre, par silhouettes et par vignettes, avant de choisir."
    ] }
  ]
});

/* ───────────── Chapitre 11 : Composer une image ───────────── */
DDJ.guide.chapitres.push({
  id: "g11",
  numero: 11,
  partie: 3,
  titre: "Composer une image",
  resume: "Un cadre, un seul point d’intérêt et trois plans : de quoi guider l’œil et creuser l’espace.",
  blocs: [
    { type: "texte", contenu: "Tu as une idée et une silhouette qui se lit. Il reste à décider où tout cela va se placer dans la feuille. C’est la composition : l’art d’organiser l’image pour que l’œil sache où aller." },

    { type: "titre", contenu: "Pourquoi composer" },
    { type: "texte", contenu: "Quand on regarde une image, l’œil cherche d’abord un endroit où se poser, puis il se promène. Si tout a la même importance, il ne sait pas où aller et se lasse vite. Composer, c’est choisir ce qu’on regarde en premier et ranger le reste autour. Un sujet simple bien placé fait plus d’effet qu’un sujet spectaculaire posé au hasard." },

    { type: "titre", contenu: "Le cadre d’abord" },
    { type: "texte", contenu: "Commence toujours par tracer le cadre, c’est-à-dire le rectangle qui délimite ton image. Sans lui, le dessin flotte dans la page et tu ne peux rien placer par rapport aux bords. Choisis aussi son sens : en largeur pour un paysage ou une scène calme, en hauteur pour un personnage debout ou un sujet élancé." },

    { type: "titre", contenu: "Un seul point d’intérêt" },
    { type: "texte", contenu: "Décide ensuite quelle est la vedette de ton image : c’est le point d’intérêt. Il n’y en a qu’un. Tout le reste l’accompagne, avec moins de détails et moins de contraste." },
    { type: "texte", contenu: "Pour le placer, un repère commode : la règle des tiers. Coupe ton cadre en trois dans chaque sens. Les quatre croisements sont de bons emplacements, souvent plus vivants que le centre exact. De même, une ligne d’horizon posée sur un tiers équilibre mieux l’image qu’une ligne qui la coupe en deux moitiés égales. Ce n’est pas une loi : un sujet centré donne un effet calme et solennel, parfois voulu. C’est simplement un bon point de départ." },
    {
      type: "schema",
      legende: "La règle des tiers : le cadre est coupé en trois dans chaque sens. Ici l’horizon suit le tiers du bas, et le bateau est posé sur un des quatre croisements.",
      alt: "Un cadre en largeur, divisé en trois colonnes et trois rangées par des pointillés. L’horizon suit la ligne du bas. Un petit voilier, mis en évidence, se trouve sur le croisement en bas à droite ; les trois autres croisements sont marqués d’un petit rond.",
      largeur: 320,
      hauteur: 170,
      formes: [
        ["circle", { cx: 200, cy: 92, r: 16, classe: "surligne" }],
        ["line", { x1: 120, y1: 12, x2: 120, y2: 132, classe: "pointille" }],
        ["line", { x1: 200, y1: 12, x2: 200, y2: 132, classe: "pointille" }],
        ["line", { x1: 40, y1: 52, x2: 280, y2: 52, classe: "pointille" }],
        ["line", { x1: 40, y1: 92, x2: 280, y2: 92, classe: "trait" }],
        ["polygon", { points: "187,92 213,92 208,99 192,99", classe: "plein" }],
        ["line", { x1: 200, y1: 92, x2: 200, y2: 70, classe: "trait" }],
        ["polygon", { points: "200,72 200,88 213,88", classe: "trait" }],
        ["circle", { cx: 120, cy: 52, r: 3, classe: "accent" }],
        ["circle", { cx: 200, cy: 52, r: 3, classe: "accent" }],
        ["circle", { cx: 120, cy: 92, r: 3, classe: "accent" }],
        ["rect", { x: 40, y: 12, width: 240, height: 120, classe: "trait" }],
        ["line", { x1: 200, y1: 147, x2: 200, y2: 113, classe: "fleche" }],
        ["text", { x: 200, y: 161, ancre: "middle", classe: "etiquette-accent" }, "point d’intérêt"]
      ]
    },
    { type: "piege", contenu: "Placer le sujet pile au centre, tout petit, avec le même vide tout autour, par simple habitude. L’image paraît figée. Décale-le vers un tiers, ou agrandis-le jusqu’à ce qu’il occupe vraiment le cadre." },

    { type: "titre", contenu: "Trois plans pour la profondeur" },
    { type: "texte", contenu: "Une image paraît profonde quand elle est rangée en trois couches, qu’on appelle des plans. Le premier plan est tout près de toi : ses éléments sont grands, souvent en bas de l’image et coupés par le cadre. Le plan moyen porte en général le sujet. L’arrière-plan est loin : tout y est plus petit, plus simple et plus pâle." },
    {
      type: "schema",
      legende: "Trois plans : une masse sombre et coupée par le cadre tout devant, l’arbre sur sa colline au milieu, des montagnes pâles et sans détail au fond.",
      alt: "Un paysage dans un cadre. En bas à gauche, une grande forme noire coupée par le bord : le premier plan. Au milieu, un arbre sur une colline : le plan moyen. En haut, une ligne pâle de montagnes : l’arrière-plan.",
      largeur: 320,
      hauteur: 154,
      formes: [
        ["path", { d: "M 14 142 L 14 108 Q 50 98 72 120 Q 84 134 96 142 Z", classe: "plein" }],
        ["circle", { cx: 140, cy: 64, r: 11, classe: "ombre" }],
        ["polyline", { points: "14,60 50,36 82,54 120,28 165,56 204,44", classe: "leger" }],
        ["path", { d: "M 14 98 Q 110 74 204 94", classe: "trait" }],
        ["circle", { cx: 140, cy: 64, r: 11, classe: "trait" }],
        ["rect", { x: 138.5, y: 74, width: 3, height: 12, classe: "plein" }],
        ["rect", { x: 14, y: 12, width: 190, height: 130, classe: "trait" }],
        ["text", { x: 212, y: 46, ancre: "start", classe: "etiquette" }, "arrière-plan"],
        ["text", { x: 212, y: 84, ancre: "start", classe: "etiquette" }, "plan moyen"],
        ["text", { x: 212, y: 130, ancre: "start", classe: "etiquette" }, "premier plan"]
      ]
    },

    { type: "titre", contenu: "Chevauchement et taille" },
    { type: "texte", contenu: "Deux indices suffisent à dire qui est devant. Le chevauchement, d’abord : une forme qui en cache en partie une autre passe forcément devant elle. C’est l’indice de profondeur le plus simple, et l’un des plus sûrs. La taille, ensuite : de deux objets semblables, le plus petit paraît le plus loin. Combine les deux et l’espace se creuse tout seul." },
    {
      type: "schema",
      legende: "À gauche, trois ronds de même taille posés côte à côte : l’image reste plate. À droite, ils se chevauchent et rapetissent : on lit tout de suite lequel est devant.",
      alt: "À gauche, trois cercles identiques alignés sans se toucher. À droite, trois cercles de plus en plus petits : le plus grand cache une partie du deuxième, qui cache une partie du troisième.",
      largeur: 320,
      hauteur: 158,
      formes: [
        ["circle", { cx: 206, cy: 98, r: 26, classe: "surligne" }],
        ["circle", { cx: 40, cy: 90, r: 18, classe: "trait" }],
        ["circle", { cx: 84, cy: 90, r: 18, classe: "trait" }],
        ["circle", { cx: 128, cy: 90, r: 18, classe: "trait" }],
        ["line", { x1: 163, y1: 36, x2: 163, y2: 124, classe: "leger" }],
        ["circle", { cx: 206, cy: 98, r: 26, classe: "trait" }],
        ["path", { d: "M 218 74.9 A 20 20 0 1 1 231.8 95", classe: "trait" }],
        ["path", { d: "M 248.3 58.9 A 14 14 0 1 1 256.7 69", classe: "trait" }],
        ["text", { x: 84, y: 146, ancre: "middle", classe: "etiquette" }, "côte à côte"],
        ["text", { x: 228, y: 146, ancre: "middle", classe: "etiquette" }, "l’un devant l’autre"]
      ]
    },
    { type: "piege", contenu: "Laisser deux formes se toucher juste par le bord, ou effleurer le cadre : on appelle cela une tangence. L’œil bute dessus et ne sait plus laquelle est devant. Fais-les se chevaucher franchement, ou écarte-les nettement." },

    { type: "titre", contenu: "Essayer en vignettes" },
    { type: "texte", contenu: "Tu connais déjà les vignettes. Elles servent aussi à composer : trace trois petits cadres et place le même sujet de trois façons. Vu de loin ou de tout près, horizon bas ou haut, sujet à gauche ou à droite. Deux minutes par vignette, sans détail. Tu compares, puis tu choisis." },
    {
      type: "schema",
      legende: "Le même sujet, une maison, composé de trois façons : petite sous un grand ciel, toute proche et coupée par le cadre, ou au bout d’un chemin sous un horizon haut.",
      alt: "Trois petits cadres. Dans le premier, une maison minuscule sur un horizon bas. Dans le deuxième, une grande maison coupée par le bord gauche. Dans le troisième, un horizon haut, une petite maison et un chemin qui y mène.",
      largeur: 320,
      hauteur: 120,
      formes: [
        ["polygon", { points: "256,84 248,36 251,36 292,84", classe: "ombre" }],
        ["polygon", { points: "66,66 66,58 72,52 78,58 78,66", classe: "plein" }],
        ["line", { x1: 12, y1: 66, x2: 102, y2: 66, classe: "trait" }],
        ["polygon", { points: "115,84 115,41.3 135,28 165,48 165,84", classe: "plein" }],
        ["line", { x1: 165, y1: 70, x2: 205, y2: 70, classe: "trait" }],
        ["polygon", { points: "242,36 242,28 248,22 254,28 254,36", classe: "plein" }],
        ["line", { x1: 218, y1: 36, x2: 308, y2: 36, classe: "trait" }],
        ["rect", { x: 12, y: 14, width: 90, height: 70, classe: "trait" }],
        ["rect", { x: 115, y: 14, width: 90, height: 70, classe: "trait" }],
        ["rect", { x: 218, y: 14, width: 90, height: 70, classe: "trait" }],
        ["text", { x: 57, y: 104, ancre: "middle", classe: "etiquette" }, "vu de loin"],
        ["text", { x: 160, y: 104, ancre: "middle", classe: "etiquette" }, "de tout près"],
        ["text", { x: 263, y: 104, ancre: "middle", classe: "etiquette" }, "horizon haut"]
      ]
    },
    { type: "astuce", contenu: "Pour juger une vignette, plisse les yeux ou éloigne la feuille à bout de bras. Si tu vois encore tout de suite où est le sujet, la composition fonctionne." },
    { type: "texte", contenu: "Tu as maintenant toutes les pièces : les volumes, la bibliothèque visuelle, la lumière, les idées et la composition. Le dernier chapitre les assemble en une seule méthode." },
    {
      type: "exercice",
      titre: "Un sujet, trois compositions",
      consigne: "Choisis un sujet simple, par exemple une maison près d’un arbre, et compose-le de trois façons différentes avant d’en agrandir une.",
      etapes: [
        "5 min : trace trois petits cadres de la taille d’une boîte d’allumettes et marque légèrement les tiers dans chacun.",
        "10 min : place ton sujet de trois façons : de loin avec beaucoup de ciel, de tout près et coupé par le cadre, puis avec un premier plan devant lui.",
        "5 min : choisis la vignette la plus claire et redessine-la deux fois plus grande, avec ses trois plans."
      ],
      materiel: "Crayon et papier",
      duree: 20
    },
    { type: "retenir", elements: [
      "Trace le cadre, puis place un seul point d’intérêt, de préférence sur un tiers.",
      "Trois plans, des chevauchements et des tailles différentes créent la profondeur.",
      "Essaie plusieurs vignettes avant de te lancer en grand."
    ] }
  ]
});

/* ───────────── Chapitre 12 : De l’idée au dessin fini ───────────── */
DDJ.guide.chapitres.push({
  id: "g12",
  numero: 12,
  partie: 3,
  titre: "De l’idée au dessin fini : la méthode complète",
  resume: "Sept étapes pour aller de l’idée au dessin fini, un programme de quatre semaines et un moyen de voir tes progrès.",
  blocs: [
    { type: "texte", contenu: "Tu as maintenant toutes les pièces. Ce dernier chapitre les met dans l’ordre : sept étapes pour aller de l’idée au dessin fini, puis un programme d’entraînement et un moyen de voir tes progrès." },

    { type: "titre", contenu: "Pourquoi une méthode" },
    { type: "texte", contenu: "Dessiner d’imagination, c’est prendre beaucoup de décisions : le sujet, sa forme, sa place, sa lumière. Les prendre toutes à la fois, c’est le meilleur moyen de s’y perdre. La méthode les met en file : une seule question par étape. Chacune reprend un chapitre que tu connais." },

    { type: "titre", contenu: "Les sept étapes" },
    { type: "etapes", elements: [
      "L’idée : choisis un sujet et note-le en une phrase (chapitre 10).",
      "Les souvenirs et les références : rassemble ce que tu sais du sujet, et va observer ce qui t’échappe (chapitre 6).",
      "Les vignettes : essaie trois compositions minuscules et garde la plus claire (chapitre 11).",
      "La construction : reporte la vignette en grand, d’un trait très léger, en volumes simples (chapitres 3 à 8).",
      "Le dessin au propre : repasse d’un trait franc sur les lignes que tu gardes. Les détails viennent en dernier.",
      "La lumière : choisis ta source, puis pose tes trois valeurs (chapitre 9).",
      "La relecture : prends du recul, corrige une ou deux choses, puis arrête-toi."
    ] },
    {
      type: "schema",
      legende: "Les sept étapes dans l’ordre. Les trois premières se font en petit et vont vite, les quatre suivantes se font sur le dessin lui-même.",
      alt: "Une frise de sept ronds numérotés de 1 à 7, reliés par des flèches : idée, souvenirs, vignettes, construction, au propre, lumière, relecture.",
      largeur: 320,
      hauteur: 120,
      formes: [
        ["circle", { cx: 30, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 72, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 114, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 156, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 198, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 240, cy: 62, r: 11, classe: "trait" }],
        ["circle", { cx: 282, cy: 62, r: 11, classe: "trait" }],
        ["line", { x1: 43, y1: 62, x2: 59, y2: 62, classe: "fleche" }],
        ["line", { x1: 85, y1: 62, x2: 101, y2: 62, classe: "fleche" }],
        ["line", { x1: 127, y1: 62, x2: 143, y2: 62, classe: "fleche" }],
        ["line", { x1: 169, y1: 62, x2: 185, y2: 62, classe: "fleche" }],
        ["line", { x1: 211, y1: 62, x2: 227, y2: 62, classe: "fleche" }],
        ["line", { x1: 253, y1: 62, x2: 269, y2: 62, classe: "fleche" }],
        ["text", { x: 30, y: 66, ancre: "middle", classe: "etiquette" }, "1"],
        ["text", { x: 72, y: 66, ancre: "middle", classe: "etiquette" }, "2"],
        ["text", { x: 114, y: 66, ancre: "middle", classe: "etiquette" }, "3"],
        ["text", { x: 156, y: 66, ancre: "middle", classe: "etiquette" }, "4"],
        ["text", { x: 198, y: 66, ancre: "middle", classe: "etiquette" }, "5"],
        ["text", { x: 240, y: 66, ancre: "middle", classe: "etiquette" }, "6"],
        ["text", { x: 282, y: 66, ancre: "middle", classe: "etiquette" }, "7"],
        ["text", { x: 30, y: 38, ancre: "middle", classe: "etiquette" }, "idée"],
        ["text", { x: 114, y: 38, ancre: "middle", classe: "etiquette" }, "vignettes"],
        ["text", { x: 198, y: 38, ancre: "middle", classe: "etiquette" }, "au propre"],
        ["text", { x: 282, y: 38, ancre: "middle", classe: "etiquette" }, "relecture"],
        ["text", { x: 72, y: 94, ancre: "middle", classe: "etiquette" }, "souvenirs"],
        ["text", { x: 156, y: 94, ancre: "middle", classe: "etiquette" }, "construction"],
        ["text", { x: 240, y: 94, ancre: "middle", classe: "etiquette" }, "lumière"]
      ]
    },
    { type: "texte", contenu: "Les trois premières étapes vont vite et pèsent lourd : dix minutes de recherche évitent une heure de corrections. Et regarder une référence n’est pas tricher : c’est ainsi que travaillent les illustrateurs, et que ta bibliothèque visuelle continue de grandir." },
    {
      type: "schema",
      legende: "Le même dessin à trois stades : la vignette qui fixe l’idée, la construction légère en volumes, puis le dessin au propre avec sa lumière.",
      alt: "Trois états d’une maison-champignon. D’abord une vignette minuscule en silhouette dans un petit cadre. Ensuite la construction en traits pâles : un dôme sur un cylindre, avec leur axe. Enfin le dessin fini, avec porte, fenêtre et ombres à droite.",
      largeur: 320,
      hauteur: 162,
      formes: [
        ["path", { d: "M 34 88 A 12 11 0 0 1 58 88 Z", classe: "plein" }],
        ["rect", { x: 42, y: 88, width: 8, height: 16, classe: "plein" }],
        ["line", { x1: 24, y1: 104, x2: 68, y2: 104, classe: "leger" }],
        ["rect", { x: 24, y: 58, width: 44, height: 56, classe: "trait" }],
        ["line", { x1: 76, y1: 96, x2: 122, y2: 96, classe: "fleche" }],
        ["path", { d: "M 110 70 A 40 36 0 0 1 190 70", classe: "leger" }],
        ["ellipse", { cx: 150, cy: 70, rx: 40, ry: 9, classe: "leger" }],
        ["line", { x1: 133, y1: 70, x2: 133, y2: 124, classe: "leger" }],
        ["line", { x1: 167, y1: 70, x2: 167, y2: 124, classe: "leger" }],
        ["ellipse", { cx: 150, cy: 124, rx: 17, ry: 5, classe: "leger" }],
        ["line", { x1: 150, y1: 26, x2: 150, y2: 136, classe: "pointille" }],
        ["line", { x1: 176, y1: 96, x2: 222, y2: 96, classe: "fleche" }],
        ["path", { d: "M 250 34 A 40 36 0 0 1 290 70 A 40 9 0 0 1 250 79 A 20 22.5 0 0 0 250 34 Z", classe: "ombre" }],
        ["path", { d: "M 255 78.9 L 255 128.8 A 17 5 0 0 0 267 124 L 267 78.1 A 40 9 0 0 1 255 78.9 Z", classe: "ombre" }],
        ["ellipse", { cx: 286, cy: 125, rx: 18, ry: 4, classe: "ombre-forte" }],
        ["path", { d: "M 210 70 A 40 36 0 0 1 290 70 A 40 9 0 0 1 210 70 Z", classe: "trait" }],
        ["line", { x1: 233, y1: 78.1, x2: 233, y2: 124, classe: "trait" }],
        ["line", { x1: 267, y1: 78.1, x2: 267, y2: 124, classe: "trait" }],
        ["path", { d: "M 233 124 A 17 5 0 0 0 267 124", classe: "trait" }],
        ["path", { d: "M 241 128.2 L 241 106 A 5 5 0 0 1 251 106 L 251 129", classe: "trait" }],
        ["circle", { cx: 236, cy: 58, r: 5, classe: "trait" }],
        ["text", { x: 46, y: 152, ancre: "middle", classe: "etiquette" }, "vignette"],
        ["text", { x: 150, y: 152, ancre: "middle", classe: "etiquette" }, "construction"],
        ["text", { x: 250, y: 152, ancre: "middle", classe: "etiquette" }, "dessin fini"]
      ]
    },
    { type: "piege", contenu: "Sauter directement au dessin au propre parce que l’idée paraît claire en tête. Les problèmes de place et de proportions surgissent alors en plein milieu, trop tard pour être réglés sans tout effacer. Garde toujours au moins une vignette et une construction légère." },

    { type: "titre", contenu: "Quand ça coince" },
    { type: "texte", contenu: "Rester en panne est normal, et chaque panne a sa sortie :" },
    { type: "liste", elements: [
      "Pas d’idée : tire un sujet dans la section « Idées ».",
      "Un élément que tu ne sais pas dessiner : va l’observer cinq minutes, en vrai ou en photo.",
      "Aucune vignette ne te plaît : change la taille du sujet ou la hauteur de l’horizon.",
      "La construction se déforme : reviens à des boîtes et vérifie ta ligne d’horizon.",
      "Le trait au propre hésite : refais deux minutes d’échauffement.",
      "La lumière est confuse : redessine ta flèche et reviens à trois valeurs.",
      "Quelque chose cloche sans que tu saches quoi : regarde ton dessin dans un miroir, ou laisse-le reposer jusqu’au lendemain."
    ] },
    { type: "piege", contenu: "Reprendre sans fin la même étape en attendant qu’elle soit parfaite. Un dessin terminé avec ses défauts t’apprend plus qu’un dessin parfait jamais fini. Donne un temps à chaque étape, puis passe à la suivante." },

    { type: "titre", contenu: "Un programme sur quatre semaines" },
    { type: "texte", contenu: "L’exercice du jour de l’appli reste ta base : il entretient la main et l’œil. Pendant quatre semaines, ajoute-lui un fil rouge de cinq à dix minutes, les jours où tu en as envie. Un jour sauté ne casse rien." },
    { type: "liste", elements: [
      "Semaine 1, les volumes : quelques boîtes et cylindres tournés dans tous les sens.",
      "Semaine 2, la mémoire : un objet croisé dans la journée, à observer, cacher, puis redessiner.",
      "Semaine 3, les idées : un sujet tiré dans « Idées », à chercher en six silhouettes.",
      "Semaine 4, un dessin complet : les sept étapes, une ou deux par jour."
    ] },
    {
      type: "schema",
      legende: "Le fil rouge de chaque semaine, à ajouter après l’exercice du jour, et les chapitres à relire en cas de besoin.",
      alt: "Un tableau de quatre lignes. Semaine 1 : tourner des volumes, chapitres 1 à 4. Semaine 2 : études de mémoire, chapitres 5 à 8. Semaine 3 : idées et silhouettes, chapitre 10. Semaine 4 : un dessin complet, chapitres 9 à 12.",
      largeur: 320,
      hauteur: 140,
      formes: [
        ["rect", { x: 10, y: 14, width: 70, height: 112, classe: "surligne" }],
        ["line", { x1: 10, y1: 42, x2: 310, y2: 42, classe: "leger" }],
        ["line", { x1: 10, y1: 70, x2: 310, y2: 70, classe: "leger" }],
        ["line", { x1: 10, y1: 98, x2: 310, y2: 98, classe: "leger" }],
        ["line", { x1: 80, y1: 14, x2: 80, y2: 126, classe: "leger" }],
        ["line", { x1: 222, y1: 14, x2: 222, y2: 126, classe: "leger" }],
        ["rect", { x: 10, y: 14, width: 300, height: 112, classe: "trait" }],
        ["text", { x: 16, y: 32, ancre: "start", classe: "etiquette" }, "Semaine 1"],
        ["text", { x: 86, y: 32, ancre: "start", classe: "etiquette" }, "Tourner des volumes"],
        ["text", { x: 228, y: 32, ancre: "start", classe: "etiquette" }, "chap. 1 à 4"],
        ["text", { x: 16, y: 60, ancre: "start", classe: "etiquette" }, "Semaine 2"],
        ["text", { x: 86, y: 60, ancre: "start", classe: "etiquette" }, "Études de mémoire"],
        ["text", { x: 228, y: 60, ancre: "start", classe: "etiquette" }, "chap. 5 à 8"],
        ["text", { x: 16, y: 88, ancre: "start", classe: "etiquette" }, "Semaine 3"],
        ["text", { x: 86, y: 88, ancre: "start", classe: "etiquette" }, "Idées et silhouettes"],
        ["text", { x: 228, y: 88, ancre: "start", classe: "etiquette" }, "chap. 10"],
        ["text", { x: 16, y: 116, ancre: "start", classe: "etiquette" }, "Semaine 4"],
        ["text", { x: 86, y: 116, ancre: "start", classe: "etiquette" }, "Un dessin complet"],
        ["text", { x: 228, y: 116, ancre: "start", classe: "etiquette" }, "chap. 9 à 12"]
      ]
    },

    { type: "titre", contenu: "Voir ses progrès" },
    { type: "texte", contenu: "Au jour le jour, les progrès sont invisibles. Il faut un point de comparaison : choisis un sujet témoin, dessine-le aujourd’hui de mémoire, date la feuille et range-la. Dans un mois, redessine-le sans regarder le premier, puis pose les deux feuilles côte à côte. Tu ne te compares qu’à toi-même." },
    { type: "astuce", contenu: "Date tous tes dessins et garde-les, surtout ceux que tu aimes le moins : ce sont eux qui montreront le mieux le chemin parcouru." },
    { type: "texte", contenu: "Le guide s’arrête ici, pas l’entraînement. Reviens aux chapitres quand tu en as besoin, et laisse l’exercice du jour faire le reste." },
    {
      type: "exercice",
      titre: "Ton dessin témoin",
      consigne: "Déroule la méthode sur un sujet de ton choix, par exemple une cabane dans un arbre, sans chercher de référence : ce dessin témoin se fait de mémoire. Date la feuille et garde-la : tu referas le même sujet dans un mois.",
      etapes: [
        "5 min : note ton idée en une phrase, essaie trois vignettes d’une minute et entoure la plus claire.",
        "15 min : construis-la en grand et en volumes simples, d’un trait léger, puis repasse au propre les lignes que tu gardes.",
        "10 min : choisis ta source de lumière, pose tes trois valeurs, relis ton dessin avec du recul et écris la date dans un coin."
      ],
      materiel: "Crayon, gomme et papier",
      duree: 30
    },
    { type: "retenir", elements: [
      "Sept étapes, une seule question à la fois : idée, références, vignettes, construction, mise au propre, lumière, relecture.",
      "Quand ça coince, reviens au plus simple (des boîtes, une flèche, trois valeurs) ou va observer.",
      "Pour voir tes progrès, redessine le même sujet à un mois d’écart."
    ] }
  ]
});
