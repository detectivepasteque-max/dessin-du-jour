window.DDJ = window.DDJ || {};
DDJ.themes = DDJ.themes || {};

/* Dessin du jour — données : vendredi (Nature), samedi (Imagination), dimanche (Libre) + générateur d’imagination. */

/* ------------------------------------------------------------------ */
/* VENDREDI — Nature                                                   */
/* ------------------------------------------------------------------ */
DDJ.themes[5] = {
  cle: "nature",
  jour: "Vendredi",
  nom: "Nature",
  description: "Plantes, fruits, bêtes, ciel et cailloux : la nature qui t’entoure, observée de près, retrouvée de mémoire ou réinventée.",
  exercices: [
    {
      id: "ven-01",
      titre: "La feuille sous toutes ses coutures",
      consigne: "Prends une feuille d’arbre ou de plante et dessine-la trois fois : d’abord sa silhouette, puis ses nervures, puis un détail en très grand.",
      etapes: [
        "5 min : trace seulement le contour de la feuille, sans rien à l’intérieur.",
        "10 min : redessine-la à côté avec sa nervure centrale, puis les nervures plus fines.",
        "5 min : choisis un petit bout (une pointe, un trou, une déchirure) et dessine-le en grand."
      ],
      materiel: "Crayon, papier, une feuille d’arbre ou de plante",
      siBloque: "Pose la feuille sur le papier, fais-en le tour au crayon, puis ajoute simplement les nervures.",
      duree: 20
    },
    {
      id: "ven-02",
      titre: "Un fruit, trois moments",
      consigne: "Choisis un fruit dans la cuisine et dessine-le à trois moments de sa vie : entier, coupé en deux, puis entamé ou épluché.",
      etapes: [
        "10 min : dessine le fruit entier, avec sa queue et l’ombre qu’il pose sur la table.",
        "10 min : coupe-le en deux et dessine l’intérieur : pépins, noyau, quartiers.",
        "10 min : croque dedans ou épluche-le, puis dessine ce qu’il en reste."
      ],
      materiel: "Crayon, papier, un fruit et un couteau",
      siBloque: "Contente-toi du fruit entier : une forme simple, une petite queue et une ombre dessous.",
      duree: 30
    },
    {
      id: "ven-03",
      titre: "Le ciel par la fenêtre",
      consigne: "Regarde le ciel tel qu’il est en ce moment et dessine-le dans un petit cadre : nuages, éclaircies, lune ou grand vide, tout est bon à prendre.",
      etapes: [
        "2 min : trace un cadre grand comme une carte postale et repère où sont les grandes masses claires et sombres.",
        "8 min : dessine les nuages par leurs ombres, en frottant le crayon couché, sans contour dur.",
        "5 min : ajoute en bas un bout de toit, d’arbre ou d’antenne pour donner l’échelle."
      ],
      materiel: "Crayon et papier",
      siBloque: "Ciel tout uni ou nuit noire ? Fais un simple dégradé, du plus sombre en haut au plus clair en bas.",
      duree: 15
    },
    {
      id: "ven-04",
      titre: "Le caillou vedette",
      consigne: "Trouve un caillou (ou, à défaut, une noix ou une pomme de terre) et fais-en le portrait comme s’il s’agissait d’une célébrité : ses bosses, ses facettes, ses fissures.",
      etapes: [
        "5 min : trace son contour, puis découpe-le en quelques grandes facettes.",
        "10 min : grise les facettes qui tournent le dos à la lumière, en laissant les autres blanches.",
        "5 min : ajoute l’ombre sur la table, puis les fissures, les taches et les petits points."
      ],
      materiel: "Crayon, papier, un caillou (ou une noix, une pomme de terre)",
      siBloque: "Dessine-le comme une simple patate : un contour, un côté sombre et une ombre par terre.",
      duree: 20
    },
    {
      id: "ven-05",
      titre: "Portrait d’une plante de la maison",
      consigne: "Installe-toi devant une plante en pot et dessine-la en entier, du pot jusqu’à la plus haute feuille. Sans plante chez toi, une branche ou un bouquet d’herbes dans un verre fait très bien l’affaire.",
      etapes: [
        "5 min : dessine le pot, puis les tiges principales d’un trait léger, pour sentir l’élan de la plante.",
        "15 min : pose les feuilles une à une, en commençant par celles qui sont devant.",
        "10 min : fonce les feuilles de derrière et la terre pour faire ressortir celles du premier plan."
      ],
      materiel: "Crayon, papier, une plante en pot (ou une branche dans un verre)",
      siBloque: "Ne dessine qu’une seule tige avec ses feuilles, en grand sur la page.",
      duree: 30
    },
    {
      id: "ven-06",
      titre: "L’arbre de mémoire",
      consigne: "Dessine de tête un arbre que tu connais bien : celui de ta rue, d’un jardin, d’une cour d’école. Peu importe l’exactitude, c’est ton souvenir qui compte.",
      etapes: [
        "3 min : ferme les yeux, retrouve sa silhouette, puis trace-la d’un trait très léger.",
        "7 min : dessine le tronc et les grosses branches, qui s’affinent en montant.",
        "5 min : ajoute le feuillage par gros paquets, sans dessiner les feuilles une à une."
      ],
      materiel: "Crayon et papier",
      siBloque: "Trace un grand « Y » pour le tronc, puis des « Y » de plus en plus petits au bout de chaque branche.",
      duree: 15
    },
    {
      id: "ven-07",
      titre: "De la graine à la fleur",
      consigne: "Raconte en quatre petits dessins la vie d’une plante : la graine, le germe, la jeune pousse, puis la plante en fleur. Tu peux t’inspirer d’un haricot, d’un tournesol ou d’une plante inventée.",
      etapes: [
        "3 min : trace une ligne de sol d’un bord à l’autre de la feuille et marque quatre emplacements le long de cette ligne.",
        "12 min : dessine les quatre étapes de gauche à droite, environ trois minutes chacune, sans oublier les racines qui grandissent sous la ligne de sol.",
        "5 min : ajoute ce qui aide la plante à pousser (un soleil, de la pluie, un ver de terre) et grise la terre."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine seulement deux étapes : une graine sous la terre, puis une tige avec deux feuilles.",
      duree: 20
    },
    {
      id: "ven-08",
      titre: "Un légume qui a du caractère",
      consigne: "Choisis le légume le plus biscornu de ta cuisine (poivron, gingembre, chou, tête d’ail) et dessine-le en grand, en suivant son contour très lentement.",
      etapes: [
        "5 min : observe-le sous plusieurs angles, puis esquisse sa forme générale d’un trait léger, en occupant toute la page.",
        "10 min : repasse le contour au ralenti, en suivant chaque bosse et chaque creux comme si ton crayon touchait le légume.",
        "5 min : ajoute les plis, les côtes ou les racines qui montrent comment la surface tourne."
      ],
      materiel: "Crayon, papier, un légume",
      siBloque: "Prends un oignon ou une tomate : un rond un peu cabossé et une petite queue suffisent.",
      duree: 20
    },
    {
      id: "ven-09",
      titre: "Un animal en quelques gestes",
      consigne: "Croque un animal sur le vif : celui de la maison, un oiseau par la fenêtre ou, à défaut, une photo d’animal de ton téléphone. Vise l’attitude, pas les détails.",
      etapes: [
        "5 min : fais cinq mini-croquis d’une minute chacun, juste la ligne du dos et les grosses formes.",
        "7 min : choisis la pose que tu préfères et refais-la en plus grand, avec la tête, les pattes et la queue.",
        "3 min : ajoute l’œil, les oreilles et quelques traits de pelage ou de plumage."
      ],
      materiel: "Crayon et papier",
      siBloque: "Résume l’animal à deux ovales, un pour le corps et un pour la tête, puis relie-les.",
      duree: 15
    },
    {
      id: "ven-10",
      titre: "Un paysage, trois météos",
      consigne: "Invente un paysage tout simple (une colline, un arbre, une maison) et dessine-le trois fois : sous un grand soleil, sous la pluie, puis dans le brouillard.",
      etapes: [
        "5 min : trace trois cadres et place le même paysage, très simplement, dans chacun.",
        "15 min : fais briller le soleil dans le premier avec des ombres bien nettes, puis fais pleuvoir dans le deuxième avec des traits obliques et des flaques.",
        "10 min : dans le troisième, estompe tout avec le doigt et efface les lointains à la gomme pour faire monter le brouillard."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Fais deux cadres seulement : le soleil avec des ombres nettes, la pluie avec des traits obliques.",
      duree: 30
    },
    {
      id: "ven-11",
      titre: "Planche d’herbier au stylo",
      consigne: "Rassemble trois petits végétaux (brin d’herbe, persil, fleur, brindille) et dessine-les côte à côte directement au stylo, comme sur la planche d’un botaniste.",
      etapes: [
        "3 min : dispose tes trois végétaux sur la table et repère la ligne principale de chacun.",
        "12 min : dessine-les l’un après l’autre au stylo, sans crayon ni gomme, environ quatre minutes chacun.",
        "5 min : écris leur nom en dessous (inventé si tu ne le connais pas) et ajoute la date."
      ],
      materiel: "Stylo, papier, trois petits végétaux",
      siBloque: "Un seul brin suffit : une tige, quelques feuilles et son nom écrit dessous.",
      duree: 20
    },
    {
      id: "ven-12",
      titre: "L’ombre d’une plante",
      consigne: "Place une plante, une branche ou un bouquet entre une lampe et ta feuille, puis dessine uniquement l’ombre qui tombe sur le papier.",
      etapes: [
        "3 min : installe la lampe et la plante jusqu’à obtenir une ombre nette sur ta feuille.",
        "7 min : trace tranquillement le contour de l’ombre, directement sur le papier.",
        "5 min : grise certaines formes, laisse les autres vides et regarde le motif apparaître."
      ],
      materiel: "Crayon, papier, une plante ou une branche, une lampe (celle du téléphone convient)",
      siBloque: "Si l’ombre est floue, rapproche la plante du papier et ne trace que trois ou quatre feuilles.",
      duree: 15
    },
    {
      id: "ven-13",
      titre: "Le défilé des petites bêtes",
      consigne: "Dessine de mémoire six petites bêtes à la file, comme un défilé : escargot, fourmi, coccinelle, papillon, araignée, abeille… ou celles que tu préfères.",
      etapes: [
        "2 min : écris ta liste de six petites bêtes dans un coin de la feuille.",
        "12 min : dessine-les l’une derrière l’autre, deux minutes chacune, sans chercher l’exactitude.",
        "6 min : ajoute un brin d’herbe, un caillou ou une goutte de pluie pour montrer à quel point elles sont petites."
      ],
      materiel: "Crayon et papier",
      siBloque: "Commence par l’escargot : une spirale, un corps allongé et deux antennes.",
      duree: 20
    },
    {
      id: "ven-14",
      titre: "Gouttes d’eau",
      consigne: "Dépose quelques gouttes d’eau sur une assiette ou sur une feuille de plante et dessine-les en grand, avec leur reflet et leur ombre.",
      etapes: [
        "3 min : dépose les gouttes et observe-les de près : où est le point de lumière, où est l’ombre ?",
        "7 min : dessine trois gouttes bien plus grandes que nature : un contour léger, un reflet laissé blanc, une ombre sur le côté.",
        "5 min : fonce un peu le fond autour des gouttes pour faire briller les reflets."
      ],
      materiel: "Crayon, papier, un peu d’eau, une assiette ou une feuille de plante",
      siBloque: "Dessine une seule goutte : un ovale, un petit carré blanc pour le reflet et une ombre d’un côté.",
      duree: 15
    },
    {
      id: "ven-15",
      titre: "Un coin de nature que tu aimes",
      consigne: "Dessine de souvenir un endroit en pleine nature que tu aimes : une plage, un sentier, un jardin, un bord de rivière. Construis-le en trois plans, du plus lointain au plus proche.",
      etapes: [
        "5 min : choisis ton endroit et partage la feuille en trois bandes légères : le lointain, le milieu, le premier plan.",
        "15 min : remplis chaque bande, avec des formes pâles et simples au loin, plus foncées et plus détaillées devant.",
        "10 min : ajoute ce qui te ramène là-bas : un banc, un oiseau, une serviette, un chemin."
      ],
      materiel: "Crayon et papier",
      siBloque: "Trace une ligne d’horizon, une colline et un arbre : c’est déjà un paysage.",
      duree: 30
    }
  ]
};

/* ------------------------------------------------------------------ */
/* SAMEDI — Imagination                                                */
/* ------------------------------------------------------------------ */
DDJ.themes[6] = {
  cle: "imagination",
  jour: "Samedi",
  nom: "Imagination",
  description: "Tu dessines de tête : tout est permis, et rien n’a besoin d’être réaliste.",
  exercices: [
    {
      id: "sam-01",
      titre: "L’animal impossible",
      consigne: "Invente une créature en mélangeant trois animaux : la tête de l’un, le corps d’un autre, les pattes d’un troisième.",
      etapes: [
        "3 min : choisis tes trois animaux et note qui prête quoi : la tête, le corps, les pattes.",
        "12 min : dessine la créature en entier, en soignant les endroits où les morceaux se rejoignent.",
        "5 min : donne-lui un nom et dessine ce qu’elle mange ou l’endroit où elle dort."
      ],
      materiel: "Crayon et papier",
      siBloque: "Prends un animal que tu sais dessiner et change une seule chose : des ailes, une trompe ou huit pattes.",
      duree: 20
    },
    {
      id: "sam-02",
      titre: "Du gribouillis à la créature",
      consigne: "Trace quelques gribouillis au hasard, puis cherche ce qui se cache dedans : un monstre, un oiseau, un bonhomme. C’est le jeu des nuages, version crayon.",
      etapes: [
        "2 min : les yeux fermés, trace quatre gribouillis bien séparés sur la page.",
        "8 min : tourne la feuille dans tous les sens et transforme chaque gribouillis en créature : des yeux, des pattes, un bec, un chapeau.",
        "5 min : choisis ta créature préférée et offre-lui un sol, une ombre et un petit décor."
      ],
      materiel: "Crayon et papier",
      siBloque: "Ajoute simplement deux yeux et une bouche à chaque gribouillis : il devient aussitôt quelqu’un.",
      duree: 15
    },
    {
      id: "sam-03",
      titre: "Une maison pas comme les autres",
      consigne: "Dessine une maison installée dans un endroit improbable : sur le dos d’une tortue, dans une théière, au sommet d’un champignon, accrochée à un ballon.",
      etapes: [
        "5 min : choisis l’endroit et esquisse la grande forme de l’ensemble.",
        "15 min : ajoute la porte, les fenêtres, la cheminée, et surtout le moyen d’y entrer : échelle, escalier, corde, toboggan.",
        "10 min : fais vivre la maison : du linge qui sèche, une boîte aux lettres, une lumière allumée, quelqu’un à la fenêtre."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une théière ou un champignon, puis ajoute une porte, une fenêtre et une cheminée.",
      duree: 30
    },
    {
      id: "sam-04",
      titre: "L’objet qui prend vie",
      consigne: "Choisis un objet posé près de toi et transforme-le en personnage : il lui pousse un visage, des bras, des jambes et, surtout, une humeur.",
      etapes: [
        "5 min : dessine l’objet simplement, assez grand.",
        "5 min : ajoute-lui des yeux, une bouche, des bras et des jambes, avec une humeur précise : grognon, timide, très fier.",
        "5 min : fais-le parler dans une bulle ou donne-lui un accessoire qui raconte sa vie."
      ],
      materiel: "Crayon, papier, un objet du quotidien",
      siBloque: "Une tasse, deux yeux, un sourire : c’est fait. Tout le reste est du bonus.",
      duree: 15
    },
    {
      id: "sam-05",
      titre: "La carte d’une île inventée",
      consigne: "Dessine la carte au trésor d’une île qui n’existe pas : ses côtes, ses montagnes, sa forêt, ses noms de lieux farfelus et, bien sûr, la croix du trésor.",
      etapes: [
        "5 min : trace le contour de l’île, avec des baies, des caps et quelques îlots autour.",
        "15 min : ajoute montagnes, forêt, rivière et village avec de petits symboles, et baptise chaque lieu.",
        "10 min : trace le chemin en pointillés jusqu’à la croix, puis ajoute une rose des vents et un monstre marin."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une forme de patate, trois triangles pour les montagnes et une croix pour le trésor.",
      duree: 30
    },
    {
      id: "sam-06",
      titre: "Le véhicule farfelu",
      consigne: "Invente un engin en associant un objet banal et un moyen d’avancer : une baignoire à voiles, un canapé à hélices, une chaussure à roulettes.",
      etapes: [
        "3 min : choisis ton objet (baignoire, canapé, chaussure, théière) et ce qui le fait avancer (roues, ailes, voiles, ballons).",
        "12 min : dessine l’engin en entier, avec la personne qui le pilote.",
        "5 min : ajoute des traits de vitesse, de la fumée et un bout de décor qui défile."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une chaussure, puis ajoute-lui quatre roues et un volant.",
      duree: 20
    },
    {
      id: "sam-07",
      titre: "Une mini-histoire en trois cases",
      consigne: "Raconte une toute petite histoire en trois cases de bande dessinée : un début, une surprise, une chute. Des bonshommes bâtons suffisent largement.",
      etapes: [
        "3 min : trace trois cases et décide de ton histoire : qui est ton personnage, ce qu’il veut, ce qui lui arrive.",
        "12 min : dessine les trois cases avec des personnages très simples, environ quatre minutes par case.",
        "5 min : ajoute les bulles, les bruits (« Plouf ! », « Zzz… ») et un titre."
      ],
      materiel: "Crayon et papier",
      siBloque: "Raconte seulement ceci : un bonhomme voit un gâteau, mange le gâteau, fait la sieste.",
      duree: 20
    },
    {
      id: "sam-08",
      titre: "Un personnage en trois mots",
      consigne: "Écris un métier, une humeur et un accessoire, sans trop réfléchir, puis dessine le personnage qui les réunit.",
      etapes: [
        "3 min : note tes trois mots, par exemple : boulangère, rêveuse, parapluie.",
        "12 min : dessine ce personnage de la tête aux pieds, en commençant par sa posture.",
        "5 min : ajoute son prénom et un détail qui en dit long : ses chaussures, sa coiffure, ce qu’il y a dans ses poches."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine un bonhomme tout simple et donne-lui seulement l’accessoire et l’expression du visage.",
      duree: 20
    },
    {
      id: "sam-09",
      titre: "Carte postale d’une planète inconnue",
      consigne: "Dessine le paysage d’une planète que personne n’a encore visitée : son ciel, son relief, ses plantes étranges et peut-être quelqu’un qui y habite.",
      etapes: [
        "5 min : trace la ligne d’horizon et remplis le ciel : lunes, anneaux, soleils, comètes.",
        "15 min : invente le relief et la végétation, avec au moins trois sortes de plantes ou de rochers qui n’existent pas sur Terre.",
        "10 min : ajoute un habitant ou un vaisseau, puis les ombres au sol."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine des collines rondes, deux lunes dans le ciel et un champignon géant.",
      duree: 30
    },
    {
      id: "sam-10",
      titre: "Tu mesures trois centimètres",
      consigne: "Imagine que tu as rétréci et que tu te promènes sur ta propre table. Dessine la scène : la tasse devient une piscine, le crayon un tronc d’arbre.",
      etapes: [
        "3 min : regarde ta table et choisis trois objets qui vont devenir gigantesques.",
        "12 min : dessine-les si grands qu’ils dépassent de la feuille, et place une toute petite version de toi au milieu.",
        "5 min : montre ce que tu es en train de faire : escalade, baignade, sieste sur la gomme."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une tasse qui remplit toute la page et un minuscule bonhomme à côté.",
      duree: 20
    },
    {
      id: "sam-11",
      titre: "L’invention qui manque au monde",
      consigne: "Pense à un petit tracas du quotidien et dessine la machine qui le règle une fois pour toutes, sous forme de schéma avec des flèches et des légendes.",
      etapes: [
        "3 min : choisis ton tracas (chaussettes perdues, réveil trop tôt, tartine qui tombe) et imagine la machine.",
        "8 min : dessine-la avec ses tuyaux, ses engrenages, ses manivelles et ses boutons.",
        "4 min : ajoute des flèches et des légendes pour expliquer comment elle fonctionne."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une boîte avec un entonnoir dessus, une manivelle sur le côté et un tuyau qui en sort.",
      duree: 15
    },
    {
      id: "sam-12",
      titre: "Trois mots tirés d’un livre",
      consigne: "Ouvre un livre au hasard, pose ton doigt sur la page et note le premier nom commun que tu trouves. Fais-le trois fois, puis réunis les trois mots dans un seul dessin.",
      etapes: [
        "2 min : tire tes trois mots au hasard et écris-les en haut de la feuille.",
        "10 min : dessine une seule image où les trois se rencontrent, même si la scène est absurde.",
        "3 min : trouve un titre à ton dessin et écris-le dessous."
      ],
      materiel: "Crayon, papier, un livre",
      siBloque: "Garde un seul mot et dessine la première image qui te vient, même toute simple.",
      duree: 15
    },
    {
      id: "sam-13",
      titre: "Le monde à l’envers",
      consigne: "Choisis une situation ordinaire et inverse les rôles : le chien promène son maître, le poisson pêche, les livres lisent des gens.",
      etapes: [
        "3 min : cherche deux ou trois idées d’inversion et garde celle qui te fait sourire.",
        "12 min : dessine la scène, en donnant aux personnages l’air de trouver ça parfaitement normal.",
        "5 min : ajoute un témoin qui, lui, n’en revient pas."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine un poisson qui tient une canne à pêche : la scène est déjà là.",
      duree: 20
    },
    {
      id: "sam-14",
      titre: "Neuf ronds, neuf idées",
      consigne: "Trace neuf ronds, puis transforme chacun en quelque chose de différent, une minute par rond : planète, pizza, horloge, visage, hublot…",
      etapes: [
        "2 min : trace neuf ronds en faisant le tour d’un bouchon ou d’une pièce de monnaie.",
        "9 min : transforme chaque rond en une chose différente, une minute chacun, sans revenir en arrière.",
        "4 min : choisis l’idée la plus inattendue et redessine-la en plus grand."
      ],
      materiel: "Crayon, papier, un bouchon ou une pièce pour tracer les ronds",
      siBloque: "Transforme chaque rond en visage, avec une humeur différente à chaque fois.",
      duree: 15
    },
    {
      id: "sam-15",
      titre: "L’affiche d’un film qui n’existe pas",
      consigne: "Invente le titre d’un film et dessine son affiche : une grande image, le titre en grosses lettres et une phrase d’accroche.",
      etapes: [
        "5 min : invente ton titre (astuce : un objet et un moment, comme « La Théière de minuit ») et trace un grand rectangle vertical.",
        "15 min : dessine l’image principale en grand, au centre : un personnage, un lieu ou un objet mystérieux.",
        "10 min : dessine le titre en grosses lettres, puis ajoute une phrase d’accroche et des noms d’acteurs inventés."
      ],
      materiel: "Crayon et papier",
      siBloque: "Écris le titre en grosses lettres et dessine un seul objet au milieu de l’affiche.",
      duree: 30
    }
  ]
};

/* ------------------------------------------------------------------ */
/* DIMANCHE — Libre                                                    */
/* ------------------------------------------------------------------ */
DDJ.themes[0] = {
  cle: "libre",
  jour: "Dimanche",
  nom: "Libre",
  description: "Des propositions douces et ouvertes pour dessiner à ton rythme, sans autre but que le plaisir.",
  exercices: [
    {
      id: "dim-01",
      titre: "Rejoue ton exercice préféré",
      consigne: "Reprends l’exercice de la semaine que tu as eu le plus de plaisir à faire et refais-le tranquillement, en changeant une seule chose : le sujet, le format ou l’outil.",
      etapes: [
        "3 min : feuillette tes dessins de la semaine et choisis celui qui t’a fait le plus plaisir.",
        "12 min : refais-le à ton rythme, en changeant un seul élément.",
        "5 min : pose les deux versions côte à côte et note en un mot ce que tu as découvert."
      ],
      materiel: "Crayon, papier, tes dessins de la semaine",
      siBloque: "Rien dessiné cette semaine ? Aucun souci : dessine l’objet le plus proche de ta main.",
      duree: 20
    },
    {
      id: "dim-02",
      titre: "Un moment de ta journée",
      consigne: "Choisis un petit moment d’aujourd’hui (un café, une promenade, un coup de fil) et dessine-le comme dans un journal de bord.",
      etapes: [
        "3 min : repasse ta journée dans ta tête et arrête-toi sur un moment, même minuscule.",
        "12 min : dessine la scène simplement : le lieu, toi, et l’objet qui compte.",
        "5 min : ajoute la date et une courte phrase en légende."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine seulement l’objet qui résume ce moment : une tasse, une chaussure, un téléphone.",
      duree: 20
    },
    {
      id: "dim-03",
      titre: "Dessin en musique",
      consigne: "Mets un morceau que tu aimes et laisse ton crayon danser dessus : pas de sujet, seulement des lignes, des points et des rythmes.",
      etapes: [
        "2 min : choisis ta musique, pose le crayon sur la feuille et écoute les premières mesures.",
        "10 min : laisse ta main suivre le son : de longues lignes pour les notes tenues, des points pour les percussions, des boucles pour la mélodie.",
        "3 min : regarde ce qui est apparu et repasse sur les passages que tu aimes."
      ],
      materiel: "Crayon, papier, de la musique",
      siBloque: "Trace une seule ligne continue qui monte quand la musique monte et redescend avec elle.",
      duree: 15
    },
    {
      id: "dim-04",
      titre: "Page de carnet libre",
      consigne: "Remplis une page entière de petits dessins sans aucun rapport entre eux, au fil de tes idées. Pas de plan, pas de gomme : une chose en amène une autre.",
      etapes: [
        "5 min : dessine dans un coin la première chose qui te passe par la tête.",
        "20 min : continue de proche en proche, un petit dessin après l’autre, jusqu’à ce que la page soit bien remplie.",
        "5 min : relie le tout avec des motifs, des étoiles, des flèches ou un titre."
      ],
      materiel: "Crayon ou stylo, papier",
      siBloque: "Remplis la page de formes simples (ronds, étoiles, spirales) jusqu’à ce qu’une idée arrive.",
      duree: 30
    },
    {
      id: "dim-05",
      titre: "La vue depuis ton fauteuil",
      consigne: "Installe-toi confortablement et dessine exactement ce que tu vois de là où tu es, en commençant par tes propres jambes ou tes pieds en bas de la feuille.",
      etapes: [
        "3 min : cale-toi bien et repère trois choses : tes pieds, ce qui est juste devant, ce qui est au fond.",
        "12 min : dessine tes jambes ou tes pieds en bas de la page, puis ce qu’il y a au-delà.",
        "5 min : ajoute les détails qui racontent ce dimanche : un plaid, une tasse, un livre ouvert."
      ],
      materiel: "Crayon, papier, un support rigide pour dessiner sur tes genoux",
      siBloque: "Dessine uniquement tes deux pieds, en chaussettes si tu veux.",
      duree: 20
    },
    {
      id: "dim-06",
      titre: "Tes constellations",
      consigne: "Sème des points au hasard sur la feuille, comme des étoiles, puis relie-les pour inventer tes propres constellations. Rien à réussir : c’est un dessin pour se vider la tête.",
      etapes: [
        "3 min : pose une trentaine de points sur toute la page, sans réfléchir, certains gros et d’autres tout petits.",
        "12 min : relie tranquillement les points voisins par des traits droits, jusqu’à voir apparaître des figures : un animal, un objet, un personnage.",
        "5 min : donne un nom à chaque constellation, écris-le à côté et fonce le ciel autour de ta préférée."
      ],
      materiel: "Crayon ou stylo, papier",
      siBloque: "Pose dix points seulement et relie-les tous d’une seule ligne en zigzag : c’est ta première constellation.",
      duree: 20
    },
    {
      id: "dim-07",
      titre: "Une carte pour quelqu’un",
      consigne: "Pense à une personne que tu aimes et dessine-lui une petite carte : quelque chose qui lui ressemble ou qui la ferait sourire.",
      etapes: [
        "3 min : choisis la personne, trace un rectangle de la taille d’une carte postale et trouve ton idée.",
        "12 min : dessine ce qui te fait penser à elle : un objet, un animal, un souvenir commun.",
        "5 min : ajoute un petit mot et, si le cœur t’en dit, envoie-lui une photo de ta carte."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine un soleil ou une fleur et écris son prénom en belles lettres.",
      duree: 20
    },
    {
      id: "dim-08",
      titre: "Ta semaine en sept petites cases",
      consigne: "Dessine un souvenir par jour de la semaine écoulée, dans sept petites cases : un repas, une rencontre, la météo, une chose vue en passant.",
      etapes: [
        "5 min : trace sept cases, écris le nom des jours et retrouve un souvenir pour chacun.",
        "20 min : fais un petit dessin par case, un peu moins de trois minutes chacun.",
        "5 min : décore le cadre de la case qui te fait le plus sourire."
      ],
      materiel: "Crayon et papier",
      siBloque: "Si un jour ne te revient pas, dessine simplement le temps qu’il faisait.",
      duree: 30
    },
    {
      id: "dim-09",
      titre: "Un mot que tu aimes",
      consigne: "Choisis un mot qui te fait du bien (un prénom, un lieu, une saison, un plat) et dessine-le en grosses lettres, en décorant chacune à ta façon. Ce n’est pas un exercice d’écriture : les lettres peuvent pencher, grossir ou danser.",
      etapes: [
        "2 min : choisis ton mot et écris-le légèrement en grandes capitales, bien espacées, sur toute la largeur de la feuille.",
        "8 min : épaissis chaque lettre en traçant un contour tout autour de ton premier trait, comme si elle avait gonflé.",
        "5 min : ajoute dans les lettres ou autour ce que le mot t’évoque : des vagues, des feuilles, des étoiles, des miettes."
      ],
      materiel: "Crayon et papier",
      siBloque: "Choisis un mot de trois ou quatre lettres et repasse simplement plusieurs fois sur chacune pour l’épaissir.",
      duree: 15
    },
    {
      id: "dim-10",
      titre: "Un souvenir d’enfance",
      consigne: "Dessine de mémoire quelque chose de ton enfance : un jouet, ta chambre, une cuisine, une cour de récréation. Les trous de mémoire font partie du dessin.",
      etapes: [
        "5 min : ferme les yeux, laisse venir un souvenir et note trois détails qui te reviennent.",
        "15 min : dessine la scène ou l’objet, en commençant par ce dont tu te souviens le mieux.",
        "10 min : ajoute les détails autour (un motif, un meuble, une lumière) et écris en légende l’âge que tu avais."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine seulement ton jouet ou ton doudou préféré, tel que tu t’en souviens.",
      duree: 30
    },
    {
      id: "dim-11",
      titre: "Dans les pas d’un dessin que tu aimes",
      consigne: "Choisis chez toi une image dessinée qui te plaît (une case de bande dessinée, un livre illustré, une pochette de disque) et copie un morceau de cette image pour voir comment c’est fait.",
      etapes: [
        "3 min : choisis l’image et repère la petite zone qui t’attire le plus.",
        "12 min : recopie cette zone en observant les traits : épais ou fins, rapides ou appliqués.",
        "5 min : note dans un coin une astuce que tu as remarquée et que tu pourrais réutiliser."
      ],
      materiel: "Crayon, papier, une image dessinée que tu as chez toi",
      siBloque: "Recopie seulement un visage ou un objet de l’image, en grand.",
      duree: 20
    },
    {
      id: "dim-12",
      titre: "Le sujet tiré au sort",
      consigne: "Écris six idées de dessin sur de petits papiers, plie-les, puis pioche au hasard et dessine ce qui sort. Les cinq autres attendront un prochain dimanche.",
      etapes: [
        "5 min : écris six idées sur six papiers : un objet, un animal, un lieu, une personne, un souvenir, une envie.",
        "12 min : pioche un papier et dessine ce qu’il dit, à ta façon.",
        "3 min : range les autres papiers dans une enveloppe pour un prochain dimanche."
      ],
      materiel: "Crayon, papier, six petits bouts de papier",
      siBloque: "Pioche un deuxième papier et choisis celui des deux qui t’inspire le plus.",
      duree: 20
    },
    {
      id: "dim-13",
      titre: "Ton humeur en dessin",
      consigne: "Dessine comment tu te sens aujourd’hui, non pas avec un visage mais sous la forme d’une météo, d’un animal ou d’un paysage.",
      etapes: [
        "2 min : demande-toi comment tu vas, puis choisis ta forme : météo, animal ou paysage.",
        "10 min : dessine-la sans chercher à expliquer, en laissant venir les détails.",
        "3 min : donne un titre à ton dessin et écris la date."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine un bonhomme avec sa météo au-dessus de la tête : soleil, nuage ou averse.",
      duree: 15
    },
    {
      id: "dim-14",
      titre: "Le dessin qui continue",
      consigne: "Retrouve un dessin laissé en plan, ou une page où il reste de la place, et prolonge-le : un décor, des ombres, un deuxième personnage, une suite.",
      etapes: [
        "3 min : choisis le dessin et regarde ce qui pourrait arriver autour ou après.",
        "12 min : prolonge-le sans effacer ce qui est déjà là.",
        "5 min : ajoute la date du jour à côté de l’ancienne, s’il y en a une."
      ],
      materiel: "Crayon, papier, un ancien dessin",
      siBloque: "Ajoute simplement un sol et une ombre sous ce qui est déjà dessiné.",
      duree: 20
    },
    {
      id: "dim-15",
      titre: "Quinze minutes, zéro consigne",
      consigne: "Aujourd’hui, c’est toi qui décides de tout : le sujet, l’outil, le format. La seule règle est de poser le crayon sur la feuille.",
      etapes: [
        "3 min : installe-toi, respire et laisse venir une envie, même toute petite.",
        "10 min : dessine ce que tu veux, comme tu veux, sans rien corriger.",
        "2 min : écris la date dans un coin : tu as dessiné aujourd’hui, et c’est ce qui compte."
      ],
      materiel: "Ce que tu as sous la main",
      siBloque: "Regarde autour de toi et dessine la première chose ronde que tu vois.",
      duree: 15
    }
  ]
};

/* ------------------------------------------------------------------ */
/* GÉNÉRATEUR D’IMAGINATION                                            */
/* Un sujet + une espace + une contrainte = un titre de dessin.        */
/* Les contraintes sont invariables : elles vont avec tous les sujets. */
/* ------------------------------------------------------------------ */
DDJ.generateur = {
  sujets: [
    "un phare",
    "une théière",
    "des bottes",
    "un chat",
    "une baleine",
    "un vélo",
    "un château",
    "une cabane",
    "un robot",
    "une sorcière",
    "un dragon",
    "des lunettes",
    "un parapluie",
    "une montgolfière",
    "un escargot",
    "une bibliothèque",
    "un pirate",
    "des champignons",
    "un bateau à voiles",
    "une locomotive",
    "un hibou",
    "une boulangerie",
    "un astronaute",
    "des poissons rouges",
    "un arbre creux",
    "une caravane",
    "un jardinier",
    "une horloge",
    "un éléphant",
    "des pingouins",
    "un moulin à vent",
    "une grenouille",
    "un piano",
    "une fusée",
    "un renard",
    "des chaussettes",
    "un marché",
    "une grand-mère",
    "un sous-marin",
    "une île"
  ],
  contraintes: [
    "en pleine tempête",
    "sous la mer",
    "la nuit",
    "en version minuscule",
    "dans une bouteille",
    "sur la Lune",
    "au sommet d’une montagne",
    "dans la jungle",
    "sous la neige",
    "en plein désert",
    "dans les nuages",
    "au fond d’un jardin",
    "en l’an 3000",
    "au temps des dinosaures",
    "un jour de fête",
    "sous une pluie battante",
    "en version géante",
    "sur le dos d’une tortue",
    "au milieu d’un embouteillage",
    "en vacances à la plage",
    "dans un bocal",
    "à l’heure du goûter",
    "en plein déménagement",
    "dans la poche d’un géant",
    "à dessiner sans lever le crayon",
    "en croquis de trois minutes",
    "à dessiner de l’autre main",
    "en dix traits maximum",
    "à dessiner sans regarder la feuille",
    "uniquement en lignes droites",
    "à dessiner uniquement avec des ronds",
    "en ombres chinoises",
    "en vue aérienne",
    "à travers un trou de serrure",
    "sur toute la page",
    "à dessiner au stylo, sans gomme",
    "en pointillés",
    "façon bande dessinée",
    "sur un timbre-poste",
    "à l’envers"
  ]
};
