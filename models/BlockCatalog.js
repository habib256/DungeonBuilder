// Model: Catalogue de tous les blocs STL disponibles pour construire le donjon
// Données pures - aucune logique Three.js

class BlockCatalog {
    static getDefaultScale() {
        return { x: 0.1, y: 0.1, z: 0.1 };
    }

    static getDefaultPosition() {
        return { x: 0, y: 0, z: 0 };
    }

    static getDefaultRotationWall() {
        return { x: -Math.PI / 2, y: 0, z: Math.PI / 2 };
    }

    static getDefaultRotationGround() {
        return { x: -Math.PI / 2, y: 0, z: Math.PI };
    }

    static getMaterial() {
        return { color: 0x8B4513, specular: 0x332211, shininess: 30 };
    }

    static getAll() {
        const s = BlockCatalog.getDefaultScale();
        const p0 = BlockCatalog.getDefaultPosition();
        const p2 = { x: 2, y: 0, z: 0 };
        const rW = BlockCatalog.getDefaultRotationWall();
        const rG = BlockCatalog.getDefaultRotationGround();

        return [
            { path: 'DB1/UD-017-Ground Stones 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-001-Wall.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-002-Wall Skulls 1.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-003-Wall Skulls 2.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-004-Wall Window.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-005-Wall Window Broken.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-006-Wall Wood.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-007-Wall Chains.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-008-Wall Broken.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-009-Wall Debris.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-010-Door.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-011-Door Bar.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-012-Corridor.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-013-Angle Skulls.stl', pos: p0, scale: s, rot: rW, cat: 'DB1' },
            { path: 'DB1/UD-014-Angle.stl', pos: p2, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-015-Well.stl', pos: p2, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-016-Ground Stones 1.stl', pos: p2, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-017-Ground Stones 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-018-Ground Hole.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-019-Bridge.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-020-Bridge Broken.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-021-Stair 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-022-Stair 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-023-Level.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-024-Stair Angle.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-025-Stair Angle Skulls.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-026-Stair Down.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-027-Bed 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-028-Wall Bags.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-029-Ground Bags.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-030-Bed 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-031-Ground Table Full.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-032-Ground Table Empty.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-033-Ground Bench.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-034-Wall Barrel.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-035-Ground Wood.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-036-Torch Basic.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-037-Torch Lit.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-038-Torch Extinguished.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-039-Brazier.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-040-Wall Wood Ground.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-041-Fountain Empty.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-042-Fountain Crystal.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-043-Fountain Toxic Liquid.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-044-Fountain Treasure.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-045-Ground Tile 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-046-Ground Tile 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-047-Ground Tile 3.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-048-Ground Symbol Crossbow.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-049-Ground Symbol Pentacle.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-050-Ground Symbol Fire.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-051-Ground Symbol Skull.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-052-Ground Symbol Cross 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-053-Ground Symbol Cross 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-054-Prison Cell Door.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-055-Prison Cell Angle.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-056-Prison Cell Wall.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-057-Prison Ground.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-058-Prison Corner.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-059-Prison Cell U-Shaped.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-060-Torture Cage.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-061-Torture Bed.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-062-Torture Chair.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-063-Wall Wooden Trap.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-064-Ground Grid.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-065-Ground Toxic Poison.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-066-Ground Lever.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-067-Hole Trap.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-068-Wall Weapons.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-069-Small Wall Skulls 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-070-Small Wall Skulls 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-071-Small Angle Skulls.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-072-Small Wall.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-073-Small Angle.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-074-Water.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-075-Water With Rocks.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-076-Water With Skulls.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-077-Well Water.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-078-Arch.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-079-Arch Broken.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-080-Autel.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-081-Autel Without Sheet.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-082-Double Door Left.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-083-Double Door Right.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-084-Column.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-088-Column Skulls Broken 1.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-089-Column Skulls Broken 2.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-090-Column Square Key.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
            { path: 'DB1/UD-091-Column Round Key.stl', pos: p0, scale: s, rot: rG, cat: 'DB1' },
        ];
    }
}
