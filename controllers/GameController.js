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

        // Éditeur
        this.editorModel = new EditorModel(eventBus);
        this.editorController = null;

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

            // Initialiser l'éditeur une fois les blocs chargés
            this.initEditor();
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

    initEditor() {
        if (!this.editorController) {
            this.editorController = new EditorController(
                this.eventBus,
                this.sceneView,
                this.dungeonView,
                this.editorModel
            );
        }
        this.editorController.init();

        // L'éditeur devient propriétaire de la carte affichée. Sans ce
        // transfert le donjon visible appartenait à DungeonView seul : il
        // n'était ni sélectionnable ni supprimable, "Exporter JSON" renvoyait
        // une carte vide alors que le donjon était à l'écran, et recharger la
        // même carte superposait une seconde copie de la géométrie.
        this.dungeonView.clearWorld(this.sceneView.scene);
        this.editorController.importMap(this.gameModel.getMapData());
    }

    reloadDungeon() {
        // Nettoyer la scène actuelle
        this.dungeonView.clearWorld(this.sceneView.scene);
        this.monstersView.clearEntities(this.sceneView.scene);
        this.heroesView.clearEntities(this.sceneView.scene);

        // Reconstruire avec la nouvelle carte
        this.gameModel.setLoading(true);
        const mapBlocks = this.gameModel.getMapData();

        // Quand l'éditeur est actif, c'est lui qui détient la carte :
        // reconstruire le monde en parallèle superposerait une seconde copie
        // de la géométrie et l'export ne correspondrait plus à l'affichage.
        if (this.editorController) {
            this.editorController.importMap(mapBlocks);
        } else {
            this.dungeonView.buildWorld(mapBlocks);
            this.dungeonView.addToScene(this.sceneView.scene);
        }

        this.gameModel.setLoading(false);
        this.gameModel.setDungeonReady(true);
    }
}
