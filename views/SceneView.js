// View: Gestion de la scène Three.js, caméra, rendu et contrôles

class SceneView {
    constructor(eventBus) {
        this.eventBus = eventBus;

        // Scène
        this.scene = new THREE.Scene();

        // Caméra
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 20);

        // Rendu
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Contrôles orbitaux
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        // Écran de chargement
        this.pleaseWaitMesh = null;
        this.isLoadingVisible = false;
        this.isPleaseWaitLoading = false;

        // Gestion du redimensionnement
        window.addEventListener('resize', () => this.onWindowResize());

        // Écouter les événements
        this.eventBus.on(EventBus.Events.LOADING_START, () => this.showLoading());
        this.eventBus.on(EventBus.Events.LOADING_COMPLETE, () => this.hideLoading());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Suit un changement d'écran (fenêtre déplacée vers un moniteur
        // de densité différente), sinon le rendu reste flou ou suréchantillonné.
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    addToScene(object) {
        this.scene.add(object);
    }

    removeFromScene(object) {
        this.scene.remove(object);
    }

    showLoading() {
        if (this.isLoadingVisible) return;
        this.isLoadingVisible = true;

        if (this.pleaseWaitMesh) {
            this.scene.add(this.pleaseWaitMesh);
            return;
        }
        // Un cycle show/hide/show avant l'arrivée du STL lancerait sinon un
        // second chargement, et le premier mesh resterait orphelin.
        if (this.isPleaseWaitLoading) return;
        this.isPleaseWaitLoading = true;

        const loader = new THREE.STLLoader();
        loader.load('PleaseWait.stl', (geometry) => {
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.receiveShadow = true;
            mesh.scale.set(0.15, 0.15, 0.15);
            mesh.rotation.set(-7, 0, 0);
            this.pleaseWaitMesh = mesh;
            this.isPleaseWaitLoading = false;

            // Le chargement peut s'être terminé avant l'arrivée du STL :
            // sans ce test le mesh resterait affiché indéfiniment.
            if (this.isLoadingVisible) {
                this.scene.add(mesh);
            }
        }, undefined, (error) => {
            this.isPleaseWaitLoading = false;
            console.error('Erreur chargement PleaseWait.stl:', error);
        });
    }

    hideLoading() {
        this.isLoadingVisible = false;
        if (this.pleaseWaitMesh) {
            this.scene.remove(this.pleaseWaitMesh);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
