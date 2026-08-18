import * as THREE from 'three';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- 1. SETUP THREE.JS ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.04);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 18;
camera.position.x = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- 2. GENERATE SHAPES ---
const N = 4000;

function randomPointInSphere(radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    return new THREE.Vector3(
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi)
    );
}

function generateToolSearch() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.3) {
            // Magnifying glass ring
            const angle = Math.random() * Math.PI * 2;
            const r = 2.0 + (Math.random() - 0.5) * 0.3;
            x = Math.cos(angle) * r - 1.5;
            y = Math.sin(angle) * r + 1.5;
            z = (Math.random() - 0.5) * 0.3;
        } else if (i < N * 0.45) {
            // Magnifying glass handle
            const t = Math.random();
            const len = 3.5;
            const angle = Math.PI / 4;
            x = (t * len) * Math.cos(-angle) - 0.5;
            y = (t * len) * Math.sin(-angle) + 0.5;
            z = (Math.random() - 0.5) * 0.3;
        } else if (i < N * 0.8) {
            // Floating UI/Command blocks
            x = (Math.random() - 0.5) * 12;
            y = (Math.random() - 0.5) * 10;
            z = (Math.random() - 0.5) * 8 - 2;
            // Snap to grid for "blocky" look
            x = Math.round(x / 2.0) * 2.0 + (Math.random()-0.5)*0.8;
            y = Math.round(y / 1.5) * 1.5 + (Math.random()-0.5)*0.8;
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x;
        pos[i*3+1] = y;
        pos[i*3+2] = z;
    }
    return pos;
}

function generateVizBank() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        if (i < N * 0.8) {
            // Layered slides
            let layer = i % 6;
            let slideW = 5;
            let slideH = 3;
            let px = (Math.random() - 0.5) * slideW;
            let py = (Math.random() - 0.5) * slideH;
            let pz = -layer * 2.0 + 3;
            
            // Fanning out effect
            px += (layer - 2.5) * 1.5;
            py += (layer - 2.5) * -0.5;
            
            pos[i*3] = px;
            pos[i*3+1] = py;
            pos[i*3+2] = pz;
        } else {
            // Ambient
            pos[i*3] = (Math.random() - 0.5) * 25;
            pos[i*3+1] = (Math.random() - 0.5) * 20;
            pos[i*3+2] = (Math.random() - 0.5) * 15 - 5;
        }
    }
    return pos;
}

function generateThemePalettes() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        if (i < N * 0.7) {
            // Color wheel (multiple rings)
            const ring = i % 3;
            const angle = Math.random() * Math.PI * 2;
            const radius = 2.0 + ring * 1.5 + Math.random() * 0.5;
            
            // Create clusters
            const cluster = Math.floor(angle / (Math.PI / 3));
            const clusterAngle = cluster * (Math.PI / 3) + (Math.random() - 0.5) * 0.5;
            
            pos[i*3] = Math.cos(clusterAngle) * radius;
            pos[i*3+1] = Math.sin(clusterAngle) * radius;
            pos[i*3+2] = (Math.random() - 0.5) * 1.0;
        } else {
            // Ambient
            pos[i*3] = (Math.random() - 0.5) * 25;
            pos[i*3+1] = (Math.random() - 0.5) * 20;
            pos[i*3+2] = (Math.random() - 0.5) * 15 - 5;
        }
    }
    return pos;
}

function generateAutoColor() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        if (i < N * 0.3) {
            // Sphere
            const p = randomPointInSphere(2.5);
            pos[i*3] = p.x - 4;
            pos[i*3+1] = p.y + 1.5;
            pos[i*3+2] = p.z;
        } else if (i < N * 0.55) {
            // Cube
            pos[i*3] = (Math.random() - 0.5) * 3 + 3;
            pos[i*3+1] = (Math.random() - 0.5) * 3 - 2;
            pos[i*3+2] = (Math.random() - 0.5) * 3;
        } else if (i < N * 0.8) {
            // Torus knot-like / organic wave shape
            const t = Math.random() * Math.PI * 2;
            const u = Math.random() * Math.PI * 2;
            const r = 1.0 + Math.random() * 0.5;
            const r2 = 3.0;
            pos[i*3] = (r2 + r * Math.cos(u)) * Math.cos(t) + 1;
            pos[i*3+1] = (r2 + r * Math.cos(u)) * Math.sin(t) + 2;
            pos[i*3+2] = r * Math.sin(u) - 2;
        } else {
            // Ambient
            pos[i*3] = (Math.random() - 0.5) * 25;
            pos[i*3+1] = (Math.random() - 0.5) * 20;
            pos[i*3+2] = (Math.random() - 0.5) * 15 - 5;
        }
    }
    return pos;
}

