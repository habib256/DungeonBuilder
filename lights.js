class Lights {
    constructor() {
        this.lights = [];
        this.initLights();
    }

    initLights() {
        // Ajout d'une lumière ponctuelle principale
        const pointLight = new THREE.PointLight(0xffffff, 0.6);
        pointLight.position.set(-3, 7, 7);
        pointLight.castShadow = true; // Activer les ombres pour cette lumière
        this.lights.push(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.6);
        pointLight2.position.set(7, 7, 3.5);
        pointLight2.castShadow = true; // Activer les ombres pour cette lumière
        this.lights.push(pointLight2);
    }

    addto(scene) {
        this.lights.forEach(light => {
            scene.add(light);
        });
    }
}
