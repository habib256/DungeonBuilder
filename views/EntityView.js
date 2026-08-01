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
            // Contrairement aux blocs du donjon (clones partageant la
            // géométrie du catalogue), chaque entité possède sa géométrie et
            // son matériau : sans libération explicite, chaque rechargement
            // en abandonnait un exemplaire sur le GPU.
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.meshes = [];
    }
}
