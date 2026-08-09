import * as THREE from 'three';

export class Castle {
    constructor(scene) {
        this.scene = scene;
        this.doorGroup = new THREE.Group();
        this.mapMesh = null;
        this.doorOpen = false;
        this.mapFlipped = false;
        this.candleLight = new THREE.PointLight(0xffa500, 2, 10);
    }

    _generateTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color1; ctx.fillRect(0,0,256,256);
        for(let i=0; i<1000; i++) {
            ctx.fillStyle = color2;
            ctx.fillRect(Math.random()*256, Math.random()*256, 2, 2);
        }
        return new THREE.CanvasTexture(canvas);
    }

    buildMapRoom() {
        // Table
        const tableGeo = new THREE.BoxGeometry(4, 1, 3);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, map: this._generateTexture('#3d2314', '#2b180d') });
        const table = new THREE.Mesh(tableGeo, tableMat);
        table.position.set(0, 1, 0);
        this.scene.add(table);

        // Map
        const mapGeo = new THREE.PlaneGeometry(2, 1.5);
        const mapMatFront = new THREE.MeshStandardMaterial({ color: 0xddddbb });
        const mapMatBack = new THREE.MeshStandardMaterial({ color: 0xddddbb, map: this._generateTexture('#ddddbb', '#000000') });
        this.mapMesh = new THREE.Mesh(mapGeo, [mapMatFront, mapMatBack]); // simplified
        this.mapMesh.rotation.x = -Math.PI / 2;
        this.mapMesh.position.set(0, 1.51, 0);
        this.mapMesh.userData = { interactable: true, name: 'map' };
        this.scene.add(this.mapMesh);

        // Candle
        this.candleLight.position.set(1, 1.7, -1);
        this.scene.add(this.candleLight);
    }

    buildCastleExterior() {
        // Castle Wall
        const wallGeo = new THREE.BoxGeometry(40, 20, 2);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222, map: this._generateTexture('#222222', '#111111') });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(0, 10, -25);
        this.scene.add(wall);

        // Giant Door
        const doorGeo = new THREE.BoxGeometry(4, 8, 0.5);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x1a0f08 });
        const doorMesh = new THREE.Mesh(doorGeo, doorMat);
        doorMesh.position.set(2, 4, 0); // Offset for hinge
        doorMesh.userData = { interactable: true, name: 'door' };
        
        this.doorGroup.add(doorMesh);
        this.doorGroup.position.set(-2, 0, -24.5);
        this.scene.add(this.doorGroup);

        // Moonlight
        const moonLight = new THREE.DirectionalLight(0x444466, 1.5);
        moonLight.position.set(10, 20, -10);
        moonLight.castShadow = true;
        this.scene.add(moonLight);
    }

    flipMap() { this.mapFlipped = true; }
    openDoor() { this.doorOpen = true; }

    update(time) {
        this.candleLight.intensity = 2 + Math.random() * 0.5;
        if (this.mapFlipped && this.mapMesh.rotation.x < Math.PI / 2) {
            this.mapMesh.position.y += 0.01;
            this.mapMesh.rotation.x += 0.05;
        }
        if (this.doorOpen && this.doorGroup.rotation.y < Math.PI / 2) {
            this.doorGroup.rotation.y += 0.005;
        }
    }
}
