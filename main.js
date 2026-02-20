// Point d'entrée de l'application DungeonBuilder
// Initialise l'EventBus central, crée le contrôleur et démarre le jeu

const eventBus = new EventBus();
const game = new GameController(eventBus);
game.start();
