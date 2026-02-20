// View: Chargement STL et rendu des blocs du donjon

class DungeonView {
    constructor() {
        this.meshes = [];
        this.world = [];
        this.ready = false;
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
                console.error(`Erreur lors du chargement du fichier STL ${filePath} :`, error);
                reject(error);
            });
        });
    }

    loadAllBlocks(blockCatalogEntries, materialConfig) {
        console.log('Chargement des STL de Dungeon Block\n ......... PLEASE WAIT .........');
        console.time('Chargement des STL');

        return blockCatalogEntries.reduce((promise, file) => {
            return promise.then(() => this.loadSTL(file.path, file.pos, file.scale, file.rot, materialConfig));
        }, Promise.resolve()).then(() => {
            this.ready = true;
            console.timeEnd('Chargement des STL');
        }).catch(error => {
            console.error('Erreur lors du chargement des STL:', error);
            console.timeEnd('Chargement des STL');
        });
    }

    getMesh(index) {
        if (this.ready && this.meshes[index]) {
            return this.meshes[index];
        }
        console.error(`Mesh at index ${index} is not ready or undefined.`);
        return null;
    }

    buildWorld(mapBlocks) {
        this.world = [];
        for (const [index, x, y, z, rx, ry, rz] of mapBlocks) {
            const originalMesh = this.getMesh(index);
            if (!originalMesh) {
                console.error(`Mesh at index ${index} is undefined.`);
                continue;
            }
            const mesh = originalMesh.clone();
            mesh.position.set(x, y, z);
            mesh.rotation.set(rx, ry, rz);
            this.world.push(mesh);
        }
    }

    addToScene(scene) {
        this.world.forEach(objet => scene.add(objet));
    }
}
