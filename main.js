// Point d'entrée de l'application DungeonBuilder
// Initialise l'EventBus central, crée le contrôleur et démarre le jeu

// Sans Three.js (CDN injoignable, poste hors ligne) la page restait
// entièrement noire, la seule trace étant une ReferenceError dans la console.
if (typeof THREE === 'undefined') {
    document.body.innerHTML =
        '<div style="color:#e0e0e0;font-family:sans-serif;padding:24px;line-height:1.6">' +
        '<h1>Three.js n\'a pas pu être chargé</h1>' +
        '<p>Les bibliothèques sont récupérées depuis un CDN : vérifiez la connexion ' +
        'réseau ou hébergez Three.js localement.</p></div>';
    console.error('THREE est indéfini : les scripts Three.js ne se sont pas chargés.');
} else {
    const eventBus = new EventBus();
    const game = new GameController(eventBus);
    game.start();
}
