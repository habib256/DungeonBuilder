// Model: État central du jeu
// Gère l'état mutable et notifie les changements via EventBus

class GameModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentMapNb = 1;
        this.isLoading = false;
        this.isDungeonReady = false;
        this.areEntitiesReady = false;
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            this.eventBus.emit(EventBus.Events.LOADING_START);
        } else {
            this.eventBus.emit(EventBus.Events.LOADING_COMPLETE);
        }
    }

    setDungeonReady(ready) {
        this.isDungeonReady = ready;
        if (ready) {
            this.eventBus.emit(EventBus.Events.DUNGEON_BUILT);
        }
    }

    setEntitiesReady(ready) {
        this.areEntitiesReady = ready;
        if (ready) {
            this.eventBus.emit(EventBus.Events.ENTITIES_LOADED);
            this.checkGameReady();
        }
    }

    setMapNumber(mapNb) {
        this.currentMapNb = mapNb;
        this.isDungeonReady = false;
        this.areEntitiesReady = false;
        this.eventBus.emit(EventBus.Events.MAP_CHANGED, { mapNb });
    }

    getMapData() {
        return MapData.getMap(this.currentMapNb);
    }

    getBlockCatalog() {
        return BlockCatalog.getAll();
    }

    getBlockMaterial() {
        return BlockCatalog.getMaterial();
    }

    getMonsters() {
        return EntityData.getMonsters();
    }

    getHeroes() {
        return EntityData.getHeroes();
    }

    getLights() {
        return LightData.getAll();
    }

    checkGameReady() {
        if (this.isDungeonReady && this.areEntitiesReady) {
            this.eventBus.emit(EventBus.Events.GAME_READY);
        }
    }
}
