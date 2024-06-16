class Dungeon {
    constructor() {
        this.block = new Block(); // Initialiser un objet Block (chargement des blocks)
        this.world = []; // tableau à deux dimensions décrivant le monde
        this.ready = false;
        this.mapNb = 1;
       
    }

    loadWorld() {
        switch (this.mapNb) {
            case 0:
                for (let i = -10; i < 10; i++) {
                    for (let j = -10; j < 10; j++) {
                        // Dalles de sol uniquement
                        this.addDungeonBlock(0, i * 3.5, 0.7, j * 3.5, -Math.PI / 2, 0, Math.PI / 2);
                    }
                }
                break;
            case 1:
                this.addDungeonBlock(13, -10.5, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(1, -7, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(1, -3.5, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(82, 0, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(83, 3.5, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(1, 7, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(1, 10.5, 0, 0, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(13, 14, 0, 0, -Math.PI / 2, 0, 0);

                this.addDungeonBlock(4, -10.5, 0, 3.5, -Math.PI / 2, 0, -Math.PI);
                this.addDungeonBlock(16, -7, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, -3.5, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 0, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 3.5, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, 7, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 10.5, 0.7, 3.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(4, 14, 0, 3.5, -Math.PI / 2, 0, 0);

                this.addDungeonBlock(10, -10.5, 0, 7, -Math.PI / 2, 0, -Math.PI);
                this.addDungeonBlock(16, -7, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, -3.5, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 0, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 3.5, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, 7, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 10.5, 0.7, 7, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(60, 14, 0, 7, -Math.PI / 2, 0, 0);

                this.addDungeonBlock(4, -10.5, 0, 10.5, -Math.PI / 2, 0, -Math.PI);
                this.addDungeonBlock(16, -7, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, -3.5, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 0, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 3.5, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(17, 7, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(16, 10.5, 0.7, 10.5, -Math.PI / 2, 0, Math.PI / 2);
                this.addDungeonBlock(4, 14, 0, 10.5, -Math.PI / 2, 0, 0);

                this.addDungeonBlock(84, -10.5, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(1, -7, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(68, -3.5, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(1, 0, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(1, 3.5, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(62, 7, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(1, 10.5, 0, 14, -Math.PI / 2, 0, -Math.PI / 2);
                this.addDungeonBlock(84, 14, 0, 14, -Math.PI / 2, 0, Math.PI / 2);
                break;

            case 2:
                for (let i = -5; i < 5; i++) {
                    for (let j = -5; j < 5; j++) {
                        // Utilisation de différents types de blocs pour varier le donjon
                        let blockType;
                        if ((i + j) % 5 === 0) {
                            blockType = 46;
                        } else if ((i + j) % 4 === 0) {
                            blockType = 45;
                        } else if ((i + j) % 3 === 0) {
                            blockType = 0; // Dalle
                        } else if ((i + j) % 2 === 0) {
                            blockType = 76; // Water With Skulls
                        } else {
                            blockType = 47;
                        }
                        this.addDungeonBlock(blockType, i * 3.5, 0, j * 3.5, -Math.PI / 2, 0, Math.PI / 2);
                    }
                }
                break;

        }


    }

    addDungeonBlock(index, x, y, z, rx, ry, rz) {
        var originalMesh = this.block.getMesh(index);
        if (!originalMesh) {
            console.error(`Mesh at index ${index} is undefined.`);
            return;
        }
        var mesh = originalMesh.clone();
        mesh.position.set(x, y, z)
        mesh.rotation.set(rx, ry, rz);
        this.world.push(mesh)
    }

    addto(scene) {
        this.world.forEach(objet => scene.add(objet));
    }

    loadDungeonSTLs() {
        return this.block.loadDungeonSTLs().then(() => {
            this.loadWorld();
            this.ready = true; // Dungeon est prêt quand le monde est chargé
            console.log(`Chargement de la map du donjon ${this.mapNb} terminé`);
        }).catch(error => {
            console.error('Erreur lors du chargement des STL:', error);
        });
    }
}
