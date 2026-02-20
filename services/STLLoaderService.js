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

    loadSequential(items, materialConfig) {
        const meshes = [];
        return items.reduce((promise, item) => {
            return promise.then(() =>
                this.load(item.path, materialConfig, {
                    position: item.pos || item.position,
                    scale: item.scale,
                    rotation: item.rot || item.rotation,
                }).then(mesh => {
                    meshes.push(mesh);
                })
            );
        }, Promise.resolve()).then(() => meshes);
    }

    loadParallel(items, materialConfig) {
        return Promise.all(
            items.map(item =>
                this.load(item.path, materialConfig, {
                    position: item.pos || item.position,
                    scale: item.scale,
                    rotation: item.rot || item.rotation,
                })
            )
        );
    }
}
