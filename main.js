// Initialisation de la carte du Dungeon, des monstres, des heros et des lumières
const dungeon = new Dungeon();
const heroes = new Heroes();
const monsters = new Monsters();
const lights = new Lights();

// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Activer ou Désactiver les ombres
document.body.appendChild(renderer.domElement);

let controls;

// Importer le loader STL
const loader = new THREE.STLLoader();

let pleaseWaitMesh;

function showPleaseWait() {
    loader.load('PleaseWait.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 100 });
        pleaseWaitMesh = new THREE.Mesh(geometry, material);
        pleaseWaitMesh.receiveShadow = true;
        pleaseWaitMesh.scale.set(0.15, 0.15, 0.15); // Ajustez l'échelle selon vos besoins
        pleaseWaitMesh.rotation.set(-7,0,0); // Tourner pour voir de face

        scene.add(pleaseWaitMesh);

    });
}

function removePleaseWait() {
    if (pleaseWaitMesh) {
        scene.remove(pleaseWaitMesh);
    }
}

function init() {
    // Initialisation des contrôles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 20, 20);
    controls.update();
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

function checkDungeonReadyAndAddToScene() {
    if (!dungeon.ready) {
        dungeon.loadDungeonSTLs().then(() => {
            setTimeout(checkDungeonReadyAndAddToScene, 10); // Attendre 10 ms avant de réessayer
        });
    } else {
        removePleaseWait();
        dungeon.addto(scene);
        monsters.addto(scene);
        heroes.addto(scene);
        console.log('Bienvenue sous DungeonBuilder');
    }
}

// Assurez-vous d'appeler 'init' avant 'animate'
init();

showPleaseWait();
animate();
lights.addto(scene);

checkDungeonReadyAndAddToScene();
