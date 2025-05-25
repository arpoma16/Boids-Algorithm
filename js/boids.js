import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js";
import { myBoid } from "./boid.js";
export class Boids {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.boids = [];
        this.config = {
            count: config.count || 1,
            separation: config.separation || 0.20,
            alignment: config.alignment || 0.10,
            cohesion: config.cohesion || 0.10,
            maxSpeed: config.maxSpeed || 0.0005,
            protectRange: 5

        };
        this.createBoids();
    }

    createBoids() {
        for (let i = 0; i < this.config.count; i++) {
            const boid = new myBoid(0.3,0x6fc4ee,this.config)
            this.boids.push(boid);
            this.scene.add(boid);
        }
    }

    updateBoidsCount(newCount) {
        // Eliminar boids existentes
        this.boids.forEach(boid => {
            this.scene.remove(boid);
        });
        this.boids = [];

        // Crear nuevos boids
        this.config.count = newCount;
        this.createBoids();
    }

    update(base,vehicle,deltaTime) {
        let allDevices=Array.from( this.boids)
        allDevices.push(base)
        allDevices.push(vehicle)
        //console.log(allDevices)

        this.boids.forEach(boid => {
            boid.update(allDevices,deltaTime)
        });
    }
} 