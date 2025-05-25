import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js";

export class myBoid extends THREE.Mesh  {
    constructor(size =0.3,color= 0x6fc4ee,config = {}) {

        super(
            new THREE.SphereGeometry(size, 32, 32),
            new THREE.MeshBasicMaterial({color})
          )
        this.config = {
            separation: config.separation || 0.20,
            alignment: config.alignment || 0.10,
            cohesion: config.cohesion || 0.10,
            maxSpeed: config.maxSpeed || 0.0005,
            protectRange: 5
        };

        this.position.set(
            (Math.random() - 0.5) * 20,0,
            (Math.random() - 0.5) * 20
        );
        
        this.velocity = new THREE.Vector3(0,0,0);
        this.cohesionBoids = [];
    }

    SetcohesionBoids(boidsId){
        this.cohesionBoids = boidsId ;
    }

    
    update(Devices,deltaTime) {
        this.Boidsalgorithm(Devices)
        // Actualizar posición
        this.position.add(this.velocity.multiplyScalar(deltaTime));
    }

    Boidsalgorithm(Devices){
        
        //
        //if(cohesionBoids.length =0){
        //}else{
        //}

        let separation = new THREE.Vector3();
            Devices.forEach(other => {
                if (other.id !== this.id) 
                {
                        
                    const distance = this.position.distanceTo(other.position);
                    console.log("other "+other.id+" dis "+distance)
                    if (distance < this.config.protectRange) {
                    //separation.sub(other.position).sub(this.position).normalize();
                    separation.add(this.position).sub(other.position);
                    }
                    //else{
                        //}
                }
            });

            // Alineación
            let alignment = new THREE.Vector3();
            Devices.forEach(other => {
                if (other.id !== this.id) {
                    alignment.add(other.velocity);
                }
            });
            alignment.divideScalar(Devices.length - 1);

            // Cohesión
            let cohesion = new THREE.Vector3();
            let neighboring_boids  =0
            Devices.forEach(other => {
                if (other.id !== this.id) {
                    const distance = this.position.distanceTo(other.position);
                    if (distance > this.config.protectRange) {
                    cohesion.add(other.position);
                    neighboring_boids += 1
                    }
                }
            });
            cohesion.divideScalar(neighboring_boids);
            console.log(this.id+" separation "+neighboring_boids+" cohesion"+cohesion.x +" "+cohesion.y+" "+cohesion.z)
            cohesion.sub(this.position);
            console.log(this.id+" separation"+separation.x +" "+separation.y+" "+separation.z+"cohesion"+cohesion.x +" "+cohesion.y+" "+cohesion.z)
            // Aplicar fuerzas
            this.velocity.add(separation.multiplyScalar(this.config.separation));
            //this.velocity.add(alignment.multiplyScalar(this.config.alignment));
            this.velocity.add(cohesion.multiplyScalar(this.config.cohesion));

            // Limitar velocidad
            if (this.velocity.length() > this.config.maxSpeed) {
                this.velocity.normalize().multiplyScalar(this.config.maxSpeed);
            }

    }



}