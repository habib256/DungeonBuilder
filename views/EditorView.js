// View: Interface utilisateur de l'éditeur de niveau
// Panneau latéral avec catalogue de blocs, outils et export/import

class EditorView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.container = null;
        this.catalogContainer = null;
        this.selectedBlockIndex = 0;
        this.currentMode = EditorModel.MODES.PLACE;
        this.currentRotationY = 0;
        this.onBlockSelect = null;
        this.onModeChange = null;
        this.onRotate = null;
        this.onClear = null;
        this.onExport = null;
        this.onImport = null;
        this.onLoadExistingMap = null;
        this.gridHelper = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'editor-panel';
        this.container.innerHTML = this.buildHTML();
        document.body.appendChild(this.container);
        this.bindEvents();
        this.buildCatalog();
        this.updateModeButtons();
        this.updateRotationDisplay();
    }

    buildHTML() {
        return `
            <div class="editor-header">
                <h2>Editeur de Niveau</h2>
                <button id="editor-toggle" class="editor-btn editor-btn-close" title="Fermer">&times;</button>
            </div>

            <div class="editor-section">
                <h3>Mode</h3>
                <div class="editor-modes">
                    <button id="mode-place" class="editor-btn mode-btn active" title="Placer (P)">Placer</button>
                    <button id="mode-delete" class="editor-btn mode-btn" title="Supprimer (X)">Supprimer</button>
                    <button id="mode-view" class="editor-btn mode-btn" title="Vue (V)">Vue</button>
                </div>
            </div>

            <div class="editor-section">
                <h3>Rotation</h3>
                <div class="editor-rotation">
                    <button id="rotate-left" class="editor-btn" title="Tourner gauche (Q)">&#8634;</button>
                    <span id="rotation-display">0&deg;</span>
                    <button id="rotate-right" class="editor-btn" title="Tourner droite (E)">&#8635;</button>
                </div>
            </div>

            <div class="editor-section">
                <h3>Hauteur (Y)</h3>
                <div class="editor-height">
                    <button id="height-down" class="editor-btn" title="Descendre">-</button>
                    <span id="height-display">Sol (0.7)</span>
                    <button id="height-up" class="editor-btn" title="Monter">+</button>
                </div>
            </div>

            <div class="editor-section">
                <h3>Catalogue de Blocs</h3>
                <input type="text" id="block-search" class="editor-input" placeholder="Rechercher un bloc...">
                <div class="editor-category-filters">
                    <button class="editor-btn cat-btn active" data-cat="all">Tous</button>
                </div>
                <div id="block-catalog" class="editor-catalog"></div>
            </div>

            <div class="editor-section">
                <h3>Actions</h3>
                <div class="editor-actions">
                    <button id="action-clear" class="editor-btn editor-btn-danger">Vider la carte</button>
                    <button id="action-export" class="editor-btn editor-btn-primary">Exporter JSON</button>
                    <button id="action-import" class="editor-btn editor-btn-primary">Importer JSON</button>
                    <input type="file" id="import-file" accept=".json" style="display:none">
                </div>
            </div>

            <div class="editor-section">
                <h3>Charger une carte</h3>
                <div class="editor-actions">
                    <button class="editor-btn load-map-btn" data-map="0">Carte 0 - Grille</button>
                    <button class="editor-btn load-map-btn" data-map="1">Carte 1 - Donjon</button>
                    <button class="editor-btn load-map-btn" data-map="2">Carte 2 - Motifs</button>
                </div>
            </div>

            <div class="editor-section editor-info">
                <h3>Raccourcis</h3>
                <div class="editor-shortcuts">
                    <span><kbd>P</kbd> Placer</span>
                    <span><kbd>X</kbd> Supprimer</span>
                    <span><kbd>V</kbd> Vue</span>
                    <span><kbd>Q</kbd>/<kbd>E</kbd> Rotation</span>
                    <span><kbd>Tab</kbd> Panneau</span>
                </div>
                <div id="block-count" class="editor-count">Blocs: 0</div>
            </div>
        `;
    }

    buildCatalog() {
        this.catalogContainer = document.getElementById('block-catalog');
        const catalog = BlockCatalog.getAll();
        const categories = new Set();

        catalog.forEach((block, index) => {
            categories.add(block.cat);

            const item = document.createElement('div');
            item.className = 'catalog-item';
            item.dataset.index = index;
            item.dataset.cat = block.cat;

            // Extraire un nom lisible du chemin du fichier
            const name = this.extractBlockName(block.path);

            item.innerHTML = `
                <div class="catalog-item-index">${index}</div>
                <div class="catalog-item-name" title="${name}">${name}</div>
            `;

            if (index === this.selectedBlockIndex) {
                item.classList.add('selected');
            }

            item.addEventListener('click', () => {
                if (this.onBlockSelect) this.onBlockSelect(index);
            });

            this.catalogContainer.appendChild(item);
        });

        // Ajouter les filtres de catégories
        const filterContainer = this.container.querySelector('.editor-category-filters');
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'editor-btn cat-btn';
            btn.dataset.cat = cat;
            btn.textContent = cat;
            btn.addEventListener('click', () => this.filterByCategory(cat));
            filterContainer.appendChild(btn);
        });
    }

    extractBlockName(path) {
        const filename = path.split('/').pop().replace('.stl', '');
        // Retirer le prefixe "UD-XXX-"
        return filename.replace(/^UD-\d+-/, '');
    }

    filterByCategory(cat) {
        const items = this.catalogContainer.querySelectorAll('.catalog-item');
        const buttons = this.container.querySelectorAll('.cat-btn');

        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === cat || (cat === 'all' && btn.dataset.cat === 'all'));
        });

        items.forEach(item => {
            if (cat === 'all' || item.dataset.cat === cat) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    bindEvents() {
        // Toggle panneau
        document.getElementById('editor-toggle').addEventListener('click', () => {
            this.container.classList.toggle('collapsed');
        });

        // Modes
        document.getElementById('mode-place').addEventListener('click', () => {
            if (this.onModeChange) this.onModeChange(EditorModel.MODES.PLACE);
        });
        document.getElementById('mode-delete').addEventListener('click', () => {
            if (this.onModeChange) this.onModeChange(EditorModel.MODES.DELETE);
        });
        document.getElementById('mode-view').addEventListener('click', () => {
            if (this.onModeChange) this.onModeChange(EditorModel.MODES.VIEW);
        });

        // Rotation
        document.getElementById('rotate-left').addEventListener('click', () => {
            if (this.onRotate) this.onRotate(-1);
        });
        document.getElementById('rotate-right').addEventListener('click', () => {
            if (this.onRotate) this.onRotate(1);
        });

        // Hauteur
        this.currentHeight = 0.7;
        this.heightLevel = 0; // 0 = sol, 1 = mur, etc.
        document.getElementById('height-down').addEventListener('click', () => {
            this.heightLevel = Math.max(-2, this.heightLevel - 1);
            this.updateHeight();
        });
        document.getElementById('height-up').addEventListener('click', () => {
            this.heightLevel = Math.min(5, this.heightLevel + 1);
            this.updateHeight();
        });

        // Recherche
        document.getElementById('block-search').addEventListener('input', (e) => {
            this.searchBlocks(e.target.value);
        });

        // Filtre "Tous"
        this.container.querySelector('.cat-btn[data-cat="all"]').addEventListener('click', () => {
            this.filterByCategory('all');
        });

        // Actions
        document.getElementById('action-clear').addEventListener('click', () => {
            if (confirm('Vider toute la carte ?')) {
                if (this.onClear) this.onClear();
            }
        });
        document.getElementById('action-export').addEventListener('click', () => {
            if (this.onExport) this.onExport();
        });
        document.getElementById('action-import').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (this.onImport) this.onImport(data);
                } catch (err) {
                    alert('Fichier JSON invalide');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });

        // Charger carte existante
        this.container.querySelectorAll('.load-map-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mapNb = parseInt(btn.dataset.map);
                if (confirm(`Charger la carte ${mapNb} ? Les blocs actuels seront remplacés.`)) {
                    if (this.onLoadExistingMap) this.onLoadExistingMap(mapNb);
                }
            });
        });

        // Raccourcis clavier - stocker la référence pour pouvoir la retirer dans destroy()
        this.keydownHandler = (e) => {
            // Ignorer si on tape dans un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case 'p':
                    if (this.onModeChange) this.onModeChange(EditorModel.MODES.PLACE);
                    break;
                case 'x':
                    if (this.onModeChange) this.onModeChange(EditorModel.MODES.DELETE);
                    break;
                case 'v':
                    if (this.onModeChange) this.onModeChange(EditorModel.MODES.VIEW);
                    break;
                case 'q':
                    if (this.onRotate) this.onRotate(-1);
                    break;
                case 'e':
                    if (this.onRotate) this.onRotate(1);
                    break;
                case 'tab':
                    e.preventDefault();
                    this.container.classList.toggle('collapsed');
                    break;
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
    }

    updateHeight() {
        const heights = {
            '-2': { label: 'Sous-sol (-6.3)', value: -6.3 },
            '-1': { label: 'Bas (-3.5)', value: -3.5 },
            '0': { label: 'Sol (0.7)', value: 0.7 },
            '1': { label: 'Mur (0)', value: 0 },
            '2': { label: 'Etage 1 (3.5)', value: 3.5 },
            '3': { label: 'Etage 2 (7)', value: 7 },
            '4': { label: 'Etage 3 (10.5)', value: 10.5 },
            '5': { label: 'Etage 4 (14)', value: 14 }
        };
        const h = heights[this.heightLevel] || heights['0'];
        this.currentHeight = h.value;
        document.getElementById('height-display').textContent = h.label;
    }

    searchBlocks(query) {
        const items = this.catalogContainer.querySelectorAll('.catalog-item');
        const q = query.toLowerCase();
        items.forEach(item => {
            const name = item.querySelector('.catalog-item-name').textContent.toLowerCase();
            item.style.display = name.includes(q) ? '' : 'none';
        });
    }

    setSelectedBlock(index) {
        this.selectedBlockIndex = index;
        const items = this.catalogContainer.querySelectorAll('.catalog-item');
        items.forEach(item => {
            item.classList.toggle('selected', parseInt(item.dataset.index) === index);
        });
        // Scroll vers le bloc sélectionné
        const selected = this.catalogContainer.querySelector('.catalog-item.selected');
        if (selected) selected.scrollIntoView({ block: 'nearest' });
    }

    setMode(mode) {
        this.currentMode = mode;
        this.updateModeButtons();
    }

    updateModeButtons() {
        document.getElementById('mode-place').classList.toggle('active', this.currentMode === EditorModel.MODES.PLACE);
        document.getElementById('mode-delete').classList.toggle('active', this.currentMode === EditorModel.MODES.DELETE);
        document.getElementById('mode-view').classList.toggle('active', this.currentMode === EditorModel.MODES.VIEW);
    }

    updateRotationDisplay() {
        const degrees = Math.round((this.currentRotationY * 180) / Math.PI) % 360;
        const display = document.getElementById('rotation-display');
        if (display) display.textContent = `${degrees}\u00B0`;
    }

    setRotation(rotY) {
        this.currentRotationY = rotY;
        this.updateRotationDisplay();
    }

    updateBlockCount(count) {
        const el = document.getElementById('block-count');
        if (el) el.textContent = `Blocs: ${count}`;
    }

    createGridHelper(scene) {
        if (this.gridHelper) scene.remove(this.gridHelper);
        const size = 20 * MapData.GRID_SPACING;
        const divisions = 20;
        this.gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x222222);
        this.gridHelper.position.y = 0.01;
        scene.add(this.gridHelper);
    }

    removeGridHelper(scene) {
        if (this.gridHelper) {
            scene.remove(this.gridHelper);
            this.gridHelper = null;
        }
    }

    destroy() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
