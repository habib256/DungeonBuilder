// Model: État de l'éditeur de niveau
// Gère la sélection de blocs, les blocs placés, la rotation et les modes

class EditorModel {
    static MODES = {
        PLACE: 'place',
        DELETE: 'delete',
        VIEW: 'view'
    };

    constructor(eventBus) {
        this.eventBus = eventBus;
        this.selectedBlockIndex = 0;
        this.placedBlocks = [];
        this.currentRotationY = 0;
        this.mode = EditorModel.MODES.PLACE;
        this.isActive = false;
    }

    // Les deux émetteurs de EDITOR_MODE_CHANGED publient la même forme de
    // charge utile : un listener lisant data.mode recevait sinon undefined
    // lors d'un simple changement d'activation.
    setActive(active) {
        this.isActive = active;
        this.emitModeChanged();
    }

    setMode(mode) {
        this.mode = mode;
        this.emitModeChanged();
    }

    emitModeChanged() {
        this.eventBus.emit(EventBus.Events.EDITOR_MODE_CHANGED, {
            active: this.isActive,
            mode: this.mode
        });
    }

    selectBlock(index) {
        this.selectedBlockIndex = index;
        this.eventBus.emit(EventBus.Events.EDITOR_BLOCK_SELECTED, { index });
    }

    rotateBlock(direction) {
        const TWO_PI = Math.PI * 2;
        // Normaliser dans [0, 2PI) : le modulo JS garde le signe de l'opérande
        // gauche et produirait des angles négatifs en tournant vers la gauche
        this.currentRotationY = ((this.currentRotationY + direction * (Math.PI / 2)) % TWO_PI + TWO_PI) % TWO_PI;
        this.eventBus.emit(EventBus.Events.EDITOR_ROTATION_CHANGED, {
            rotationY: this.currentRotationY
        });
    }

    addBlock(blockIndex, x, y, z, rx, ry, rz) {
        const block = { blockIndex, x, y, z, rx, ry, rz };
        this.placedBlocks.push(block);
        this.eventBus.emit(EventBus.Events.EDITOR_BLOCK_PLACED, block);
        return this.placedBlocks.length - 1;
    }

    removeBlock(index) {
        if (index >= 0 && index < this.placedBlocks.length) {
            const removed = this.placedBlocks.splice(index, 1)[0];
            this.eventBus.emit(EventBus.Events.EDITOR_BLOCK_REMOVED, { index, block: removed });
            return removed;
        }
        return null;
    }

    clearAllBlocks() {
        this.placedBlocks = [];
        this.eventBus.emit(EventBus.Events.EDITOR_MAP_CLEARED);
    }

    getBlockRotation(blockIndex) {
        const catalog = BlockCatalog.getAll();
        const blockDef = catalog[blockIndex];
        if (!blockDef) return { x: -Math.PI / 2, y: 0, z: Math.PI / 2 };
        // Les STL sont modélisés en Z-up et redressés par rx = -PI/2.
        // Avec l'ordre d'Euler XYZ (R = Rx.Ry.Rz), le lacet autour de la
        // verticale du monde correspond donc à rz, pas à ry : ajouter la
        // rotation à ry ferait basculer le bloc sur le côté.
        return { x: blockDef.rot.x, y: blockDef.rot.y, z: blockDef.rot.z + this.currentRotationY };
    }

    exportMap() {
        const exported = this.placedBlocks.map(b =>
            [b.blockIndex, b.x, b.y, b.z, b.rx, b.ry, b.rz]
        );
        this.eventBus.emit(EventBus.Events.EDITOR_MAP_EXPORTED, exported);
        return exported;
    }

    // Valide une carte importée : tableau d'entrées [blockIndex, x, y, z, rx, ry, rz]
    // blockIndex doit désigner une entrée réelle du catalogue, sinon le bloc
    // serait conservé dans le modèle sans mesh : invisible, non supprimable,
    // mais réexporté.
    static isValidMapData(mapData) {
        if (!Array.isArray(mapData)) return false;
        const catalogSize = BlockCatalog.getAll().length;

        return mapData.every(entry =>
            Array.isArray(entry) &&
            entry.length >= 7 &&
            entry.slice(0, 7).every(v => typeof v === 'number' && Number.isFinite(v)) &&
            Number.isInteger(entry[0]) && entry[0] >= 0 && entry[0] < catalogSize
        );
    }

    importMap(mapData) {
        if (!EditorModel.isValidMapData(mapData)) {
            throw new Error('Format de carte invalide : tableau de [blockIndex, x, y, z, rx, ry, rz] attendu');
        }
        this.clearAllBlocks();
        for (const [blockIndex, x, y, z, rx, ry, rz] of mapData) {
            this.placedBlocks.push({ blockIndex, x, y, z, rx, ry, rz });
        }
        this.eventBus.emit(EventBus.Events.EDITOR_MAP_IMPORTED, this.placedBlocks);
    }

    getPlacedBlocksAsArray() {
        return this.placedBlocks.map(b =>
            [b.blockIndex, b.x, b.y, b.z, b.rx, b.ry, b.rz]
        );
    }
}
