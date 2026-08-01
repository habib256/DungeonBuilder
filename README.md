# DungeonBuilder
![Screenshot.png](./Screenshots/Capture%20d%E2%80%99%C3%A9cran%20du%202024-06-16%2022-58-21.png?raw=true "screenshot.png")
DungeonBuilder based on DungeonBlocks STL Tiles

## Lancement

Les modèles STL sont chargés par requête XHR : ouvrir `index.html` par
double-clic (`file://`) échoue silencieusement, le navigateur bloquant ces
requêtes (page noire, erreurs CORS dans la console). Il faut passer par un
serveur HTTP local :

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Les tuiles STL (`DB1/`) et les figurines (`HeroQuest/`) ne sont pas versionnées
et doivent être placées à la racine du projet ; sans elles la scène se charge
mais reste vide.

![Screenshot.png](./Screenshots/Capture%20d%E2%80%99%C3%A9cran%20du%202024-06-16%2021-56-34.png?raw=true "screenshot.png")

