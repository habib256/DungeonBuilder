// Controller: Orchestre les Models et les Views via EventBus
// Gère l'initialisation, le chargement et le flux du jeu

class GameController {
    constructor(eventBus) {
        this.eventBus = eventBus;

        // Service partagé
        this.stlLoaderService = new STLLoaderService();

        // Model
        this.gameModel = new GameModel(eventBus);

        // Views
        this.sceneView = new SceneView(eventBus);
        this.dungeonView = new DungeonView(eventBus, this.stlLoaderService);
        this.monstersView = new EntityView(eventBus, this.stlLoaderService);
        this.heroesView = new EntityView(eventBus, this.stlLoaderService);
        this.lightView = new LightView(eventBus);

        // Écouter les événements
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.eventBus.on(EventBus.Events.DUNGEON_BUILT, () => {
            this.loadEntities();
        });

        this.eventBus.on(EventBus.Events.GAME_READY, () => {
            console.log('Bienvenue sous DungeonBuilder');
        });

        this.eventBus.on(EventBus.Events.MAP_CHANGED, (data) => {
            this.reloadDungeon();
        });
    }

    start() {
        this.eventBus.emit(EventBus.Events.GAME_INIT);

        // Créer et ajouter les lumières
        this.lightView.createLights(this.gameModel.getLights());
        this.lightView.addToScene(this.sceneView.scene);

        // Signaler le début du chargement
        this.gameModel.setLoading(true);

        // Démarrer la boucle d'animation
        this.sceneView.animate();

        // Charger le donjon
        this.loadDungeon();
    }

    loadDungeon() {
        const blockMaterial = this.gameModel.getBlockMaterial();
        const blockCatalog = this.gameModel.getBlockCatalog();

        this.dungeonView.loadAllBlocks(blockCatalog, blockMaterial).then(() => {
            // Construire le monde à partir des données de la carte
            const mapBlocks = this.gameModel.getMapData();
            this.dungeonView.buildWorld(mapBlocks);

            // Fin du chargement, ajouter le donjon à la scène
            this.gameModel.setLoading(false);
            this.dungeonView.addToScene(this.sceneView.scene);

            // Signaler que le donjon est prêt
            this.gameModel.setDungeonReady(true);

            console.log(`Chargement de la map du donjon ${this.gameModel.currentMapNb} terminé`);
        }).catch(error => {
            console.error('Erreur lors du chargement du donjon:', error);
        });
    }

    loadEntities() {
        const monstersPromise = this.monstersView
            .loadEntities(this.gameModel.getMonsters(), EntityData.MONSTER_MATERIAL)
            .then(() => {
                this.monstersView.addToScene(this.sceneView.scene);
                this.eventBus.emit(EventBus.Events.MONSTERS_LOADED);
            });

        const heroesPromise = this.heroesView
            .loadEntities(this.gameModel.getHeroes(), EntityData.HERO_MATERIAL)
            .then(() => {
                this.heroesView.addToScene(this.sceneView.scene);
                this.eventBus.emit(EventBus.Events.HEROES_LOADED);
            });

        Promise.all([monstersPromise, heroesPromise]).then(() => {
            this.gameModel.setEntitiesReady(true);
        });
    }

    reloadDungeon() {
        // Nettoyer la scène actuelle
        this.dungeonView.clearWorld(this.sceneView.scene);
        this.monstersView.clearEntities(this.sceneView.scene);
        this.heroesView.clearEntities(this.sceneView.scene);

        // Reconstruire avec la nouvelle carte
        this.gameModel.setLoading(true);
        const mapBlocks = this.gameModel.getMapData();
        this.dungeonView.buildWorld(mapBlocks);
        this.gameModel.setLoading(false);
        this.dungeonView.addToScene(this.sceneView.scene);
        this.gameModel.setDungeonReady(true);
    }
}
