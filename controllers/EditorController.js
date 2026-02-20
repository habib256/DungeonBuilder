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
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        // Meshes placés dans la scène par l'éditeur
        this.editorMeshes = [];
        // Mesh de prévisualisation
        this.previewMesh = null;

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

    bindMouseEvents() {
        const canvas = this.sceneView.renderer.domElement;

        canvas.addEventListener('mousemove', (e) => {
            this.onMouseMove(e);
        });

        canvas.addEventListener('click', (e) => {
            this.onMouseClick(e);
        });

        canvas.addEventListener('contextmenu', (e) => {
            if (this.editorModel.mode !== EditorModel.MODES.VIEW) {
                e.preventDefault();
                this.onRightClick(e);
            }
        });
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
        this.raycaster.ray.intersectPlane(plane, intersection);

        if (intersection) {
            const G = MapData.GRID_SPACING;
            intersection.x = Math.round(intersection.x / G) * G;
            intersection.z = Math.round(intersection.z / G) * G;
            intersection.y = height;
            return intersection;
        }
        return null;
    }

    onMouseMove(event) {
        if (this.editorModel.mode === EditorModel.MODES.VIEW) {
            this.removePreview();
            return;
        }

        if (this.editorModel.mode === EditorModel.MODES.PLACE) {
            const pos = this.getGridPosition(event);
            if (pos) {
                this.showPreview(pos);
            }
        } else if (this.editorModel.mode === EditorModel.MODES.DELETE) {
            this.removePreview();
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

        this.editorMeshes.push(clone);
        this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
    }

    deleteBlockAtMouse(event) {
        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.sceneView.camera);

        const intersects = this.raycaster.intersectObjects(this.editorMeshes);
        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const meshIndex = this.editorMeshes.indexOf(hitMesh);
            if (meshIndex !== -1) {
                this.sceneView.scene.remove(hitMesh);
                this.editorMeshes.splice(meshIndex, 1);
                this.editorModel.removeBlock(meshIndex);
                this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
            }
        }
    }

    showPreview(position) {
        this.removePreview();

        const blockIndex = this.editorModel.selectedBlockIndex;
        const mesh = this.dungeonView.getBlockMesh(blockIndex);
        if (!mesh) return;

        this.previewMesh = mesh.clone();
        this.previewMesh.position.copy(position);
        const rotation = this.editorModel.getBlockRotation(blockIndex);
        this.previewMesh.rotation.set(rotation.x, rotation.y, rotation.z);

        // Rendre semi-transparent pour la prévisualisation
        this.previewMesh.material = this.previewMesh.material.clone();
        this.previewMesh.material.transparent = true;
        this.previewMesh.material.opacity = 0.4;
        this.previewMesh.material.color.setHex(0x00ff88);

        this.sceneView.scene.add(this.previewMesh);
    }

    removePreview() {
        if (this.previewMesh) {
            this.sceneView.scene.remove(this.previewMesh);
            this.previewMesh = null;
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
        a.click();
        URL.revokeObjectURL(url);
    }

    importMap(mapData) {
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
            this.sceneView.scene.add(clone);
            this.editorMeshes.push(clone);
        }

        this.editorView.updateBlockCount(this.editorModel.placedBlocks.length);
    }

    destroy() {
        this.removePreview();
        this.clearAllEditorBlocks();
        this.editorView.removeGridHelper(this.sceneView.scene);
        this.editorView.destroy();
        this.editorModel.setActive(false);
        this.isInitialized = false;
    }
}
