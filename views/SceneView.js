// View: Gestion de la scène Three.js, caméra, rendu et contrôles

class SceneView {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 20, 20);
        this.controls.update();

        this.pleaseWaitMesh = null;
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
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
