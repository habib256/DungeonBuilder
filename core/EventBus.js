// Core: Système d'événements central pour la communication MVC découplée
// Permet aux Models, Views et Controllers de communiquer sans dépendance directe

class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Événements disponibles
EventBus.Events = {
    // Cycle de vie
    GAME_INIT: 'game:init',
    GAME_READY: 'game:ready',

    // Chargement
    LOADING_START: 'loading:start',
    LOADING_PROGRESS: 'loading:progress',
    LOADING_COMPLETE: 'loading:complete',

    // Donjon
    DUNGEON_BLOCKS_LOADED: 'dungeon:blocksLoaded',
    DUNGEON_BUILT: 'dungeon:built',
    MAP_CHANGED: 'map:changed',

    // Entités
    ENTITIES_LOADED: 'entities:loaded',
    MONSTERS_LOADED: 'monsters:loaded',
    HEROES_LOADED: 'heroes:loaded',

    // Scène
    SCENE_OBJECT_ADDED: 'scene:objectAdded',
    SCENE_OBJECT_REMOVED: 'scene:objectRemoved',
};
