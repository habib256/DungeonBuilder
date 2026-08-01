// View: Rendu des blocs du donjon
// Utilise STLLoaderService pour le chargement et EventBus pour la communication

class DungeonView {
    constructor(eventBus, stlLoaderService) {
        this.eventBus = eventBus;
        this.stlLoader = stlLoaderService;
        this.blockMeshes = [];
        this.worldMeshes = [];
        this.ready = false;
    }

    loadAllBlocks(blockCatalogEntries, materialConfig) {
        console.log('Chargement des STL de Dungeon Block\n ......... PLEASE WAIT .........');
        console.time('Chargement des STL');

        return this.stlLoader.loadSequential(blockCatalogEntries, materialConfig)
            .then(meshes => {
                this.blockMeshes = meshes;
                this.ready = true;
                console.timeEnd('Chargement des STL');
                const missing = meshes.filter(m => !m).length;
                if (missing > 0) {
                    console.warn(`${missing}/${meshes.length} blocs STL n'ont pas pu être chargés`);
                }
                this.eventBus.emit(EventBus.Events.DUNGEON_BLOCKS_LOADED);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des STL:', error);
                console.timeEnd('Chargement des STL');
            });
    }

    getBlockMesh(index) {
        if (this.ready && this.blockMeshes[index]) {
            return this.blockMeshes[index];
        }
        console.error(`Mesh at index ${index} is not ready or undefined.`);
        return null;
    }

    buildWorld(mapBlocks) {
        this.worldMeshes = [];
        for (const [index, x, y, z, rx, ry, rz] of mapBlocks) {
            const originalMesh = this.getBlockMesh(index);
            if (!originalMesh) continue;
            const mesh = originalMesh.clone();
            mesh.position.set(x, y, z);
            mesh.rotation.set(rx, ry, rz);
            this.worldMeshes.push(mesh);
        }
    }

    addToScene(scene) {
        this.worldMeshes.forEach(mesh => scene.add(mesh));
    }

    clearWorld(scene) {
        this.worldMeshes.forEach(mesh => scene.remove(mesh));
        this.worldMeshes = [];
    }
}
