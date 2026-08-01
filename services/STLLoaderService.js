// Service: Chargement centralisé des fichiers STL
// Élimine la duplication entre DungeonView et EntityView

class STLLoaderService {
    constructor() {
        this.loader = new THREE.STLLoader();
    }

    load(filePath, materialConfig, options = {}) {
        const { position, scale, rotation } = options;

        return new Promise((resolve, reject) => {
            this.loader.load(filePath, (geometry) => {
                geometry.computeVertexNormals();
                const material = new THREE.MeshPhongMaterial(materialConfig);
                const mesh = new THREE.Mesh(geometry, material);

                if (position) mesh.position.set(position.x, position.y, position.z);
                if (scale) mesh.scale.set(scale.x, scale.y, scale.z);
                if (rotation) mesh.rotation.set(rotation.x, rotation.y, rotation.z);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                resolve(mesh);
            }, undefined, (error) => {
                console.error(`Erreur chargement STL ${filePath}:`, error);
                reject(error);
            });
        });
    }

    loadOptions(item) {
        return {
            position: item.pos || item.position,
            scale: item.scale,
            rotation: item.rot || item.rotation,
        };
    }

    // Charge les items un par un. Un fichier manquant laisse un trou à son
    // index au lieu de faire échouer tout le lot : les index du catalogue
    // référencés par les cartes doivent rester alignés.
    loadSequential(items, materialConfig) {
        const meshes = new Array(items.length);
        return items.reduce((promise, item, index) => {
            return promise.then(() =>
                this.load(item.path, materialConfig, this.loadOptions(item))
                    .then(mesh => { meshes[index] = mesh; })
                    .catch(() => { meshes[index] = undefined; })
            );
        }, Promise.resolve()).then(() => meshes);
    }

    // Charge tout en parallèle ; les items en échec sont simplement absents
    // du résultat plutôt que de rejeter l'ensemble.
    loadParallel(items, materialConfig) {
        return Promise.all(
            items.map(item =>
                this.load(item.path, materialConfig, this.loadOptions(item))
                    .catch(() => null)
            )
        ).then(meshes => meshes.filter(mesh => mesh !== null));
    }
}
