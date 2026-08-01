// Controller: Gère la logique de l'éditeur de niveau
// Raycasting, placement/suppression de blocs, interactions souris

class EditorController {
    constructor(eventBus, sceneView, dungeonView, editorModel) {
        this.eventBus = eventBus;
        this.sceneView = sceneView;
        this.dungeonView = dungeonView;
        this.editorModel = editorModel;
        this.editorView = new EditorView(eventBus);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Meshes placés dans la scène par l'éditeur
        this.editorMeshes = [];
        // Association mesh -> entrée du modèle. Un WeakMap plutôt que
        // mesh.userData : Object3D.copy() recopie userData via JSON, un clone
        // perdrait donc l'identité de la référence sans que rien ne le signale.
        this.meshToBlock = new WeakMap();
        // Gestionnaires souris actifs (null tant que non liés)
        this.mouseHandlers = null;
        // Mesh de prévisualisation
        this.previewMesh = null;
        this.previewBlockIndex = null;
        // Dernière case survolée, pour rafraîchir la prévisualisation sans souris
        this.lastGridPosition = null;

        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        this.editorView.create();
        this.editorView.createGridHelper(this.sceneView.scene);
        this.bindViewCallbacks();
        this.bindMouseEvents();
        this.editorModel.setActive(true);
        // Désactiver les contrôles orbitaux en mode placement par défaut
        this.sceneView.controls.enabled = false;
        this.isInitialized = true;

        console.log('Éditeur de niveau initialisé');
    }

    bindViewCallbacks() {
        this.editorView.onBlockSelect = (index) => {
            this.editorModel.selectBlock(index);
            this.editorView.setSelectedBlock(index);
            this.updatePreview();
        };

        this.editorView.onModeChange = (mode) => {
            this.editorModel.setMode(mode);
            this.editorView.setMode(mode);
            this.sceneView.controls.enabled = (mode === EditorModel.MODES.VIEW);
            this.updatePreview();
        };

        this.editorView.onRotate = (direction) => {
            this.editorModel.rotateBlock(direction);
            this.editorView.setRotation(this.editorModel.currentRotationY);
            this.updatePreview();
        };

        this.editorView.onHeightChange = () => {
            this.updatePreview();
        };

        this.editorView.onClear = () => {
            this.clearAllEditorBlocks();
        };

        this.editorView.onExport = () => {
            this.exportMap();
        };

        this.editorView.onImport = (data) => {
            this.importMap(data);
        };

        this.editorView.onLoadExistingMap = (mapNb) => {
            const mapData = MapData.getMap(mapNb);
            this.importMap(mapData);
        };
    }

    // Les gestionnaires sont mémorisés pour pouvoir être retirés dans
    // destroy() : sans cela, un cycle destroy()/init() les empilait et un
    // seul clic plaçait deux blocs.
    bindMouseEvents() {
        if (this.mouseHandlers) return;
        const canvas = this.sceneView.renderer.domElement;

        this.mouseHandlers = {
            mousemove: (e) => this.onMouseMove(e),
            click: (e) => this.onMouseClick(e),
            // La prévisualisation resterait figée dans la scène si le curseur
            // sortait du canvas (panneau latéral, hors fenêtre).
            mouseleave: () => this.removePreview(),
            contextmenu: (e) => {
                if (this.editorModel.mode !== EditorModel.MODES.VIEW) {
                    e.preventDefault();
                    this.onRightClick(e);
                }
            },
        };

        for (const [type, handler] of Object.entries(this.mouseHandlers)) {
            canvas.addEventListener(type, handler);
        }
    }

    unbindMouseEvents() {
        if (!this.mouseHandlers) return;
        const canvas = this.sceneView.renderer.domElement;
        for (const [type, handler] of Object.entries(this.mouseHandlers)) {
            canvas.removeEventListener(type, handler);
        }
        this.mouseHandlers = null;
    }

    getMousePosition(event) {
        const rect = this.sceneView.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    getGridPosition(event) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.sceneView.camera);

