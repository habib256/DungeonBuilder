// Model: Définitions des héros et des monstres
// Données pures - aucune logique Three.js

class EntityData {
    static MONSTER_MATERIAL = { color: 0xF5F5DC, specular: 0x111111, shininess: 50 };
    static HERO_MATERIAL = { color: 0x800080, specular: 0x111111, shininess: 50 };

    static getMonsters() {
        return [
            {
                path: 'HeroQuest/HQ_skeleton.stl',
                position: { x: -7, y: 3.9, z: 7 },
                scale: { x: 0.1, y: 0.1, z: 0.1 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 },
                category: 'HeroQuest'
            },
            {
                path: 'HeroQuest/ChaosDoomGuard_Sword_v2.stl',
                position: { x: 10.5, y: 2.5, z: 3.5 },
                scale: { x: 0.1, y: 0.1, z: 0.1 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 4 - Math.PI / 5 },
                category: 'HeroQuest'
            },
            {
                path: 'HeroQuest/Zombie.stl',
                position: { x: 0.2, y: 2.5, z: 3.5 },
                scale: { x: 0.1, y: 0.1, z: 0.1 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 },
                category: 'HeroQuest'
            },
        ];
    }

    static getHeroes() {
        return [
            {
                path: 'HeroQuest/elf_mage_by_nicoledelancret.stl',
                position: { x: 0, y: 2.5, z: 10.5 },
                scale: { x: 0.1, y: 0.1, z: 0.1 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI },
                category: 'HeroQuest'
            },
            {
                path: 'HeroQuest/paladin_defensive.stl',
                position: { x: 7, y: 2.5, z: 10.5 },
                scale: { x: 0.1, y: 0.1, z: 0.1 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI + Math.PI / 2 },
                category: 'HeroQuest'
            },
        ];
    }
}
