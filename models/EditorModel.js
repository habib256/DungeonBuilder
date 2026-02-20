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
        this.gridSize = 10;
        this.isActive = false;
    }

    setActive(active) {
        this.isActive = active;
        this.eventBus.emit(EventBus.Events.EDITOR_MODE_CHANGED, { active });
    }

    setMode(mode) {
        this.mode = mode;
        this.eventBus.emit(EventBus.Events.EDITOR_MODE_CHANGED, { mode });
    }

    selectBlock(index) {
        this.selectedBlockIndex = index;
        this.eventBus.emit(EventBus.Events.EDITOR_BLOCK_SELECTED, { index });
    }

    rotateBlock(direction) {
        this.currentRotationY += direction * (Math.PI / 2);
        this.currentRotationY = this.currentRotationY % (Math.PI * 2);
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
        return { x: blockDef.rot.x, y: blockDef.rot.y + this.currentRotationY, z: blockDef.rot.z };
    }

    exportMap() {
        const exported = this.placedBlocks.map(b =>
            [b.blockIndex, b.x, b.y, b.z, b.rx, b.ry, b.rz]
        );
        this.eventBus.emit(EventBus.Events.EDITOR_MAP_EXPORTED, exported);
        return exported;
    }

    importMap(mapData) {
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
