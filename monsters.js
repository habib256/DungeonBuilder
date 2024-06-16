class Monsters {
    constructor() {
        this.meshes = [];
        // Chargement et ajout de plusieurs objets STL avec des positions ajustées pour tests
        this.addSTL('HeroQuest/HQ_skeleton.stl', { x: -7, y: 3.9, z: 7 }, { x: 0.1, y: 0.1, z: 0.1 }, { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }, 'HeroQuest');
        this.addSTL('HeroQuest/ChaosDoomGuard_Sword_v2.stl', { x: 10.5, y: 2.5, z: 3.5 }, { x: 0.1, y: 0.1, z: 0.1 }, { x: -Math.PI / 2, y: 0, z: Math.PI / 4 -Math.PI / 5}, 'HeroQuest');
        this.addSTL('HeroQuest/Zombie.stl', { x: 0.2, y: 2.5, z: 3.5}, { x: 0.1, y: 0.1, z: 0.1 }, { x: -Math.PI / 2, y: 0, z: Math.PI/2 }, 'HeroQuest'); 
    }

    addMesh(mesh) {
        this.meshes.push(mesh);
    }
    getMesh(index) {
        if (index >= 0 && index < this.meshes.length) {
            return this.meshes[index];
        } else {
            console.error(`Index ${index} is out of bounds.`);
            return null;
        }
    }

    addSTL(filePath, position, scale, rotation, category) {
        const loader = new THREE.STLLoader();
        loader.load(filePath, (geometry) => {
            //console.log(`STL file ${filePath} loaded successfully`);

            // Vérification et correction des normales
            geometry.computeVertexNormals();

            const material = new THREE.MeshPhongMaterial({ color: 0xF5F5DC, specular: 0x111111, shininess: 50 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position.x, position.y, position.z);
            mesh.scale.set(scale.x, scale.y, scale.z);
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);

            mesh.castShadow = true; // Le mesh projette des ombres
            mesh.receiveShadow = true; // Le mesh reçoit des ombres

            this.meshes.push(mesh);
            //console.log(`Mesh ${category} added to the mesches`, mesh);

        }, undefined, (error) => {
            console.error(`Error loading STL file ${filePath}:`, error);
        });
    }
    addto(scene) {
        this.meshes.forEach(mesh => {
            scene.add(mesh);
        });
    }
}

