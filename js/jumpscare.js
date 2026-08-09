export class Jumpscare {
    constructor(audio) {
        this.audio = audio;
    }

    trigger() {
        const screen = document.getElementById('jumpscare-screen');
        screen.style.display = 'flex';
        this.audio.playJumpscare();
        
        // Camera shake effect via CSS on the UI layer
        screen.style.animation = 'shake 0.05s infinite';

        setTimeout(() => {
            screen.style.display = 'none';
            document.getElementById('ui-layer').style.background = 'black';
            document.getElementById('end-screen').style.display = 'flex';
            document.getElementById('crosshair').style.display = 'none';
            document.exitPointerLock();
        }, 1500); // Loud noise cuts out, fades to black
    }
}
