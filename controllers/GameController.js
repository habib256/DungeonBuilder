// Controller: Orchestre les Models et les Views
// Gère l'initialisation, le chargement et le flux du jeu

class GameController {
    constructor() {
        this.mapNb = 1;

        // Views
        this.sceneView = new SceneView();
        this.dungeonView = new DungeonView();
        this.monstersView = new EntityView();
        this.heroesView = new EntityView();
        this.lightView = new LightView();
    }

    start() {
        // Créer et ajouter les lumières
        this.lightView.createLights(LightData.getAll());
        this.lightView.addToScene(this.sceneView.scene);

        // Afficher l'écran de chargement
        this.sceneView.showLoading();

        // Démarrer la boucle d'animation
        this.sceneView.animate();

        // Charger le donjon puis les entités
        this.loadDungeon();
    }

    loadDungeon() {
        const blockMaterial = BlockCatalog.getMaterial();

        this.dungeonView.loadAllBlocks(BlockCatalog.getAll(), blockMaterial).then(() => {
            // Construire le monde à partir des données de la carte
            const mapBlocks = MapData.getMap(this.mapNb);
            this.dungeonView.buildWorld(mapBlocks);

            // Masquer le chargement et ajouter tout à la scène
            this.sceneView.hideLoading();
            this.dungeonView.addToScene(this.sceneView.scene);

            // Charger les entités
            this.loadEntities();

            console.log(`Chargement de la map du donjon ${this.mapNb} terminé`);
            console.log('Bienvenue sous DungeonBuilder');
        }).catch(error => {
            console.error('Erreur lors du chargement du donjon:', error);
        });
    }

    loadEntities() {
        this.monstersView.loadEntities(EntityData.getMonsters(), EntityData.MONSTER_MATERIAL).then(() => {
            this.monstersView.addToScene(this.sceneView.scene);
        });

        this.heroesView.loadEntities(EntityData.getHeroes(), EntityData.HERO_MATERIAL).then(() => {
            this.heroesView.addToScene(this.sceneView.scene);
        });
    }
}