        // Utiliser la hauteur actuelle de l'éditeur pour le plan
        const height = this.editorView.currentHeight;
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -height);
        const intersection = new THREE.Vector3();
        // intersectPlane renvoie null si le rayon est parallèle au plan ou
        // s'éloigne de lui ; le vecteur cible reste alors inchangé, il faut
        // donc tester la valeur de retour et non l'objet (toujours truthy).
        const hit = this.raycaster.ray.intersectPlane(plane, intersection);
        if (!hit) return null;

        const G = MapData.GRID_SPACING;
        hit.x = Math.round(hit.x / G) * G;
        hit.z = Math.round(hit.z / G) * G;
        hit.y = height;
        return hit;
    }

    onMouseMove(event) {
        if (this.editorModel.mode === EditorModel.MODES.VIEW) {
            this.removePreview();
            return;
        }

        if (this.editorModel.mode === EditorModel.MODES.PLACE) {
            const pos = this.getGridPosition(event);
            if (pos) {
                this.lastGridPosition = pos.clone();
                this.showPreview(pos);
            }
        } else if (this.editorModel.mode === EditorModel.MODES.DELETE) {
            this.removePreview();
        }
    }

    // Rafraîchit la prévisualisation après un changement de bloc, de mode
    // ou de rotation, sans attendre le prochain mouvement de souris.
    updatePreview() {
        if (this.editorModel.mode !== EditorModel.MODES.PLACE) {
            this.removePreview();
            return;
        }
        if (this.lastGridPosition) {
            this.lastGridPosition.y = this.editorView.currentHeight;
            this.showPreview(this.lastGridPosition);
        }
    }

    onMouseClick(event) {
        if (this.editorModel.mode === EditorModel.MODES.VIEW) return;

        if (this.editorModel.mode === EditorModel.MODES.PLACE) {
            const pos = this.getGridPosition(event);
            if (pos) {
                this.placeBlock(pos);
            }
        } else if (this.editorModel.mode === EditorModel.MODES.DELETE) {
            this.deleteBlockAtMouse(event);
        }
    }

    onRightClick(event) {
        // Clic droit = supprimer le bloc sous le curseur
        this.deleteBlockAtMouse(event);
    }

    placeBlock(position) {
        const blockIndex = this.editorModel.selectedBlockIndex;
        const rotation = this.editorModel.getBlockRotation(blockIndex);

        const mesh = this.dungeonView.getBlockMesh(blockIndex);
        if (!mesh) {
            console.error('Mesh non disponible pour l\'index:', blockIndex);
            return;
        }

        const clone = mesh.clone();
        clone.position.copy(position);
        clone.rotation.set(rotation.x, rotation.y, rotation.z);
        this.sceneView.scene.add(clone);

        const modelIndex = this.editorModel.addBlock(
            blockIndex,
            position.x, position.y, position.z,
            rotation.x, rotation.y, rotation.z
        );

        // Lier le mesh à son entrée du modèle : les deux collections peuvent
        // diverger (blocs importés sans mesh disponible), on ne peut donc pas
        // se fier à l'égalité des index.
        this.meshToBlock.set(clone, this.editorModel.placedBlocks[modelIndex]);
        this.editorMeshes.push(clone);
        this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
    }

    deleteBlockAtMouse(event) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.sceneView.camera);

        const intersects = this.raycaster.intersectObjects(this.editorMeshes);
        if (intersects.length === 0) return;

        const hitMesh = intersects[0].object;
        const meshIndex = this.editorMeshes.indexOf(hitMesh);
        if (meshIndex === -1) return;

        this.sceneView.scene.remove(hitMesh);
        this.editorMeshes.splice(meshIndex, 1);

        const blockIndex = this.editorModel.placedBlocks.indexOf(this.meshToBlock.get(hitMesh));
        if (blockIndex !== -1) {
            this.editorModel.removeBlock(blockIndex);
        } else {
            console.warn('Mesh supprimé sans entrée correspondante dans le modèle');
        }
        this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
    }

    showPreview(position) {
        const blockIndex = this.editorModel.selectedBlockIndex;
        const mesh = this.dungeonView.getBlockMesh(blockIndex);
        if (!mesh) {
            this.removePreview();
            return;
        }

        // Ne recréer le mesh que si le bloc sélectionné change : showPreview est
        // appelé à chaque mousemove et chaque clone matériel non libéré fuit
        // sur le GPU.
        if (!this.previewMesh || this.previewBlockIndex !== blockIndex) {
            this.removePreview();
            this.previewMesh = mesh.clone();
            this.previewBlockIndex = blockIndex;

            // Rendre semi-transparent pour la prévisualisation
            this.previewMesh.material = this.previewMesh.material.clone();
            this.previewMesh.material.transparent = true;
            this.previewMesh.material.opacity = 0.4;
            this.previewMesh.material.color.setHex(0x00ff88);
            this.previewMesh.castShadow = false;
            this.previewMesh.receiveShadow = false;

            this.sceneView.scene.add(this.previewMesh);
        }

        this.previewMesh.position.copy(position);
        const rotation = this.editorModel.getBlockRotation(blockIndex);
        this.previewMesh.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    removePreview() {
        if (this.previewMesh) {
            this.sceneView.scene.remove(this.previewMesh);
            // Le matériau est un clone propre à la prévisualisation
            // (la géométrie reste partagée avec le mesh du catalogue).
            if (this.previewMesh.material) this.previewMesh.material.dispose();
            this.previewMesh = null;
            this.previewBlockIndex = null;
        }
    }

    clearAllEditorBlocks() {
        this.editorMeshes.forEach(mesh => {
            this.sceneView.scene.remove(mesh);
        });
        this.editorMeshes = [];
        this.editorModel.clearAllBlocks();
        this.editorView.updateBlockCount(0);
    }

    exportMap() {
        const data = this.editorModel.exportMap();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dungeon-map.json';
        // L'ancre doit être dans le document et l'URL rester valide le temps
        // que le téléchargement démarre (Firefox annule sinon).
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    importMap(mapData) {
        // Valider avant toute destruction : une carte invalide ne doit pas
        // laisser l'éditeur vide.
        if (!EditorModel.isValidMapData(mapData)) {
            console.error('Carte invalide, import annulé:', mapData);
            alert('Carte invalide : tableau de [blockIndex, x, y, z, rx, ry, rz] attendu');
            return;
        }

        // Nettoyer les blocs existants
        this.clearAllEditorBlocks();

        // Importer et placer les nouveaux blocs
        this.editorModel.importMap(mapData);

        for (const block of this.editorModel.placedBlocks) {
            const mesh = this.dungeonView.getBlockMesh(block.blockIndex);
            if (!mesh) continue;

            const clone = mesh.clone();
            clone.position.set(block.x, block.y, block.z);
            clone.rotation.set(block.rx, block.ry, block.rz);
            this.meshToBlock.set(clone, block);
            this.sceneView.scene.add(clone);
            this.editorMeshes.push(clone);
        }

        this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
    }

    destroy() {
        this.unbindMouseEvents();
        this.removePreview();
        this.clearAllEditorBlocks();
        this.editorView.removeGridHelper(this.sceneView.scene);
        this.editorView.destroy();
        this.editorModel.setActive(false);
        this.isInitialized = false;
    }
}
