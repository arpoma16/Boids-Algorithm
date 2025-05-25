import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { Boids } from './boids.js';

class Simulation {
    constructor() {
        this.scene = new THREE.Scene();
        this.cameras = {};
        this.renderers = {};
        this.objects = {
            base: null,
            vehicle: null
        };
        this.boidsConfig = {
            count: 2,
            separation: 5,
            alignment: 0.1,
            cohesion: 0.5,
            maxSpeed: 3
        };
        this.init();
    }

    init() {
        // Inicializar vistas
        this.initView('main-view', new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
        this.initView('top-view', new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 1000));
        this.initView('front-view', new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 1000));

        // Configurar cámaras
        this.cameras['main-view'].position.set(20, 20, 20);
        this.cameras['top-view'].position.set(0, 40, 0);
        this.cameras['top-view'].lookAt(0, 0, 0);
        this.cameras['front-view'].position.set(0, 0, 40);
        this.cameras['front-view'].lookAt(0, 0, 0);

        // Añadir grid y ejes a la escena compartida
        const gridHelper = new THREE.GridHelper(40, 40);
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(gridHelper);
        this.scene.add(axesHelper);

        // Crear objetos
        this.createBase();
        this.createVehicle();
        this.boids = new Boids(this.scene, this.boidsConfig);

        // Configurar controles
        this.setupControls();
        this.setupEventListeners();

        // Iniciar animación
        this.clock = new THREE.Clock();
        this.animate();
    }

    initView(id, camera) {
        const container = document.getElementById(id);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        this.cameras[id] = camera;
        this.renderers[id] = renderer;

        // Añadir controles orbitales solo para la vista principal
        if (id === 'main-view') {
            this.controls = new OrbitControls(camera, renderer.domElement);
            this.controls.enableDamping = true;
        }
    }

    createBase() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.objects.base = new THREE.Mesh(geometry, material);
        this.objects.base.position.set(0, 0, 0);
        this.objects.base.velocity = new THREE.Vector3(0,0,0);
        this.scene.add(this.objects.base);
    }

    createVehicle() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.objects.vehicle = new THREE.Mesh(geometry, material);
        this.objects.vehicle.position.set(5, 0, 15);
        this.objects.vehicle.velocity = new THREE.Vector3(0,0,0);
        this.scene.add(this.objects.vehicle);
    }

    setupControls() {
        const keys = {};
        window.addEventListener('keydown', (e) => keys[e.key] = true);
        window.addEventListener('keyup', (e) => keys[e.key] = false);

        const moveSpeed = 0.1;
        const updateVehicle = () => {
            if (keys['ArrowUp']) this.objects.vehicle.position.z -= moveSpeed;
            if (keys['ArrowDown']) this.objects.vehicle.position.z += moveSpeed;
            if (keys['ArrowLeft']) this.objects.vehicle.position.x -= moveSpeed;
            if (keys['ArrowRight']) this.objects.vehicle.position.x += moveSpeed;
            if (keys['w']) this.objects.vehicle.position.y += moveSpeed;
            if (keys['s']) this.objects.vehicle.position.y -= moveSpeed;
            
            // Actualizar valores en el panel
            if(Object.values(keys).length >0){
                this.updateVehiclePanelValues();
            }
        };

        setInterval(updateVehicle, 16);
    }

    updateVehiclePanelValues() {
        document.getElementById('vehicle-x').value = this.objects.vehicle.position.x.toFixed(1);
        document.getElementById('vehicle-y').value = this.objects.vehicle.position.y.toFixed(1);
        document.getElementById('vehicle-z').value = this.objects.vehicle.position.z.toFixed(1);
    }

    updateBoidsPanelValues() {
        const boidsList = document.getElementById('boids-list');
        boidsList.innerHTML = '';
        
        this.boids.boids.forEach((boid, index) => {
            const boidDiv = document.createElement('div');
            boidDiv.innerHTML = `Boid ${index + 1}: (${boid.position.x.toFixed(1)}, ${boid.position.y.toFixed(1)}, ${boid.position.z.toFixed(1)})`;
            boidsList.appendChild(boidDiv);
        });
    }

    setupEventListeners() {
        // Actualizar posición de la base
        ['base-x', 'base-y', 'base-z'].forEach((id, index) => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.objects.base.position.setComponent(index, parseFloat(e.target.value));
            });
        });

        // Actualizar posición del vehículo
        ['vehicle-x', 'vehicle-y', 'vehicle-z'].forEach((id, index) => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.objects.vehicle.position.setComponent(index, parseFloat(e.target.value));
            });
        });

        // Actualizar número de boids
        document.getElementById('update-boids').addEventListener('click', () => {
            const newCount = parseInt(document.getElementById('boids-count').value);
            this.boids.updateBoidsCount(newCount);
        });

        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        Object.keys(this.cameras).forEach(id => {
            const camera = this.cameras[id];
            const renderer = this.renderers[id];
            const container = document.getElementById(id);

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
            }

            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.boids.update(this.objects.base, this.objects.vehicle, this.clock.getDelta());
        if (this.controls) this.controls.update();

        // Actualizar panel de boids
        this.updateBoidsPanelValues();

        Object.keys(this.cameras).forEach(id => {
            this.renderers[id].render(this.scene, this.cameras[id]);
        });
    }
}

// Iniciar la simulación
new Simulation(); 