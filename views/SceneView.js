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
    }

    addToScene(object) {
        this.scene.add(object);
    }

    removeFromScene(object) {
        this.scene.remove(object);
    }

    showLoading() {
        const loader = new THREE.STLLoader();
        loader.load('PleaseWait.stl', (geometry) => {
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100 });
            this.pleaseWaitMesh = new THREE.Mesh(geometry, material);
            this.pleaseWaitMesh.receiveShadow = true;
            this.pleaseWaitMesh.scale.set(0.15, 0.15, 0.15);
            this.pleaseWaitMesh.rotation.set(-7, 0, 0);
            this.scene.add(this.pleaseWaitMesh);
        });
    }

    hideLoading() {
        if (this.pleaseWaitMesh) {
            this.scene.remove(this.pleaseWaitMesh);
            this.pleaseWaitMesh = null;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
