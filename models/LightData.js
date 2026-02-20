// Model: Configuration des lumières de la scène
// Données pures - aucune logique Three.js

class LightData {
    static getAll() {
        return [
            {
                type: 'point',
                color: 0xffffff,
                intensity: 0.6,
                position: { x: -3, y: 7, z: 7 },
                castShadow: true
            },
            {
                type: 'point',
                color: 0xffffff,
                intensity: 0.6,
                position: { x: 7, y: 7, z: 3.5 },
                castShadow: true
            },
        ];
    }
}