const positions = [
    generateToolSearch(),
    generateVizBank(),
    generateThemePalettes(),
    generateAutoColor()
];

// --- 3. PARTICLES & LINES SETUP ---
const geometry = new THREE.BufferGeometry();
const currentPositions = new Float32Array(N * 3);
for(let i=0; i<N*3; i++) currentPositions[i] = positions[0][i];
geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

// Create soft dot texture
function createDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(226, 192, 141, 0.9)'); // Gold center
    gradient.addColorStop(0.6, 'rgba(226, 192, 141, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

const material = new THREE.PointsMaterial({
    size: 0.3,
    map: createDotTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff
});

const pointsMesh = new THREE.Points(geometry, material);
pointsMesh.position.x = 4; // Shift right to leave space for text
scene.add(pointsMesh);

// Connecting Lines (Plexus effect using fixed topology)
const lineIndices = [];
// Connect points structurally to form interesting meshes
for(let i=0; i<N; i++) {
    // Connect to a few nearby indices to create web
    if(i % 3 === 0 && i < N - 5) {
        lineIndices.push(i, i+1);
        lineIndices.push(i, i+3);
        lineIndices.push(i, i+5);
    }
}
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', geometry.getAttribute('position'));
lineGeometry.setIndex(lineIndices);

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xe2c08d,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
linesMesh.position.x = 4;
scene.add(linesMesh);

// --- 4. ANIMATION & INTERACTION ---
let morphObj = { progress: 0 };

function updateMorph() {
    let p = morphObj.progress;
    let idx1 = Math.floor(p);
    let idx2 = Math.min(idx1 + 1, positions.length - 1);
    let t = p - idx1;
    
    // Smooth step easing
    let easeT = t * t * (3 - 2 * t);
    
    let pos1 = positions[idx1];
    let pos2 = positions[idx2];
    
    let current = geometry.attributes.position.array;
    for(let i=0; i<N*3; i++) {
        current[i] = pos1[i] + (pos2[i] - pos1[i]) * easeT;
    }
    geometry.attributes.position.needsUpdate = true;
    
    // Optional: change color based on section
    if (idx1 === 2 || idx2 === 2) {
        // Theme palettes - we can inject some color logic here if we wanted
    }
}

// Scroll Morphing
ScrollTrigger.create({
    trigger: "main",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5,
    onUpdate: (self) => {
        morphObj.progress = self.progress * (positions.length - 1);
        updateMorph();
    }
});

// Text reveal animations
const sections = document.querySelectorAll('.tool-section');
sections.forEach((sec) => {
    gsap.from(sec.querySelector('.content'), {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// Mouse Parallax & Rotation
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    // Mouse parallax effect (rotation and position)
    pointsMesh.rotation.y += (targetX * 0.3 - pointsMesh.rotation.y) * 0.05;
    pointsMesh.rotation.x += (targetY * 0.3 - pointsMesh.rotation.x) * 0.05;
    
    linesMesh.rotation.y = pointsMesh.rotation.y;
    linesMesh.rotation.x = pointsMesh.rotation.x;
    
    // Move slightly based on mouse (base X is 4)
    pointsMesh.position.y += (targetY * 1.5 - pointsMesh.position.y) * 0.05;
    pointsMesh.position.x += (4 + targetX * 1.5 - pointsMesh.position.x) * 0.05;
    
    linesMesh.position.y = pointsMesh.position.y;
    linesMesh.position.x = pointsMesh.position.x;
    
    // Slight breathing effect
    const scale = 1.0 + Math.sin(time * 0.5) * 0.02;
    pointsMesh.scale.set(scale, scale, scale);
    linesMesh.scale.set(scale, scale, scale);
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
