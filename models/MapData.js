// Model: Données de placement des blocs pour chaque carte du donjon
// Chaque entrée : [blockIndex, x, y, z, rx, ry, rz]

class MapData {
    static GRID_SPACING = 3.5;
    static FLOOR_Y_OFFSET = 0.7;

    static getMap(mapNumber) {
        switch (mapNumber) {
            case 0: return MapData.generateFloorGrid();
            case 1: return MapData.getMap1();
            case 2: return MapData.generatePatternMap();
            default: return MapData.getMap1();
        }
    }

    static generateFloorGrid() {
        const blocks = [];
        const G = MapData.GRID_SPACING;
        const Y = MapData.FLOOR_Y_OFFSET;
        for (let i = -10; i < 10; i++) {
            for (let j = -10; j < 10; j++) {
                blocks.push([0, i * G, Y, j * G, -Math.PI / 2, 0, Math.PI / 2]);
            }
        }
        return blocks;
    }

    static getMap1() {
        const H = Math.PI / 2;
        const P = Math.PI;
        return [
            // Rangée nord (z=0) - Murs
            [13, -10.5, 0, 0, -H, 0, H],
            [1, -7, 0, 0, -H, 0, H],
            [1, -3.5, 0, 0, -H, 0, H],
            [82, 0, 0, 0, -H, 0, H],
            [83, 3.5, 0, 0, -H, 0, H],
            [1, 7, 0, 0, -H, 0, H],
            [1, 10.5, 0, 0, -H, 0, H],
            [13, 14, 0, 0, -H, 0, 0],

            // Rangée z=3.5 - Sol + murs latéraux
            [4, -10.5, 0, 3.5, -H, 0, -P],
            [16, -7, 0.7, 3.5, -H, 0, H],
            [17, -3.5, 0.7, 3.5, -H, 0, H],
            [16, 0, 0.7, 3.5, -H, 0, H],
            [16, 3.5, 0.7, 3.5, -H, 0, H],
            [17, 7, 0.7, 3.5, -H, 0, H],
            [16, 10.5, 0.7, 3.5, -H, 0, H],
            [4, 14, 0, 3.5, -H, 0, 0],

            // Rangée z=7 - Sol + murs latéraux
            [10, -10.5, 0, 7, -H, 0, -P],
            [16, -7, 0.7, 7, -H, 0, H],
            [17, -3.5, 0.7, 7, -H, 0, H],
            [16, 0, 0.7, 7, -H, 0, H],
            [16, 3.5, 0.7, 7, -H, 0, H],
            [17, 7, 0.7, 7, -H, 0, H],
            [16, 10.5, 0.7, 7, -H, 0, H],
            [60, 14, 0, 7, -H, 0, 0],

            // Rangée z=10.5 - Sol + murs latéraux
            [4, -10.5, 0, 10.5, -H, 0, -P],
            [16, -7, 0.7, 10.5, -H, 0, H],
            [17, -3.5, 0.7, 10.5, -H, 0, H],
            [16, 0, 0.7, 10.5, -H, 0, H],
            [16, 3.5, 0.7, 10.5, -H, 0, H],
            [17, 7, 0.7, 10.5, -H, 0, H],
            [16, 10.5, 0.7, 10.5, -H, 0, H],
            [4, 14, 0, 10.5, -H, 0, 0],

            // Rangée sud (z=14) - Murs
            [84, -10.5, 0, 14, -H, 0, -H],
            [1, -7, 0, 14, -H, 0, -H],
            [68, -3.5, 0, 14, -H, 0, -H],
            [1, 0, 0, 14, -H, 0, -H],
            [1, 3.5, 0, 14, -H, 0, -H],
            [62, 7, 0, 14, -H, 0, -H],
            [1, 10.5, 0, 14, -H, 0, -H],
            [84, 14, 0, 14, -H, 0, H],
        ];
    }

    static generatePatternMap() {
        const blocks = [];
        const G = MapData.GRID_SPACING;
        for (let i = -5; i < 5; i++) {
            for (let j = -5; j < 5; j++) {
                let blockType;
                if ((i + j) % 5 === 0) {
                    blockType = 46;
                } else if ((i + j) % 4 === 0) {
                    blockType = 45;
                } else if ((i + j) % 3 === 0) {
                    blockType = 0;
                } else if ((i + j) % 2 === 0) {
                    blockType = 76;
                } else {
                    blockType = 47;
                }
                blocks.push([blockType, i * G, 0, j * G, -Math.PI / 2, 0, Math.PI / 2]);
            }
        }
        return blocks;
    }
}
