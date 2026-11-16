/* Dessin du jour — exercices de la semaine (lundi à jeudi).
   Script classique : tout est rangé dans window.DDJ.themes, indexé par Date.getDay(). */
window.DDJ = window.DDJ || {};
DDJ.themes = DDJ.themes || {};

/* ───────────── Lundi : Lignes et échauffement ───────────── */
DDJ.themes[1] = {
  cle: "lignes",
  jour: "Lundi",
  nom: "Lignes et échauffement",
  description: "Des jeux de traits, de formes et de gris pour réveiller la main et commencer la semaine en douceur.",
  exercices: [
    {
      id: "lun-01",
      titre: "Cent traits d’un seul geste",
      consigne: "Remplis une page de lignes tracées à main levée, d’un geste franc, sans règle. Elles n’ont pas à être droites : elles ont juste à être décidées.",
      etapes: [
        "5 min : place deux points sur la feuille et relie-les d’un seul geste, en bougeant tout le bras. Recommence une vingtaine de fois, dans toutes les directions.",
        "5 min : trace des séries de lignes parallèles, de plus en plus serrées, comme les cordes d’une guitare.",
        "5 min : termine par de grandes courbes et de grands arcs qui traversent toute la page."
      ],
      materiel: "Crayon et papier",
      siBloque: "Rapproche tes deux points : des traits courts sont déjà un très bon échauffement.",
      duree: 15
    },
    {
      id: "lun-02",
      titre: "La promenade du crayon",
      consigne: "Pose ton crayon sur la feuille et emmène-le en promenade sans jamais le lever. Ensuite, transforme ce gribouillis en vitrail en remplissant ses boucles.",
      etapes: [
        "5 min : trace une seule ligne continue qui se croise, tourne et revient, jusqu’à occuper toute la page.",
        "10 min : remplis les cases formées par les croisements : des hachures ici, des points là, du gris plein ailleurs.",
        "5 min : repasse sur les lignes que tu préfères pour les épaissir et donner du rythme à l’ensemble."
      ],
      materiel: "Crayon et papier",
      siBloque: "Fais une promenade plus courte, avec cinq ou six boucles seulement, et remplis-en trois.",
      duree: 20
    },
    {
      id: "lun-03",
      titre: "Ton nuancier de gris",
      consigne: "Fabrique ton propre nuancier, du gris le plus léger au noir le plus profond que ton crayon peut donner. Puis sers-t’en pour donner du volume à une simple boule.",
      etapes: [
        "5 min : dessine une bande de cinq cases. Laisse la première blanche et noircis la dernière au maximum.",
        "5 min : remplis les trois cases du milieu pour passer en douceur du clair au foncé.",
        "10 min : dessine un cercle et ombre-le avec tes cinq gris pour qu’il devienne une boule, sans oublier son ombre sur le sol."
      ],
      materiel: "Crayon à papier (HB ou 2B) et papier",
      siBloque: "Contente-toi de trois cases : blanc, gris moyen, noir. C’est déjà un nuancier.",
      duree: 20
    },
    {
      id: "lun-04",
      titre: "Patchwork de hachures",
      consigne: "Dessine une grille de neuf cases et remplis chacune avec une façon différente de hachurer. Tu obtiens une petite couverture en patchwork, entièrement faite de traits.",
      etapes: [
        "5 min : trace à main levée un grand carré divisé en neuf cases. Tant mieux si elles sont un peu de travers.",
        "10 min : remplis une case à la fois : traits droits, penchés, croisés, courbes, très serrés, très espacés, en petits paquets…",
        "5 min : invente tes propres hachures pour les dernières cases, puis fonce celles que tu veux faire ressortir."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Fais une grille de quatre cases : droit, penché, croisé, courbe.",
      duree: 20
    },
    {
      id: "lun-05",
      titre: "La main qui ne sait pas",
      consigne: "Aujourd’hui, c’est ton autre main qui dessine : celle avec laquelle tu n’écris pas. Le trait sera tremblé et hésitant, et c’est exactement ce qui le rend intéressant.",
      etapes: [
        "3 min : avec la main qui n’écrit pas, trace des lignes, des ronds et des zigzags pour faire connaissance.",
        "7 min : toujours avec cette main, dessine un objet simple posé devant toi : une tasse, une pomme, une lampe.",
        "5 min : redessine le même objet avec ta main habituelle, en essayant de garder la liberté du premier dessin."
      ],
      materiel: "Crayon et papier",
      siBloque: "Reste sur des formes simples : un rond, un carré, une étoile, une maison.",
      duree: 15
    },
    {
      id: "lun-06",
      titre: "Ronds, œufs et patates",
      consigne: "Remplis une page de cercles, d’ovales et de formes de patates, tracés d’un geste souple. Puis transforme-les en petites créatures.",
      etapes: [
        "5 min : trace des cercles de toutes les tailles en tournant plusieurs fois sur chacun, sans chercher le rond parfait.",
        "5 min : ajoute des ovales et des patates, dont certaines se chevauchent.",
        "5 min : donne-leur des yeux, des pattes, des antennes ou des chapeaux : chaque forme devient une bestiole."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine cinq grosses patates seulement et ajoute-leur juste deux yeux.",
      duree: 15
    },
    {
      id: "lun-07",
      titre: "Collection de textures",
      consigne: "Pars à la chasse aux matières autour de toi : bois, laine, pierre, cheveux, écorce d’orange, éponge… Traduis chacune en traits dans une petite case.",
      etapes: [
        "5 min : trace six cases et choisis six matières que tu peux voir et toucher près de toi.",
        "20 min : remplis chaque case en cherchant le trait qui évoque la matière : petits points, vagues, boucles, traits secs, gris frotté au doigt.",
        "5 min : note le nom de la matière sous chaque case et entoure ta texture préférée."
      ],
      materiel: "Crayon et papier",
      siBloque: "Limite-toi à trois matières très différentes : une lisse, une rugueuse, une douce.",
      duree: 30
    },
    {
      id: "lun-08",
      titre: "Le trait qui change d’humeur",
      consigne: "Une ligne peut être calme, furieuse, timide ou joyeuse. Dessine des humeurs uniquement avec des traits, sans rien représenter.",
      etapes: [
        "5 min : trace une ligne calme, une ligne en colère, une ligne timide et une ligne joyeuse, en changeant la vitesse et la pression du crayon.",
        "5 min : fais la même chose avec quatre autres humeurs de ton choix : fatiguée, pressée, rêveuse, grognon…",
        "5 min : choisis ton humeur du jour et remplis un petit carré avec les traits qui lui ressemblent."
      ],
      materiel: "Crayon et papier",
      siBloque: "Fais seulement deux lignes opposées : une très douce, une très nerveuse.",
      duree: 15
    },
    {
      id: "lun-09",
      titre: "L’autre moitié",
      consigne: "Trace un trait vertical au milieu de la feuille, dessine une demi-forme d’un côté, puis complète-la en miroir de l’autre côté. Les deux moitiés ne seront jamais tout à fait pareilles, et c’est ce qui rend le dessin vivant.",
      etapes: [
        "5 min : trace un trait vertical léger au milieu de la feuille. Le long de ce trait, dessine l’une sous l’autre la moitié d’un cœur, d’un vase et d’une feuille d’arbre, puis complète chacune en miroir.",
        "10 min : retourne la feuille ou prends-en une nouvelle, et recommence en grand avec un papillon, une ampoule ou un visage vu de face. Avance petit bout par petit bout : un morceau à gauche, le même à droite.",
        "5 min : repasse sur le contour complet de la forme que tu préfères et décore ses deux moitiés avec les mêmes motifs."
      ],
      materiel: "Crayon et papier",
      siBloque: "Plie la feuille en deux pour marquer le milieu et contente-toi d’un cœur, puis d’un vase.",
      duree: 20
    },
    {
      id: "lun-10",
      titre: "Les yeux sur l’objet, pas sur la feuille",
      consigne: "Dessine le contour d’une plante, d’une fourchette ou de tout objet aux formes découpées, sans jamais regarder ta feuille. Le dessin sera tout de travers, et ton œil aura énormément travaillé.",
      etapes: [
        "5 min : pose l’objet devant toi. Suis son contour des yeux, très lentement, pendant que ton crayon avance au même rythme, sans regarder la feuille.",
        "5 min : recommence avec un deuxième objet, ou avec le même sous un autre angle.",
        "10 min : fais un dernier dessin en t’autorisant quelques coups d’œil à la feuille, toujours d’un trait lent."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Choisis un objet très simple, comme une cuillère ou une feuille d’arbre, et fais un seul contour.",
      duree: 20
    },
    {
      id: "lun-11",
      titre: "La gomme dessine aussi",
      consigne: "Inverse les rôles : grise d’abord ta feuille au crayon, puis dessine en clair avec ta gomme. La lumière sort du gris.",
      etapes: [
        "5 min : couvre un rectangle grand comme ta main d’un gris moyen bien régulier, en couchant la mine du crayon.",
        "10 min : avec un coin de gomme, dessine en blanc : une lune et des étoiles, des éclairs, une fenêtre allumée, ce que tu veux.",
        "5 min : reprends le crayon pour foncer autour des zones claires et les faire briller davantage."
      ],
      materiel: "Crayon tendre (2B si possible), gomme et papier",
      siBloque: "Gomme simplement un rond blanc au milieu du gris : tu as dessiné une pleine lune.",
      duree: 20
    },
    {
      id: "lun-12",
      titre: "Rubans et collines",
      consigne: "Avec de simples lignes parallèles qui ondulent, tu peux faire gonfler la feuille. Dessine un paysage de bosses et de rubans uniquement avec des lignes.",
      etapes: [
        "5 min : trace une ligne ondulée d’un bord à l’autre de la feuille, puis d’autres qui la suivent en parallèle.",
        "10 min : dessine quelques ronds sur la page, puis fais passer des lignes par-dessus en les bombant, comme un drap posé sur des ballons.",
        "5 min : resserre les lignes dans les creux pour accentuer le relief."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Dessine un seul ruban : deux lignes ondulées parallèles, reliées par de petits traits.",
      duree: 20
    },
    {
      id: "lun-13",
      titre: "Mille façons de tenir un crayon",
      consigne: "Change ta façon de tenir le crayon et observe ce que cela fait au trait. C’est un terrain de jeu : chaque prise donne une écriture différente.",
      etapes: [
        "5 min : tiens ton crayon tout au bout, comme une baguette, et trace de grandes lignes légères.",
        "5 min : couche la mine sur le papier et dessine avec son côté : de larges traces grises et douces.",
        "5 min : dessine une même feuille d’arbre trois fois, avec trois prises différentes, et compare leurs caractères."
      ],
      materiel: "Crayon et papier",
      siBloque: "Teste seulement deux prises, près de la pointe puis tout au bout, sur de simples lignes.",
      duree: 15
    },
    {
      id: "lun-14",
      titre: "Tout en petits points",
      consigne: "Dessine une forme simple (une poire, un galet, un nuage) uniquement avec des points. Beaucoup de points serrés pour l’ombre, presque aucun pour la lumière.",
      etapes: [
        "5 min : esquisse très légèrement le contour de ta forme et décide d’où vient la lumière.",
        "20 min : pose tes points tranquillement : serrés du côté de l’ombre, de plus en plus espacés vers la lumière.",
        "5 min : ajoute l’ombre de la forme sur le sol, en points elle aussi, et gomme le contour du début."
      ],
      materiel: "Stylo ou feutre fin (ou crayon bien taillé), crayon et gomme pour l’esquisse, et papier",
      siBloque: "Dessine une forme plus petite, de la taille d’une pièce de monnaie : elle se remplit vite.",
      duree: 30
    },
    {
      id: "lun-15",
      titre: "Ton carrelage inventé",
      consigne: "Découpe ta feuille en zones et remplis chacune avec un motif répété : écailles, briques, vagues, damiers, spirales. C’est lent, répétitif et très reposant.",
      etapes: [
        "5 min : trace un cadre, puis divise-le en sept ou huit zones avec quelques lignes courbes.",
        "20 min : remplis chaque zone avec un motif différent, répété tranquillement jusqu’à ce qu’elle soit pleine.",
        "5 min : noircis quelques parties de motifs pour créer des contrastes et épaissis les frontières entre les zones."
      ],
      materiel: "Stylo ou crayon et papier",
      siBloque: "Divise la feuille en quatre zones seulement et utilise des motifs très simples : traits, points, ronds, croix.",
      duree: 30
    }
  ]
};

/* ───────────── Mardi : Objets du quotidien ───────────── */
DDJ.themes[2] = {
  cle: "objets",
  jour: "Mardi",
  nom: "Objets du quotidien",
  description: "Les objets qui t’entourent deviennent tes modèles : ils ne bougent pas et sont toujours disponibles.",
  exercices: [
    {
      id: "mar-01",
      titre: "Ta tasse préférée",
      consigne: "Pose ta tasse préférée devant toi et dessine-la telle que tu la vois de ta place. Pas la tasse en général : celle-ci, avec son anse et ses petits défauts.",
      etapes: [
        "5 min : esquisse légèrement la forme générale : un ovale pour l’ouverture, deux côtés, un fond arrondi.",
        "10 min : précise l’anse, l’épaisseur du bord et les détails qui la rendent unique (un motif, une ébréchure).",
        "5 min : ajoute l’ombre à l’intérieur de la tasse et celle qu’elle pose sur la table."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Dessine-la de profil, à hauteur d’yeux : un rectangle arrondi et une anse en forme d’oreille.",
      duree: 20
    },
    {
      id: "mar-02",
      titre: "Ton trousseau de clés",
      consigne: "Pose ton trousseau de clés sur la table et dessine-le comme il est tombé. Chaque clé a sa silhouette et ses dents : prends plaisir à ces petits détails.",
      etapes: [
        "5 min : repère la forme d’ensemble du tas, puis place l’anneau et chaque clé par des formes simples.",
        "10 min : dessine les clés une à une : la tête, la tige, puis les dents.",
        "5 min : ajoute le porte-clés, les reflets du métal et les petites ombres sous les clés."
      ],
      materiel: "Crayon et papier",
      siBloque: "Détache une seule clé et dessine-la en grand, bien à plat.",
      duree: 20
    },
    {
      id: "mar-03",
      titre: "Une chaussure qui a vécu",
      consigne: "Choisis une chaussure bien usée et dessine-la de trois quarts. Ses plis, ses lacets et ses bosses racontent tous les kilomètres parcourus.",
      etapes: [
        "5 min : esquisse la silhouette générale comme une grande forme simple, sans aucun détail.",
        "15 min : construis la chaussure : la semelle, l’ouverture, la languette, les œillets et le trajet des lacets.",
        "10 min : ajoute les plis, les coutures, les traces d’usure et l’ombre au sol."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Dessine-la strictement de profil et laisse tomber les lacets.",
      duree: 30
    },
    {
      id: "mar-04",
      titre: "L’inventaire de tes poches",
      consigne: "Vide tes poches, ton sac ou le vide-poche de l’entrée et dessine cinq trouvailles en petit, comme sur une planche de naturaliste. Chaque objet a droit à son étiquette.",
      etapes: [
        "3 min : choisis cinq petits objets et aligne-les devant toi.",
        "14 min : dessine-les l’un après l’autre, en petit, sans t’attarder plus de trois minutes sur chacun.",
        "3 min : écris le nom de chaque objet à côté, avec un mot sur son histoire si tu veux."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Dessine trois objets seulement, en ne gardant que leur contour.",
      duree: 20
    },
    {
      id: "mar-05",
      titre: "Fermé, puis ouvert",
      consigne: "Choisis un objet qui s’ouvre (une trousse, un étui à lunettes, une boîte à œufs, un livre) et dessine-le deux fois : fermé, puis ouvert, avec ce qu’il contient. Le même modèle, deux portraits très différents.",
      etapes: [
        "10 min : dessine l’objet fermé : sa forme d’ensemble, puis sa fermeture, ses charnières ou sa tranche.",
        "15 min : ouvre-le et redessine-le à côté : le couvercle ou le rabat relevé, l’intérieur et ce qui se trouve dedans.",
        "5 min : ajoute les ombres à l’intérieur et sous l’objet, sur les deux dessins."
      ],
      materiel: "Crayon, gomme, papier et un objet qui s’ouvre",
      siBloque: "Prends un livre et regarde-le d’en haut : fermé, c’est un simple rectangle ; ouvert à plat, deux rectangles côte à côte.",
      duree: 30
    },
    {
      id: "mar-06",
      titre: "Le même objet, trois vitesses",
      consigne: "Choisis un objet un peu compliqué (un arrosoir, un casque audio, une cafetière) et dessine-le trois fois, avec de plus en plus de temps. Sers-toi d’un minuteur.",
      etapes: [
        "2 min : dessine l’objet en entier, très vite, sans rien corriger.",
        "4 min : redessine-le en prenant le temps de vérifier les proportions.",
        "9 min : fais une troisième version posée, avec les détails et un peu d’ombre."
      ],
      materiel: "Crayon, papier et minuteur",
      siBloque: "Prends un objet plus simple, comme une bouteille, et garde le même jeu des trois temps.",
      duree: 15
    },
    {
      id: "mar-07",
      titre: "Un verre d’eau en pleine lumière",
      consigne: "Remplis un verre d’eau à moitié et pose-le près d’une fenêtre ou d’une lampe. Dessine ce que tu vois vraiment : des reflets, des déformations, des taches claires et sombres.",
      etapes: [
        "5 min : dessine la forme du verre et le niveau de l’eau, avec des ovales pour le bord, la surface et le fond.",
        "10 min : observe les zones sombres et les zones claires dans le verre et reporte-les comme les pièces d’un puzzle.",
        "5 min : ajoute l’ombre du verre sur la table et la tache de lumière qui la traverse souvent."
      ],
      materiel: "Crayon, gomme, papier et un verre d’eau",
      siBloque: "Vide le verre et dessine seulement sa forme et son ombre.",
      duree: 20
    },
    {
      id: "mar-08",
      titre: "Le torchon froissé",
      consigne: "Froisse un torchon ou un tee-shirt, laisse-le tomber sur la table et dessine ce paysage de plis. Regarde-le comme une petite chaîne de montagnes.",
      etapes: [
        "5 min : trace le contour général du tissu, puis les lignes des plis principaux.",
        "15 min : ombre les creux et laisse les crêtes en clair. Avance pli par pli, sans te presser.",
        "10 min : fonce les ombres les plus profondes, ajoute le motif ou les rayures s’il y en a, puis l’ombre sur la table."
      ],
      materiel: "Crayon, papier et un torchon ou un tee-shirt",
      siBloque: "Pose le tissu sur le dossier d’une chaise : il ne fera que deux ou trois grands plis faciles à suivre.",
      duree: 30
    },
    {
      id: "mar-09",
      titre: "Seulement les ombres",
      consigne: "Éclaire un objet de côté avec une lampe et dessine uniquement ses ombres, sans tracer aucun contour. L’objet apparaît tout seul, comme par magie.",
      etapes: [
        "5 min : installe l’objet et la lampe, puis plisse les yeux pour repérer les grandes zones d’ombre.",
        "10 min : remplis ces zones de gris, sans contour, en laissant le papier blanc là où la lumière touche.",
        "5 min : ajoute l’ombre projetée sur la table et fonce les endroits les plus sombres."
      ],
      materiel: "Crayon, papier et une lampe (ou la lampe du téléphone)",
      siBloque: "Choisis un objet tout simple, comme un œuf ou une orange, et dessine seulement son ombre sur la table.",
      duree: 20
    },
    {
      id: "mar-10",
      titre: "Dessiner le vide",
      consigne: "Ouvre une paire de ciseaux et dessine non pas les ciseaux, mais les vides : les trous des anneaux, l’espace entre les lames. Les ciseaux apparaîtront par surprise.",
      etapes: [
        "3 min : pose les ciseaux ouverts sur une feuille blanche et observe la forme des vides.",
        "7 min : dessine chaque vide comme une forme à part entière et grise-le.",
        "5 min : recommence avec un autre objet à trous : une tasse et son anse, un cintre, une pince à linge."
      ],
      materiel: "Crayon, papier et une paire de ciseaux",
      siBloque: "Dessine un seul vide : le trou de l’anse d’une tasse, en grand.",
      duree: 15
    },
    {
      id: "mar-11",
      titre: "De mémoire : ta brosse à dents",
      consigne: "Tu la vois tous les jours, mais saurais-tu la dessiner sans l’avoir sous les yeux ? Fais le test, puis va vérifier. Ce n’est pas un contrôle : c’est un jeu pour apprendre à regarder.",
      etapes: [
        "5 min : dessine ta brosse à dents de mémoire, avec tout ce dont tu te souviens.",
        "2 min : va la chercher et observe-la bien : qu’avais-tu oublié ou inventé ?",
        "8 min : dessine-la maintenant en la regardant, à côté du premier dessin."
      ],
      materiel: "Crayon et papier",
      siBloque: "Choisis un objet que tu connais encore mieux, comme ton téléphone ou ta télécommande.",
      duree: 15
    },
    {
      id: "mar-12",
      titre: "Au stylo, sans filet",
      consigne: "Dessine un ustensile de cuisine (fouet, tire-bouchon, râpe, passoire) directement au stylo. Impossible de gommer : chaque trait reste, et c’est très libérateur.",
      etapes: [
        "3 min : observe l’objet sans dessiner et suis ses formes du bout du doigt.",
        "9 min : dessine-le au stylo, lentement. Si un trait te déplaît, trace le bon à côté sans rien barrer.",
        "3 min : ajoute quelques hachures pour l’ombre et repasse le contour principal pour l’affirmer."
      ],
      materiel: "Stylo à bille ou feutre fin et papier",
      siBloque: "Prends un ustensile simple, comme une cuillère en bois, et dessine-le deux fois.",
      duree: 15
    },
    {
      id: "mar-13",
      titre: "Nature morte du petit-déjeuner",
      consigne: "Compose une petite scène avec trois objets du petit-déjeuner : un bol, un pot de confiture, une cuillère, un fruit… Dessine-les ensemble, comme une famille.",
      etapes: [
        "5 min : dispose trois objets de tailles différentes en les faisant se chevaucher un peu, puis esquisse le groupe comme une seule grande forme.",
        "15 min : dessine chaque objet en comparant sans cesse : lequel est le plus haut, le plus large, lequel passe devant ?",
        "10 min : pose les ombres, la ligne du bord de la table et les détails (étiquette, reflet, miettes)."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Garde deux objets seulement, l’un devant l’autre.",
      duree: 30
    },
    {
      id: "mar-14",
      titre: "Fais le tour de l’objet",
      consigne: "Choisis un objet qui change beaucoup selon l’angle (une théière, un fer à repasser, un jouet) et dessine-le sous trois angles : de face, de côté, de dessus.",
      etapes: [
        "7 min : dessine-le de face, à hauteur d’yeux.",
        "7 min : tourne-le d’un quart de tour et dessine-le de côté.",
        "6 min : lève-toi et dessine-le vu de dessus, comme sur une carte."
      ],
      materiel: "Crayon et papier",
      siBloque: "Fais deux vues seulement, de face et de dessus, avec un objet simple comme un bol.",
      duree: 20
    },
    {
      id: "mar-15",
      titre: "Très, très gros plan",
      consigne: "Choisis un détail minuscule d’un objet (une fermeture éclair, une vis, le bouchon d’un tube, une boucle de ceinture) et dessine-le en géant, sur toute la feuille.",
      etapes: [
        "5 min : observe ton détail de très près et esquisse-le en grand, jusqu’aux bords du papier.",
        "10 min : dessine tout ce que tu découvres : rainures, rayures, petites inscriptions, reliefs.",
        "5 min : ajoute des ombres pour donner du volume à ce petit monde."
      ],
      materiel: "Crayon et papier",
      siBloque: "Prends un bouton de vêtement : un rond, ses trous, son fil.",
      duree: 20
    }
  ]
};

/* ───────────── Mercredi : Personnages et gestes ───────────── */
DDJ.themes[3] = {
  cle: "personnages",
  jour: "Mercredi",
  nom: "Personnages et gestes",
  description: "Des corps, des visages et des gestes, en commençant par les modèles les plus patients : toi et les gens qui t’entourent.",
  exercices: [
    {
      id: "mer-01",
      titre: "Ta main, tout simplement",
      consigne: "Pose à plat sur la table la main qui ne dessine pas et fais son portrait. C’est le modèle le plus patient que tu auras jamais.",
      etapes: [
        "5 min : esquisse la forme générale : une moufle pour la paume et les doigts, un pouce sur le côté.",
        "10 min : dessine chaque doigt en observant ses trois parties, les articulations et les ongles.",
        "5 min : ajoute les plis, les veines ou une bague, puis l’ombre de la main sur la table."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Trace le contour de ta main posée sur la feuille, puis dessine les ongles et les plis à l’intérieur.",
      duree: 20
    },
    {
      id: "mer-02",
      titre: "Autoportrait au miroir, sans pression",
      consigne: "Installe-toi face à un miroir et dessine ton visage. La ressemblance n’a aucune importance : il s’agit seulement de te regarder avec curiosité, comme un modèle parmi d’autres.",
      etapes: [
        "5 min : trace un ovale pour la tête. Repère la ligne des yeux, à peu près à mi-hauteur, puis celles du nez et de la bouche.",
        "15 min : dessine les yeux, les sourcils, le nez, la bouche et les oreilles en vérifiant souvent dans le miroir.",
        "10 min : ajoute les cheveux comme une grande masse, le cou, les épaules et quelques ombres."
      ],
      materiel: "Crayon, gomme, papier et un miroir",
      siBloque: "Dessine seulement la moitié de ton visage, ou juste la forme de la tête et des cheveux.",
      duree: 30
    },
    {
      id: "mer-03",
      titre: "Bonshommes bâtons au quotidien",
      consigne: "Dessine dix bonshommes bâtons en train de faire des gestes de tous les jours : se brosser les dents, porter les courses, courir après le bus… Des traits simples, beaucoup de vie.",
      etapes: [
        "3 min : échauffe-toi avec trois bonshommes debout : un rond pour la tête, un trait pour le dos, des bâtons pour les bras et les jambes, sans oublier les coudes et les genoux.",
        "9 min : dessine dix actions du quotidien, un peu moins d’une minute chacune.",
        "3 min : choisis ton préféré et ajoute-lui des mains, des pieds et un accessoire."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Dessine cinq bonshommes seulement : debout, assis, qui marche, qui court, qui saute.",
      duree: 15
    },
    {
      id: "mer-04",
      titre: "Dix têtes, dix humeurs",
      consigne: "Avec un rond, deux sourcils, deux yeux et une bouche, on peut tout exprimer. Dessine dix petits visages très simples, chacun avec une émotion différente.",
      etapes: [
        "3 min : trace dix ronds de la taille d’une grosse pièce de monnaie.",
        "9 min : donne à chacun une humeur : joyeux, furieux, surpris, endormi, méfiant, amoureux, dégoûté… Joue surtout avec les sourcils et la bouche.",
        "3 min : écris l’humeur sous chaque tête et ajoute une coiffure ou un chapeau à celles qui te font sourire."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Fais quatre têtes : contente, triste, en colère, surprise.",
      duree: 15
    },
    {
      id: "mer-05",
      titre: "Tes pieds, vus d’en haut",
      consigne: "Assieds-toi, étends les jambes et dessine tes pieds tels que tu les vois de là-haut, nus ou en chaussettes. C’est un point de vue que tu es la seule personne à connaître.",
      etapes: [
        "5 min : place les deux pieds par des formes simples, comme deux triangles arrondis, ainsi que le bas des jambes.",
        "10 min : dessine les orteils (ou les plis des chaussettes), les chevilles et le bas du pantalon.",
        "5 min : ajoute les ombres entre les pieds et sur le sol, et quelques détails : motif des chaussettes, ongles, tapis."
      ],
      materiel: "Crayon et papier sur un support rigide",
      siBloque: "Garde tes chaussons ou tes chaussures et dessine un seul pied.",
      duree: 20
    },
    {
      id: "mer-06",
      titre: "Croquis en douce",
      consigne: "Quelqu’un chez toi lit, cuisine ou regarde un écran ? Croque cette personne (ou ton animal) en quelques traits, sans la déranger. Si ton modèle bouge, commence simplement un nouveau croquis.",
      etapes: [
        "5 min : fais deux croquis très rapides de la posture entière : la tête, la ligne du dos, les bras, les jambes.",
        "7 min : fais un troisième croquis un peu plus posé, en précisant la silhouette et les vêtements.",
        "3 min : ajoute ce sur quoi ton modèle est installé : fauteuil, table, coussin."
      ],
      materiel: "Crayon et papier sur un support rigide",
      siBloque: "S’il n’y a personne chez toi ou si tout le monde bouge trop, pars d’une photo de ton téléphone où quelqu’un est assis.",
      duree: 15
    },
    {
      id: "mer-07",
      titre: "Silhouettes de mémoire",
      consigne: "Repense à des gens croisés aujourd’hui ou cette semaine : la boulangère, un cycliste, une voisine avec son chien. Dessine-les de mémoire en silhouettes pleines, comme des ombres chinoises.",
      etapes: [
        "5 min : fais la liste de cinq personnes croisées et retrouve pour chacune une posture ou un accessoire marquant.",
        "10 min : dessine chaque silhouette en petit, puis remplis-la entièrement de gris ou de noir.",
        "5 min : ajoute un sol et un détail reconnaissable pour chacune : un sac, un chapeau, un vélo, un parapluie."
      ],
      materiel: "Crayon tendre ou feutre et papier",
      siBloque: "Dessine deux silhouettes seulement : une personne debout et une personne qui marche.",
      duree: 20
    },
    {
      id: "mer-08",
      titre: "Ton œil, de très près",
      consigne: "Approche-toi d’un miroir et dessine un seul de tes yeux, en grand. Tu vas y découvrir une foule de détails que tu n’avais jamais remarqués.",
      etapes: [
        "5 min : dessine la forme de l’œil ouvert (une amande, rarement symétrique), puis l’iris, en partie caché par la paupière du haut.",
        "10 min : ajoute la pupille, le petit reflet blanc, le pli de la paupière, les cils et le sourcil.",
        "5 min : ombre légèrement le blanc de l’œil dans les coins et fonce l’iris en préservant le reflet."
      ],
      materiel: "Crayon, gomme, papier et un petit miroir",
      siBloque: "Dessine seulement l’amande, l’iris et la pupille, et garde les cils pour une autre fois.",
      duree: 20
    },
    {
      id: "mer-09",
      titre: "Ta main fait du théâtre",
      consigne: "Ta main libre prend trois poses : un poing fermé, un doigt qui pointe, une pince qui tient un petit objet. Cinq minutes par pose, pas une de plus.",
      etapes: [
        "5 min : serre le poing et dessine-le comme un gros caillou avec ses bosses.",
        "5 min : pointe l’index vers toi ou vers le côté et dessine cette main qui montre.",
        "5 min : tiens une gomme ou un bouchon entre le pouce et l’index et dessine cette pince."
      ],
      materiel: "Crayon, papier, minuteur et un petit objet à tenir (gomme, bouchon)",
      siBloque: "Fais deux poses seulement, en commençant chaque fois par une forme de moufle.",
      duree: 15
    },
    {
      id: "mer-10",
      titre: "Le bonhomme en boîtes",
      consigne: "Construis un personnage debout avec des formes simples : un œuf pour la tête, des boîtes pour le torse et le bassin, des tubes pour les bras et les jambes. Comme un mannequin en bois.",
      etapes: [
        "5 min : trace une ligne verticale et divise-la en sept parts à peu près égales : un adulte mesure environ sept fois la hauteur de sa tête.",
        "10 min : place l’œuf de la tête tout en haut, puis la boîte du torse, celle du bassin et les tubes des bras et des jambes. Les coudes arrivent à peu près à la taille.",
        "5 min : arrondis les angles, ajoute des mains et des pieds simples, et habille ton mannequin si tu en as envie."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Saute les mesures : empile un œuf, deux boîtes et quatre tubes, c’est déjà un mannequin.",
      duree: 20
    },
    {
      id: "mer-11",
      titre: "Prends la pose, puis dessine-la",
      consigne: "C’est toi le modèle : lève-toi, prends une pose pendant trente secondes en sentant où se trouve ton poids, puis reviens la dessiner de mémoire. Ton corps se souvient souvent mieux que tes yeux.",
      etapes: [
        "5 min : prends une pose simple (bras croisés, main sur la hanche), puis dessine-la en bonhomme simplifié.",
        "10 min : enchaîne trois poses plus expressives : tu t’étires, tu attrapes un objet en hauteur, tu portes un carton lourd.",
        "5 min : choisis la pose la plus vivante et redessine-la en plus grand, en donnant de l’épaisseur aux bras et aux jambes."
      ],
      materiel: "Crayon et papier",
      siBloque: "Fais une seule pose, devant un miroir si tu en as un, et dessine-la en bonhomme bâton.",
      duree: 20
    },
    {
      id: "mer-12",
      titre: "Quelqu’un que tu aimes, de mémoire",
      consigne: "Pense à une personne qui compte pour toi et dessine-la de mémoire. Ne cherche pas la ressemblance : cherche ce qui fait que c’est elle (une coiffure, des lunettes, une façon de se tenir).",
      etapes: [
        "5 min : ferme les yeux et retrouve trois choses qui la caractérisent. Note-les dans un coin de la feuille.",
        "10 min : dessine son visage ou sa silhouette en t’appuyant sur ces trois choses.",
        "5 min : ajoute un objet ou un décor qui va avec elle : son fauteuil, sa tasse, son jardin, son instrument."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine-la de dos ou de loin : la coiffure, la silhouette et les vêtements suffisent.",
      duree: 20
    },
    {
      id: "mer-13",
      titre: "Une photo de ton téléphone",
      consigne: "Cherche dans ton téléphone une photo où l’on voit une personne en entier, debout ou en mouvement. Dessine sa posture, pas son portrait.",
      etapes: [
        "5 min : trace la ligne générale du corps, de la tête aux pieds, puis place la tête, les épaules et le bassin.",
        "15 min : construis les bras et les jambes, puis les mains, les pieds et les vêtements avec leurs plis principaux.",
        "10 min : suggère le visage en quelques traits, ajoute l’ombre au sol et un morceau du décor."
      ],
      materiel: "Crayon, gomme, papier et une photo de ton téléphone",
      siBloque: "Choisis une photo où la personne est de dos ou de loin, et dessine seulement sa silhouette.",
      duree: 30
    },
    {
      id: "mer-14",
      titre: "Autoportrait sans regarder la feuille",
      consigne: "Face au miroir, dessine ton visage sans jamais regarder ta feuille et sans lever le crayon. Le résultat sera drôle et tordu : c’est le but, et il est souvent étonnamment vivant.",
      etapes: [
        "5 min : fixe ton reflet et laisse le crayon suivre lentement ce que ton œil parcourt : contour du visage, yeux, nez, bouche.",
        "5 min : recommence sur une autre partie de la feuille, en allant encore plus lentement.",
        "5 min : fais un troisième portrait en t’autorisant trois coups d’œil à la feuille, pas un de plus."
      ],
      materiel: "Stylo ou crayon, papier et un miroir",
      siBloque: "Fais un seul portrait à l’aveugle, en commençant par un œil : un essai suffit largement.",
      duree: 15
    },
    {
      id: "mer-15",
      titre: "Un personnage, trois âges",
      consigne: "Invente un personnage très simple et dessine-le à trois âges de sa vie : enfant, adulte, puis très âgé. Garde un détail qui permet de le reconnaître à chaque fois : une écharpe, des lunettes, une mèche de cheveux.",
      etapes: [
        "5 min : trace trois silhouettes debout, en bonshommes simplifiés : l’enfant, plus petit, avec une tête plus grosse par rapport au corps ; l’adulte ; puis la personne âgée, un peu voûtée.",
        "15 min : donne-leur de l’épaisseur et des vêtements, puis dessine les visages : des joues rondes pour l’enfant, quelques rides et des cheveux plus rares pour la personne âgée.",
        "10 min : ajoute à chacun le détail qui permet de le reconnaître, puis un objet de son âge : un ballon, un sac, une canne."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Dessine seulement deux âges, enfant et adulte, en bonshommes bâtons : une grosse tête sur un petit corps, puis une petite tête sur un grand corps.",
      duree: 30
    }
  ]
};

/* ───────────── Jeudi : Espaces et perspective ───────────── */
DDJ.themes[4] = {
  cle: "espaces",
  jour: "Jeudi",
  nom: "Espaces et perspective",
  description: "Pièces, meubles, rues et boîtes : donne de la profondeur à tes dessins, pas à pas et à main levée.",
  exercices: [
    {
      id: "jeu-01",
      titre: "Une boîte sous trois angles",
      consigne: "Prends une boîte (céréales, chaussures, mouchoirs) et dessine-la trois fois en la tournant un peu à chaque fois. Presque tout ce qui nous entoure peut se ramener à une boîte.",
      etapes: [
        "5 min : pose la boîte de trois quarts et dessine ses trois faces visibles. Remarque que les bords qui s’éloignent de toi se resserrent légèrement.",
        "8 min : tourne-la un peu et recommence, puis dessine-la une troisième fois en la couchant.",
        "7 min : sur chaque boîte, ombre une face en gris moyen et une autre en gris foncé : le volume apparaît."
      ],
      materiel: "Crayon, papier et une boîte en carton",
      siBloque: "Dessine un seul angle : la face de devant comme un rectangle, puis le dessus et un côté qui partent en biais.",
      duree: 20
    },
    {
      id: "jeu-02",
      titre: "Le coin de la pièce",
      consigne: "Regarde un angle de la pièce, là où deux murs rencontrent le plafond ou le sol. Trois lignes suffisent à créer un espace : dessine ce coin et ce qui s’y trouve.",
      etapes: [
        "5 min : trace la ligne verticale du coin, puis les lignes du sol ou du plafond qui en partent. Pour juger leur pente, tends ton crayon à bout de bras et aligne-le sur elles.",
        "10 min : ajoute ce qui occupe le coin : une plante, un lampadaire, une étagère, un cadre au mur.",
        "5 min : grise un des deux murs pour le distinguer de l’autre et ajoute les ombres au sol."
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine seulement les trois lignes du coin et un objet posé par terre.",
      duree: 20
    },
    {
      id: "jeu-03",
      titre: "La vue par ta fenêtre",
      consigne: "Installe-toi devant une fenêtre et dessine ce que tu vois dehors, cadre compris. S’il fait nuit, dessine les fenêtres allumées et les lumières.",
      etapes: [
        "5 min : dessine le cadre de la fenêtre, puis les grandes lignes de la vue : la limite du ciel, les masses des bâtiments ou des arbres.",
        "15 min : détaille du plus proche au plus lointain. Appuie davantage ton trait sur ce qui est près et allège-le pour ce qui est loin.",
        "10 min : ajoute le rebord, la poignée ou un bout de rideau, puis quelques ombres pour séparer les plans."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Choisis un seul élément de la vue (un toit, un arbre, un lampadaire) et dessine-le dans le cadre de la fenêtre.",
      duree: 30
    },
    {
      id: "jeu-04",
      titre: "Le couloir qui s’enfuit",
      consigne: "Dessine un couloir, le tien ou un couloir inventé, grâce à une astuce toute simple : les lignes qui s’éloignent de toi se dirigent toutes vers un même point, qu’on appelle le point de fuite.",
      etapes: [
        "5 min : dessine un petit rectangle au milieu de la feuille (le mur du fond) et marque un point en son centre : c’est ton point de fuite.",
        "8 min : depuis ce point, trace quatre lignes qui passent par les coins du rectangle et filent jusqu’aux bords de la feuille. Le sol, les murs et le plafond sont là.",
        "7 min : ajoute des portes, un tapis ou des cadres, en dirigeant vers le point de fuite toutes les lignes qui s’enfoncent dans le couloir."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Arrête-toi au rectangle et aux quatre lignes : tu as déjà un couloir en profondeur.",
      duree: 20
    },
    {
      id: "jeu-05",
      titre: "Ta rue, de mémoire",
      consigne: "Sans aller voir, dessine ta rue ou une rue que tu connais par cœur, comme si tu étais sur le trottoir. Les trous de mémoire font partie du jeu : remplis-les à ta façon.",
      etapes: [
        "3 min : ferme les yeux et parcours la rue en pensée. Note cinq choses dont tu te souviens bien.",
        "9 min : dessine la chaussée qui se resserre vers le fond, puis les façades de chaque côté, de plus en plus petites.",
        "3 min : ajoute tes cinq souvenirs : une enseigne, un arbre, une boîte aux lettres, une voiture garée…"
      ],
      materiel: "Crayon et papier",
      siBloque: "Dessine une seule façade, bien de face : la porte d’entrée de ton immeuble ou de ta maison.",
      duree: 15
    },
    {
      id: "jeu-06",
      titre: "Une chaise, pour de vrai",
      consigne: "La chaise est un grand classique : simple en apparence, pleine de surprises. Places-en une de trois quarts, à deux mètres de toi, et dessine-la en commençant par une boîte.",
      etapes: [
        "5 min : dessine légèrement une boîte qui contiendrait l’assise et les pieds, puis un panneau dressé pour le dossier.",
        "15 min : dans cette boîte, place l’assise, les quatre pieds (ceux du fond s’arrêtent plus haut sur ta feuille) et le dossier.",
        "10 min : donne de l’épaisseur aux pieds et à l’assise, gomme la boîte et ajoute l’ombre sur le sol."
      ],
      materiel: "Crayon, gomme, papier et une chaise",
      siBloque: "Dessine un tabouret, ou la chaise vue bien de côté, comme la lettre h.",
      duree: 30
    },
    {
      id: "jeu-07",
      titre: "Le plan de chez toi",
      consigne: "Dessine ton logement, ou juste une pièce, vu de dessus, comme un plan d’architecte ou une carte au trésor. Aucune mesure : tout se fait de tête et à l’œil.",
      etapes: [
        "5 min : trace les murs et place les portes et les fenêtres.",
        "10 min : ajoute les meubles vus de dessus : des rectangles pour les lits et les tables, des ronds pour les tabourets et les plantes.",
        "5 min : écris le nom des lieux, trace en pointillé ton trajet du matin et marque d’une croix ton endroit préféré."
      ],
      materiel: "Crayon ou stylo et papier",
      siBloque: "Fais le plan d’une seule pièce, celle où tu te trouves.",
      duree: 20
    },
    {
      id: "jeu-08",
      titre: "Près, moyen, loin",
      consigne: "Aligne trois objets sur une table : un tout près de toi, un au milieu, un au fond. Dessine-les en observant deux astuces de profondeur : ce qui est loin paraît plus petit, et ce qui est devant cache ce qui est derrière.",
      etapes: [
        "3 min : dispose tes objets en profondeur, en les décalant pour qu’ils se chevauchent un peu.",
        "9 min : dessine d’abord l’objet le plus proche, en grand, puis les deux autres, plus petits et placés plus haut sur la feuille.",
        "3 min : appuie le trait de l’objet proche, allège celui du fond et ajoute le bord de la table."
      ],
      materiel: "Crayon et papier",
      siBloque: "Utilise trois objets identiques (trois verres, trois fruits) : la différence de taille saute aux yeux.",
      duree: 15
    },
    {
      id: "jeu-09",
      titre: "Par la porte entrouverte",
      consigne: "Place-toi dans une pièce et dessine ce que tu vois d’une autre pièce par l’ouverture de la porte. C’est un tableau dans le tableau, avec un premier plan et une échappée.",
      etapes: [
        "5 min : dessine l’encadrement de la porte comme un grand rectangle vertical, avec la porte ouverte sur le côté.",
        "15 min : dessine ce qui apparaît dans l’ouverture : un bout de sol, un meuble coupé par le cadre, une fenêtre au fond.",
        "10 min : grise le mur autour de la porte pour que la pièce du fond paraisse lumineuse, puis ajoute la poignée et les plinthes."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Dessine seulement l’encadrement et un seul meuble visible derrière.",
      duree: 30
    },
    {
      id: "jeu-10",
      titre: "Une ville de boîtes",
      consigne: "Invente une petite ville faite de simples boîtes, vue depuis le coin d’une rue. L’astuce : deux points de fuite, un à gauche et un à droite, vers lesquels filent toutes les lignes horizontales des façades.",
      etapes: [
        "5 min : trace une ligne d’horizon au milieu de la feuille et marque un point à chacune de ses extrémités. Dessine un trait vertical au centre : c’est l’arête du premier immeuble.",
        "15 min : relie le haut et le bas de cette arête aux deux points, puis ferme les côtés par deux verticales. Ajoute d’autres immeubles de la même façon, de hauteurs variées.",
        "10 min : dessine les fenêtres et les portes en suivant les mêmes directions, puis grise toutes les faces d’un même côté."
      ],
      materiel: "Crayon, gomme et papier (une règle si tu y tiens)",
      siBloque: "Dessine un seul immeuble : une arête verticale, quatre lignes vers les deux points, deux verticales pour fermer.",
      duree: 30
    },
    {
      id: "jeu-11",
      titre: "Le monde vu du sol",
      consigne: "Assieds-toi par terre et dessine la pièce depuis cette hauteur : les pieds de table deviennent des piliers, le dessous des meubles se révèle. Changer de point de vue, c’est déjà de la perspective.",
      etapes: [
        "5 min : installe-toi au sol et trace la ligne où le sol rencontre le mur d’en face.",
        "10 min : dessine les meubles tels qu’ils apparaissent d’en bas : grands pieds au premier plan, dessous de chaise, plateau de table réduit à un trait.",
        "5 min : ajoute ce qui traîne au ras du sol (chaussons, câbles, jouets, moutons de poussière) et quelques ombres."
      ],
      materiel: "Crayon et papier sur un support rigide",
      siBloque: "Dessine un seul meuble vu d’en bas, par exemple une chaise ou une table basse.",
      duree: 20
    },
    {
      id: "jeu-12",
      titre: "Un escalier, marche après marche",
      consigne: "Dessine un escalier : le tien si tu en as un, sinon fabriques-en un en empilant quatre ou cinq livres décalés. Un escalier, c’est une boîte répétée en zigzag.",
      etapes: [
        "5 min : place-toi un peu de côté et trace le zigzag du profil des marches : un trait vertical, un trait horizontal, et ainsi de suite.",
        "10 min : depuis chaque angle du zigzag, tire des lignes parallèles vers le fond pour donner leur largeur aux marches, puis ferme-les de l’autre côté.",
        "5 min : grise les parties verticales des marches et laisse le dessus en clair."
      ],
      materiel: "Crayon, papier (et quelques livres si tu n’as pas d’escalier)",
      siBloque: "Dessine trois marches seulement, vues bien de profil, comme un zigzag.",
      duree: 20
    },
    {
      id: "jeu-13",
      titre: "Des ronds qui s’aplatissent",
      consigne: "Vu d’en haut, le bord d’un verre est un rond ; à hauteur d’yeux, il devient un simple trait. Entre les deux, c’est un ovale plus ou moins ouvert. Vérifie-le avec un vrai verre.",
      etapes: [
        "5 min : tiens un verre à hauteur d’yeux, puis descends-le lentement en regardant son bord s’ouvrir. Dessine trois ovales : presque plat, moyen, bien ouvert.",
        "5 min : pose le verre sur la table et dessine-le : l’ovale du haut, les côtés et un fond un peu plus arrondi que le bord.",
        "5 min : aligne un bol, un verre et une tasse, et dessine leurs ovales tels que tu les vois."
      ],
      materiel: "Crayon, papier, un verre, un bol et une tasse",
      siBloque: "Dessine seulement une pile de cinq ovales, du plus plat en haut au plus ouvert en bas.",
      duree: 15
    },
    {
      id: "jeu-14",
      titre: "Trois pièces en croquis éclair",
      consigne: "Promène-toi chez toi avec ton carnet et croque trois pièces, cinq minutes chacune. Pas de détails : seulement les grandes lignes des murs et des gros meubles.",
      etapes: [
        "5 min : première pièce. Trace les lignes du sol et des murs, puis les deux ou trois plus gros meubles sous forme de boîtes.",
        "5 min : deuxième pièce. Même principe, en changeant de hauteur : dessine debout, ou depuis le sol.",
        "5 min : troisième pièce. Choisis l’angle le plus inhabituel : depuis le seuil, un coin ou le lit."
      ],
      materiel: "Crayon, papier sur un support rigide et minuteur",
      siBloque: "Reste dans une seule pièce et dessine-la depuis trois endroits différents, avec ses murs et un seul meuble.",
      duree: 15
    },
    {
      id: "jeu-15",
      titre: "Ta pièce rêvée en maison de poupée",
      consigne: "Imagine la pièce idéale (atelier, cabane, bibliothèque, serre) et dessine-la comme une maison de poupée dont on aurait retiré le mur de devant. Tout est permis, même le toboggan.",
      etapes: [
        "5 min : dessine un grand rectangle (le mur du fond), puis fais partir de ses coins quatre lignes en biais vers les bords de la feuille : voilà le sol, le plafond et les murs de côté.",
        "15 min : meuble la pièce. Chaque meuble est d’abord une boîte posée au sol, que tu transformes ensuite en canapé, en établi ou en lit.",
        "10 min : ajoute les fenêtres, les lampes, les tapis, les plantes et tous les détails qui te feraient plaisir."
      ],
      materiel: "Crayon, gomme et papier",
      siBloque: "Dessine seulement la boîte de la pièce et trois choses dedans : un meuble, une fenêtre, une lampe.",
      duree: 30
    }
  ]
};
