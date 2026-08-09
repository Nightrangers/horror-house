export class AudioSys {
    constructor() { this.ctx = null; }
    
    initContext() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }

    _createNoise(duration, type='white', filterFreq=400) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = filterFreq;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.connect(filter).connect(gain).connect(this.ctx.destination);
        noise.start();
    }

    playWind() {
        if (!this.ctx) return;
        setInterval(() => this._createNoise(4, 'pink', 200), 4000);
    }

    playRustle() { this._createNoise(1, 'white', 1500); }
    playThunder() { this._createNoise(5, 'white', 100); }
    playHospitalHum() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth'; osc.frequency.value = 60;
        const gain = this.ctx.createGain(); gain.gain.value = 0.05;
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
    }

    playCreak() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 2);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 2);
    }

    playJumpscare() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'square'; osc.frequency.value = 150;
        const dist = this.ctx.createWaveShaper();
        dist.curve = new Float32Array([ -1, 1, -1, 1 ]);
        const gain = this.ctx.createGain(); gain.gain.value = 3.0;
        osc.connect(dist).connect(gain).connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 1.5);
    }
}
