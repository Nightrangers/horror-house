import * as THREE from 'three';
import { Player } from './js/player.js';
import { AudioSys } from './js/audio.js';
import { Castle } from './js/castle.js';
import { Hospital } from './js/hospital.js';
import { Wheelchair } from './js/wheelchair.js';
import { Interaction } from './js/interaction.js';
import { Events } from './js/events.js';
import { Jumpscare } from './js/jumpscare.js';

let scene, camera, renderer, player, interaction, audio, clock;
let currentStage = 'map'; // map, castle, hospital, chase

function init() {
    // Basic Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    scene.fog = new THREE.FogExp2(0x020205, 0.08);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    
    renderer = new THREE.WebGLRenderer({ antialias: false }); // False for gritty look
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    audio = new AudioSys();
    player = new Player(camera, document.body);
    scene.add(player.getControls().getObject());

    // Initialize Subsystems
    const castleSys = new Castle(scene);
    const hospitalSys = new Hospital(scene);
    const wheelchairSys = new Wheelchair(scene);
    
    interaction = new Interaction(camera, scene);
    const eventManager = new Events(scene, audio, hospitalSys, wheelchairSys);
    const jumpscareSys = new Jumpscare(audio);

    // Build Worlds
    castleSys.buildMapRoom();
    castleSys.buildCastleExterior();
    hospitalSys.buildHospital();
    wheelchairSys.build();

    // Event Listeners for Game Progression
    interaction.onInteract = (objectName) => {
        if (objectName === 'map' && currentStage === 'map') {
            castleSys.flipMap();
            audio.playRustle();
            setTimeout(() => {
                player.setPosition(0, 2, -15); // Move to castle exterior
                currentStage = 'castle';
                scene.fog.density = 0.05;
                audio.playThunder();
            }, 3000);
        }
        if (objectName === 'door' && currentStage === 'castle') {
            castleSys.openDoor();
            audio.playCreak();
            setTimeout(() => {
                player.setPosition(0, 2, -50); // Move to hospital
                currentStage = 'hospital';
                scene.fog.density = 0.09;
                audio.playHospitalHum();
            }, 4000);
        }
        if (objectName === 'finalDoor' && currentStage === 'chase') {
            jumpscareSys.trigger();
        }
    };

    // Title Screen Logic
    document.getElementById('title-screen').addEventListener('click', () => {
        document.getElementById('title-screen').style.opacity = 0;
        setTimeout(() => document.getElementById('title-screen').style.display = 'none', 2000);
        document.getElementById('crosshair').style.display = 'block';
        player.lock();
        audio.initContext();
        audio.playWind();
    });

    // Main Loop
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        if (player.isLocked) {
            player.update(delta);
            interaction.update();
            eventManager.checkEvents(player.getPosition(), currentStage, time);
            castleSys.update(time);
            hospitalSys.update(time);
            
            if (eventManager.chaseActive) {
                currentStage = 'chase';
                wheelchairSys.chase(player.getPosition(), delta);
            }
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

init();
