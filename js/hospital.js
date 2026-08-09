import * as THREE from 'three';

export class Hospital {
    constructor(scene) {
        this.scene = scene;
        this.flickerLights = [];
    }

    _generateTile() {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,128,128);
        ctx.strokeStyle = '#222'; ctx.strokeRect(0,0,128,128);
        for(let i=0; i<50; i++) {
            ctx.fillStyle = '#444';
            ctx.fillRect(Math.random()*128, Math.random()*128, 5, 5); // dirt
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(10, 40);
        return tex;
    }

    buildHospital() {
        const length = 150;
        const width = 10;
        
        // Corridor Box (Inside out)
        const geo = new THREE.BoxGeometry(width, 10, length);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x889988, 
            side: THREE.BackSide,
            map: this._generateTile() 
        });
        const corridor = new THREE.Mesh(geo, mat);
        corridor.position.set(0, 5, -125);
        this.scene.add(corridor);

        // Broken Lights
        for (let i = 0; i < 5; i++) {
            const z = -60 - (i * 30);
            const light = new THREE.PointLight(0x88ffaa, 0, 15);
            light.position.set(0, 9, z);
            this.scene.add(light);
            this.flickerLights.push(light);
        }

        // Final Door
        const doorGeo = new THREE.BoxGeometry(4, 7, 0.5);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const finalDoor = new THREE.Mesh(doorGeo, doorMat);
        finalDoor.position.set(0, 3.5, -199);
        finalDoor.userData = { interactable: true, name: 'finalDoor' };
        this.scene.add(finalDoor);
    }

    update(time) {
        // Random flickering
        this.flickerLights.forEach(light => {
            light.intensity = Math.random() > 0.8 ? (Math.random() * 2) : 0;
        });
    }
}
