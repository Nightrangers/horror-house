import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);
        this.isLocked = false;
        
        this.controls.addEventListener('lock', () => this.isLocked = true);
        this.controls.addEventListener('unlock', () => this.isLocked = false);
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveForward = false; this.moveBackward = false;
        this.moveLeft = false; this.moveRight = false;
        this.canRun = false;
        this.bobTimer = 0;

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        this.setPosition(0, 2, 5); // Start in front of table
    }

    getControls() { return this.controls; }
    lock() { this.controls.lock(); }
    getPosition() { return this.controls.getObject().position; }
    setPosition(x, y, z) { this.controls.getObject().position.set(x, y, z); }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyD': this.moveRight = true; break;
            case 'ShiftLeft': this.canRun = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyD': this.moveRight = false; break;
            case 'ShiftLeft': this.canRun = false; break;
        }
    }

    update(delta) {
        const speedMultiplier = this.canRun ? 15.0 : 5.0;
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * speedMultiplier * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * speedMultiplier * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
        
        // Head Bobbing
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
            this.bobTimer += delta * (this.canRun ? 15 : 8);
            this.camera.position.y = 2 + Math.sin(this.bobTimer) * (this.canRun ? 0.15 : 0.05);
        }
    }
}
