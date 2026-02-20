// View: Rendu des entités (héros et monstres)
// Utilise STLLoaderService pour le chargement

class EntityView {
    constructor(eventBus, stlLoaderService) {
        this.eventBus = eventBus;
        this.stlLoader = stlLoaderService;
        this.meshes = [];
    }

    loadEntities(entityDataList, materialConfig) {
        return this.stlLoader.loadParallel(entityDataList, materialConfig)
            .then(meshes => {
                this.meshes = meshes;
            });
    }

    addToScene(scene) {
        this.meshes.forEach(mesh => scene.add(mesh));
    }

    clearEntities(scene) {
        this.meshes.forEach(mesh => {
            scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.meshes = [];
    }
}
