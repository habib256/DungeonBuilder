// View: Création et rendu des lumières Three.js

class LightView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.lights = [];
    }

    createLights(lightDataList) {
        this.lights = [];
        for (const data of lightDataList) {
            let light;
            if (data.type === 'point') {
                light = new THREE.PointLight(data.color, data.intensity);
            }
            light.position.set(data.position.x, data.position.y, data.position.z);
            light.castShadow = data.castShadow;
            this.lights.push(light);
        }
    }

    addToScene(scene) {
        this.lights.forEach(light => scene.add(light));
    }
}
