// View: Interface utilisateur de l'éditeur de niveau
// Panneau latéral avec catalogue de blocs, outils et export/import

class EditorView {
    // Paliers de hauteur, triés par valeur croissante : le bouton "+" doit
    // toujours monter (l'ancienne table plaçait "Mur (0)" au-dessus de
    // "Sol (0.7)" et "+" faisait donc descendre le bloc).
    static HEIGHT_LEVELS = [
        { label: 'Sous-sol (-6.3)', value: -6.3 },
        { label: 'Bas (-3.5)', value: -3.5 },
        { label: 'Mur (0)', value: 0 },
        { label: 'Sol (0.7)', value: 0.7 },
        { label: 'Etage 1 (3.5)', value: 3.5 },
        { label: 'Etage 2 (7)', value: 7 },
        { label: 'Etage 3 (10.5)', value: 10.5 },
        { label: 'Etage 4 (14)', value: 14 },
    ];
    static DEFAULT_HEIGHT_LEVEL = 3; // Sol (0.7)

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
        this.openButton = null;
        this.keydownHandler = null;
        this.onHeightChange = null;
        this.currentCategory = 'all';
        this.currentSearch = '';
        // Lu par EditorController dès le premier mousemove : doit exister
        // même si bindEvents() n'a pas encore tourné.
        this.heightLevel = EditorView.DEFAULT_HEIGHT_LEVEL;
        this.currentHeight = EditorView.HEIGHT_LEVELS[this.heightLevel].value;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'editor-panel';
        this.container.innerHTML = this.buildHTML();
        document.body.appendChild(this.container);
        this.createOpenButton();
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

    // Le panneau replié sort entièrement de l'écran avec son bouton de
    // fermeture : sans ce bouton flottant (déjà prévu par la CSS) il ne
    // restait que le raccourci Tab, décrit dans le panneau devenu invisible.
    createOpenButton() {
        this.openButton = document.createElement('button');
        this.openButton.id = 'editor-open-btn';
        this.openButton.textContent = 'Editeur';
        this.openButton.title = 'Ouvrir l\'éditeur (Tab)';
        this.openButton.addEventListener('click', () => this.setCollapsed(false));
        document.body.appendChild(this.openButton);
    }

    setCollapsed(collapsed) {
        if (!this.container) return;
        this.container.classList.toggle('collapsed', collapsed);
        if (this.openButton) this.openButton.classList.toggle('visible', collapsed);
    }

    toggleCollapsed() {
        this.setCollapsed(!this.container.classList.contains('collapsed'));
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
        this.currentCategory = cat;
        const buttons = this.container.querySelectorAll('.cat-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === cat);
        });
        this.applyCatalogFilters();
    }

    // Catégorie et recherche sont deux filtres cumulatifs : les appliquer
    // séparément faisait réapparaître les blocs exclus par l'autre.
    applyCatalogFilters() {
        if (!this.catalogContainer) return;
        const q = this.currentSearch;
        const cat = this.currentCategory;

        this.catalogContainer.querySelectorAll('.catalog-item').forEach(item => {
            const matchesCat = (cat === 'all' || item.dataset.cat === cat);
            const name = item.querySelector('.catalog-item-name').textContent.toLowerCase();
            const matchesSearch = (q === '' || name.includes(q));
            item.style.display = (matchesCat && matchesSearch) ? '' : 'none';
        });
    }

    bindEvents() {
        // Toggle panneau
        document.getElementById('editor-toggle').addEventListener('click', () => {
            this.toggleCollapsed();
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
        document.getElementById('height-down').addEventListener('click', () => {
            this.heightLevel = Math.max(0, this.heightLevel - 1);
            this.updateHeight();
        });
        document.getElementById('height-up').addEventListener('click', () => {
            this.heightLevel = Math.min(EditorView.HEIGHT_LEVELS.length - 1, this.heightLevel + 1);
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
            reader.onerror = () => {
                alert('Impossible de lire le fichier');
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

        // Raccourcis clavier (référence conservée pour pouvoir se désabonner
        // dans destroy(), sinon le listener survit au panneau détruit)
        this.keydownHandler = (e) => {
            if (!this.container) return;

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
                    this.toggleCollapsed();
                    break;
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
    }

    updateHeight() {
        const h = EditorView.HEIGHT_LEVELS[this.heightLevel] ||
            EditorView.HEIGHT_LEVELS[EditorView.DEFAULT_HEIGHT_LEVEL];
        this.currentHeight = h.value;
        const display = document.getElementById('height-display');
        if (display) display.textContent = h.label;
        // La grille et la prévisualisation restaient sinon à l'ancienne
        // hauteur jusqu'au prochain mouvement de souris.
        this.setGridHeight(this.currentHeight);
        if (this.onHeightChange) this.onHeightChange(this.currentHeight);
    }

    searchBlocks(query) {
        this.currentSearch = query.trim().toLowerCase();
        this.applyCatalogFilters();
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
        if (!this.container) return;
        const modes = {
            'mode-place': EditorModel.MODES.PLACE,
            'mode-delete': EditorModel.MODES.DELETE,
            'mode-view': EditorModel.MODES.VIEW
        };
        for (const [id, mode] of Object.entries(modes)) {
            const btn = document.getElementById(id);
            if (btn) btn.classList.toggle('active', this.currentMode === mode);
        }
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
        this.removeGridHelper(scene);
        const size = 20 * MapData.GRID_SPACING;
        const divisions = 20;
        this.gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x222222);
        scene.add(this.gridHelper);
        this.setGridHeight(this.currentHeight);
    }

    // Léger décalage pour éviter le z-fighting avec les dalles posées au sol
    setGridHeight(y) {
        if (this.gridHelper) this.gridHelper.position.y = y + 0.01;
    }

    removeGridHelper(scene) {
        if (this.gridHelper) {
            scene.remove(this.gridHelper);
            // La grille possède sa propre géométrie : un cycle
            // destroy()/init() en abandonnait une à chaque passage.
            if (this.gridHelper.geometry) this.gridHelper.geometry.dispose();
            if (this.gridHelper.material) this.gridHelper.material.dispose();
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
        if (this.openButton) {
            this.openButton.remove();
            this.openButton = null;
        }
        this.catalogContainer = null;
    }
}
