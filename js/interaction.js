import * as THREE from 'three';

export class Interaction {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.center = new THREE.Vector2(0, 0);
        this.uiText = document.getElementById('interaction-text');
        this.onInteract = null;
        this.hoveredObject = null;

        document.addEventListener('mousedown', () => {
            if (this.hoveredObject && this.onInteract) {
                this.onInteract(this.hoveredObject.userData.name);
            }
        });
    }

    update() {
        this.raycaster.setFromCamera(this.center, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        this.hoveredObject = null;
        this.uiText.innerText = '';

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance > 3) break;
            if (intersects[i].object.userData.interactable) {
                this.hoveredObject = intersects[i].object;
                this.uiText.innerText = `[Click] to interact with ${this.hoveredObject.userData.name}`;
                break;
            }
        }
    }
}
