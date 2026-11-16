# -*- coding: utf-8 -*-
"""Fabrique la page publiée comme artefact Claude à partir des fichiers de l'appli.

Usage (depuis le dossier de l'appli) :
    python outils/construire-artefact.py

Produit artefact/dessin-du-jour.html : une seule page, feuille de style et
scripts compris. Un artefact est enveloppé à la publication dans son propre
squelette (doctype, head, body) : la page ne contient donc ni <html>, ni
<head>, ni <body>, et commence par son <title> et son <style>.
Rien n'est transformé : les fichiers sont recopiés tels quels, dans l'ordre
où index.html les charge.
"""
import io
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, "artefact", "dessin-du-jour.html")


def lire(chemin):
    with io.open(os.path.join(RACINE, chemin), encoding="utf-8", newline="") as f:
        return f.read().replace("\r\n", "\n")


def un(motif, texte, quoi):
    trouve = re.search(motif, texte, re.S)
    if not trouve:
        sys.exit("construire-artefact : %s introuvable dans index.html" % quoi)
    return trouve.group(1)


def main():
    page = lire("index.html")
    titre = un(r"<title>(.*?)</title>", page, "le titre")
    script_theme = un(r"<head>.*?<script>(.*?)</script>", page, "le script du thème")
    corps = un(r"<body>(.*)</body>", page, "le corps")

    # Les scripts du bas de page sont remplacés par leur contenu, dans l'ordre.
    scripts = re.findall(r'<script src="([^"]+)"></script>', corps)
    if not scripts:
        sys.exit("construire-artefact : aucun script à inclure")
    corps = re.sub(r'\s*<script src="[^"]+"></script>', "", corps).rstrip() + "\n"

    morceaux = []
    morceaux.append("<title>%s</title>\n" % titre)
    morceaux.append('<meta name="claude:viewport-fit-sides" content="cover">\n')
    morceaux.append("<style>\n%s</style>\n" % lire("style.css"))
    # Le squelette de l'artefact ne porte pas la langue : on la pose ici.
    morceaux.append("<script>\ndocument.documentElement.lang = \"fr\";\n"
                    "document.documentElement.setAttribute(\"data-apparence\", \"auto\");\n"
                    "%s</script>\n" % script_theme.lstrip("\n"))
    morceaux.append(corps)
    for chemin in scripts:
        contenu = lire(chemin)
        if re.search(r"</script", contenu, re.I):
            sys.exit("construire-artefact : %s contient « </script », à échapper avant de l'inclure" % chemin)
        morceaux.append("<script>\n/* --- %s --- */\n%s</script>\n" % (chemin, contenu))

    resultat = "".join(morceaux)
    # Le balisage repris de index.html ne doit plus porter de squelette de page.
    reste = re.search(r"<(?:!doctype|html[\s>]|head[\s>]|body[\s>])", corps, re.I)
    if reste:
        sys.exit("construire-artefact : le corps contient encore « %s »" % reste.group(0))

    dossier = os.path.dirname(SORTIE)
    if not os.path.isdir(dossier):
        os.makedirs(dossier)
    with io.open(SORTIE, "w", encoding="utf-8", newline="\n") as f:
        f.write(resultat)
    print("%s : %d octets, %d scripts inclus (%s)" % (
        os.path.relpath(SORTIE, RACINE), len(resultat.encode("utf-8")), len(scripts), ", ".join(scripts)))


if __name__ == "__main__":
    main()
