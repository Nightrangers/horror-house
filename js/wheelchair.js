import * as THREE from 'three';

export class Wheelchair {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.wheels = [];
    }

    build() {
        // Simple wheelchair representation
        const seatGeo = new THREE.BoxGeometry(2, 0.2, 2);
        const seatMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const seat = new THREE.Mesh(seatGeo, seatMat);
        seat.position.y = 2;
        this.group.add(seat);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(1, 1, 0.2, 16);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        for(let i=-1; i<=1; i+=2) {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(i * 1.2, 1, 0);
            this.wheels.push(wheel);
            this.group.add(wheel);
        }

        // The Woman (Procedural primitive character)
        const dressGeo = new THREE.CylinderGeometry(0.5, 1, 3, 8);
        const dressMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const dress = new THREE.Mesh(dressGeo, dressMat);
        dress.position.y = 3.5;
        this.group.add(dress);

        const headGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 5.2;
        this.group.add(head);

        const hairGeo = new THREE.PlaneGeometry(1.5, 2);
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 4.8, 0.6);
        this.group.add(hair);

        this.group.position.set(0, 0, -180);
        this.scene.add(this.group);
    }

    chase(playerPosition, delta) {
        // Move towards player
        const speed = 12 * delta;
        this.group.position.z += speed;
        
        // Spin wheels
        this.wheels.forEach(w => w.rotation.x += speed);
    }
}
