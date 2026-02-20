// View: Chargement STL et rendu des entités (héros et monstres)

class EntityView {
    constructor() {
        this.meshes = [];
    }

    loadSTL(filePath, position, scale, rotation, materialConfig) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.STLLoader();
            loader.load(filePath, (geometry) => {
                geometry.computeVertexNormals();
                const material = new THREE.MeshPhongMaterial(materialConfig);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(position.x, position.y, position.z);
                mesh.scale.set(scale.x, scale.y, scale.z);
                mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                this.meshes.push(mesh);
                resolve(mesh);
            }, undefined, (error) => {
                console.error(`Error loading STL file ${filePath}:`, error);
                reject(error);
            });
        });
    }

    loadEntities(entityDataList, materialConfig) {
        const promises = entityDataList.map(entity =>
            this.loadSTL(entity.path, entity.position, entity.scale, entity.rotation, materialConfig)
        );
        return Promise.all(promises);
    }

    addToScene(scene) {
        this.meshes.forEach(mesh => scene.add(mesh));
    }
}
