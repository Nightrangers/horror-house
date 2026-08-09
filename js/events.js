export class Events {
    constructor(scene, audio, hospital, wheelchair) {
        this.scene = scene;
        this.audio = audio;
        this.hospital = hospital;
        this.wheelchair = wheelchair;
        this.chaseTriggered = false;
        this.chaseActive = false;
    }

    checkEvents(playerPos, currentStage, time) {
        if (currentStage === 'hospital' && playerPos.z < -140 && !this.chaseTriggered) {
            this.chaseTriggered = true;
            this.triggerWheelchairEvent();
        }
    }

    triggerWheelchairEvent() {
        // The "I SEE YOU" sequence
        this.hospital.flickerLights.forEach(l => l.intensity = 0); // pitch black
        setTimeout(() => {
            document.getElementById('dialogue-text').style.opacity = 1;
            this.audio.playJumpscare(); // distort noise for voice
        }, 1000);

        setTimeout(() => {
            document.getElementById('dialogue-text').style.opacity = 0;
            this.chaseActive = true;
            document.getElementById('vignette').style.background = 'radial-gradient(circle, rgba(200,0,0,0.1) 10%, rgba(0,0,0,0.95) 100%)';
        }, 3000);
    }
}
