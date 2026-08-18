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
        let x, y, z;
        if (i < N * 0.2) {
            // Gallery Frame (4 borders)
            const t = Math.random();
            const edge = i % 4;
            if (edge === 0) { x = t*8 - 4; y = 3; } // Top
            else if (edge === 1) { x = t*8 - 4; y = -3; } // Bottom
            else if (edge === 2) { x = -4; y = t*6 - 3; } // Left
            else { x = 4; y = t*6 - 3; } // Right
            // Add thickness
            x += (Math.random()-0.5)*0.5;
            y += (Math.random()-0.5)*0.5;
            z = (Math.random()-0.5)*0.5;
        } else if (i < N * 0.35) {
            // Sun (Solid circle)
            const r = Math.sqrt(Math.random()) * 1.2;
            const theta = Math.random() * Math.PI * 2;
            x = 1.5 + r * Math.cos(theta);
            y = 1.5 + r * Math.sin(theta);
            z = (Math.random()-0.5)*0.4;
        } else if (i < N * 0.55) {
            // Mountain 1 (Filled triangle)
            let r1 = Math.random(), r2 = Math.random();
            if (r1 + r2 > 1) { r1 = 1-r1; r2 = 1-r2; }
            const ax = -4, ay = -3;
            const bx = 0.5, by = -3;
            const cx = -1.5, cy = 1.0;
            x = ax + r1*(bx-ax) + r2*(cx-ax);
            y = ay + r1*(by-ay) + r2*(cy-ay);
            z = (Math.random()-0.5)*0.5;
        } else if (i < N * 0.75) {
            // Mountain 2 (Filled triangle)
            let r1 = Math.random(), r2 = Math.random();
            if (r1 + r2 > 1) { r1 = 1-r1; r2 = 1-r2; }
            const ax = -1.5, ay = -3;
            const bx = 4, by = -3;
            const cx = 1.5, cy = -0.5;
            x = ax + r1*(bx-ax) + r2*(cx-ax);
            y = ay + r1*(by-ay) + r2*(cy-ay);
            z = (Math.random()-0.5)*0.5 + 0.3; // Bring slightly forward
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
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
    
    // Star outline helper
    const getStarPoint = (cx, cy, R, r, t, segment) => {
        const a1 = segment * Math.PI / 5 - Math.PI / 2;
        const a2 = (segment + 1) * Math.PI / 5 - Math.PI / 2;
        const r1 = (segment % 2 === 0) ? R : r;
        const r2 = ((segment + 1) % 2 === 0) ? R : r;
        const x1 = cx + Math.cos(a1) * r1;
        const y1 = cy + Math.sin(a1) * r1;
        const x2 = cx + Math.cos(a2) * r2;
        const y2 = cy + Math.sin(a2) * r2;
        return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    };

    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.3) {
            // Wand stick (Diagonal cylinder)
            const t = Math.random();
            const lx = -3.5 + t * 4.5;
            const ly = -3.5 + t * 4.5;
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random() * 0.3;
            // Orthogonal basis for cylinder around x=y
            const perpX = -0.707 * rad * Math.cos(angle);
            const perpY = 0.707 * rad * Math.cos(angle);
            const perpZ = rad * Math.sin(angle);
            x = lx + perpX;
            y = ly + perpY;
            z = perpZ;
        } else if (i < N * 0.55) {
            // Main Star at tip
            const segment = i % 10;
            const t = Math.random();
            const pt = getStarPoint(1.5, 1.5, 2.5, 1.0, t, segment);
            x = pt.x + (Math.random()-0.5)*0.3;
            y = pt.y + (Math.random()-0.5)*0.3;
            z = (Math.random()-0.5)*0.4;
        } else if (i < N * 0.65) {
            // Sparkle 1
            const segment = i % 10;
            const pt = getStarPoint(-1, 2.5, 0.8, 0.3, Math.random(), segment);
            x = pt.x + (Math.random()-0.5)*0.15;
            y = pt.y + (Math.random()-0.5)*0.15;
            z = (Math.random()-0.5)*0.4;
        } else if (i < N * 0.75) {
            // Sparkle 2
            const segment = i % 10;
            const pt = getStarPoint(3.5, -0.5, 0.7, 0.25, Math.random(), segment);
            x = pt.x + (Math.random()-0.5)*0.15;
            y = pt.y + (Math.random()-0.5)*0.15;
            z = (Math.random()-0.5)*0.4;
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    }
    return pos;
}

function generateThemeExtractor() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.2) {
            // Eyedropper bulb
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI;
            const r = 1.0;
            x = -1.8 + Math.sin(v) * Math.cos(u) * r;
            y = 1.8 + Math.sin(v) * Math.sin(u) * r;
            z = Math.cos(v) * r;
        } else if (i < N * 0.45) {
            // Eyedropper tube (diagonal cylinder)
            const t = Math.random();
            const lx = -1.2 + t * 2.4; // from -1.2 to 1.2
            const ly = 1.2 - t * 2.4;  // from 1.2 to -1.2
            const angle = Math.random() * Math.PI * 2;
            const rad = 0.5;
            const perpX = 0.707 * rad * Math.cos(angle);
            const perpY = 0.707 * rad * Math.cos(angle);
            const perpZ = rad * Math.sin(angle);
            x = lx + perpX;
            y = ly + perpY;
            z = perpZ;
        } else if (i < N * 0.6) {
            // Eyedropper tip (cone shape)
            const t = Math.random();
            const lx = 1.2 + t * 0.6; // down to 1.8
            const ly = -1.2 - t * 0.6; // down to -1.8
            const angle = Math.random() * Math.PI * 2;
            const rad = 0.5 * (1 - t); // tapers off
            const perpX = 0.707 * rad * Math.cos(angle);
            const perpY = 0.707 * rad * Math.cos(angle);
            const perpZ = rad * Math.sin(angle);
            x = lx + perpX;
            y = ly + perpY;
            z = perpZ;
        } else if (i < N * 0.7) {
            // Drop of liquid falling
            const r = Math.cbrt(Math.random()) * 0.4;
            const u = Math.random() * Math.PI * 2;
            const v = Math.acos(2.0 * Math.random() - 1.0);
            x = 2.4 + r * Math.sin(v) * Math.cos(u);
            y = -2.4 + r * Math.sin(v) * Math.sin(u);
            z = r * Math.cos(v);
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    }
    return pos;
}

function generateSlideDoctor() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.1) {
            // Left Earpiece
            const r = Math.cbrt(Math.random()) * 0.4;
            const u = Math.random() * Math.PI * 2;
            const v = Math.acos(2.0 * Math.random() - 1.0);
            x = -1.5 + r * Math.sin(v) * Math.cos(u);
            y = 2.5 + r * Math.sin(v) * Math.sin(u);
            z = r * Math.cos(v);
        } else if (i < N * 0.2) {
            // Right Earpiece
            const r = Math.cbrt(Math.random()) * 0.4;
            const u = Math.random() * Math.PI * 2;
            const v = Math.acos(2.0 * Math.random() - 1.0);
            x = 1.5 + r * Math.sin(v) * Math.cos(u);
            y = 2.5 + r * Math.sin(v) * Math.sin(u);
            z = r * Math.cos(v);
        } else if (i < N * 0.35) {
            // Left Y-tube
            const t = Math.random();
            x = -1.5 + t * 1.5;
            y = 2.5 - t * 2.0;
            x += (Math.random()-0.5)*0.2; y += (Math.random()-0.5)*0.2; z = (Math.random()-0.5)*0.2;
        } else if (i < N * 0.5) {
            // Right Y-tube
            const t = Math.random();
            x = 1.5 - t * 1.5;
            y = 2.5 - t * 2.0;
            x += (Math.random()-0.5)*0.2; y += (Math.random()-0.5)*0.2; z = (Math.random()-0.5)*0.2;
        } else if (i < N * 0.65) {
            // Main vertical tube
            const t = Math.random();
            x = 0;
            y = 0.5 - t * 2.5; // down to -2
            x += (Math.random()-0.5)*0.2; y += (Math.random()-0.5)*0.2; z = (Math.random()-0.5)*0.2;
        } else if (i < N * 0.8) {
            // Chest piece (Disc)
            const r = Math.sqrt(Math.random()) * 1.2;
            const theta = Math.random() * Math.PI * 2;
            x = r * Math.cos(theta);
            y = -2.5; // sitting at the bottom
            z = r * Math.sin(theta);
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    }
    return pos;
}

function generateAgendaMaker() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.3) {
            // Clipboard / Paper outline
            const t = Math.random();
            const edge = i % 4;
            if (edge === 0) { x = t*5 - 2.5; y = 3.5; } // Top
            else if (edge === 1) { x = t*5 - 2.5; y = -3.5; } // Bottom
            else if (edge === 2) { x = -2.5; y = t*7 - 3.5; } // Left
            else { x = 2.5; y = t*7 - 3.5; } // Right
            x += (Math.random()-0.5)*0.3; y += (Math.random()-0.5)*0.3; z = (Math.random()-0.5)*0.3;
        } else if (i < N * 0.75) {
            // 3 Rows of Checkboxes and Lines
            const row = i % 3;
            const rowY = 1.5 - row * 1.5;
            const type = Math.random();
            if (type < 0.2) {
                // Checkbox square outline
                const t = Math.random();
                const edge = Math.floor(Math.random()*4);
                let bx = -1.5, by = rowY;
                if (edge === 0) { x = bx + t*0.8 - 0.4; y = by + 0.4; }
                else if (edge === 1) { x = bx + t*0.8 - 0.4; y = by - 0.4; }
                else if (edge === 2) { x = bx - 0.4; y = by + t*0.8 - 0.4; }
                else { x = bx + 0.4; y = by + t*0.8 - 0.4; }
                x += (Math.random()-0.5)*0.1; y += (Math.random()-0.5)*0.1; z = (Math.random()-0.5)*0.1;
            } else if (type < 0.4 && row !== 1) {
                // Checkmark (V shape) for rows 0 and 2
                const t = Math.random();
                if (t < 0.4) {
                    x = -1.7 + t * 0.5; // -1.7 to -1.5
                    y = rowY + t * 0.5 - 0.2; // roughly down
                } else {
                    const t2 = (t - 0.4) / 0.6;
                    x = -1.5 + t2 * 0.6; // -1.5 to -0.9
                    y = rowY - 0.2 + t2 * 0.8; // sharply up
                }
                x += (Math.random()-0.5)*0.1; y += (Math.random()-0.5)*0.1; z = (Math.random()-0.5)*0.1 + 0.2;
            } else {
                // Text line
                const t = Math.random();
                x = -0.5 + t * 2.5;
                y = rowY;
                x += (Math.random()-0.5)*0.2; y += (Math.random()-0.5)*0.2; z = (Math.random()-0.5)*0.1;
            }
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    }
    return pos;
}

function generatePresetStudio() {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (i < N * 0.2) {
            // Outer Frame
            const t = Math.random();
            const edge = i % 4;
            if (edge === 0) { x = t*6 - 3; y = 3; } // Top
            else if (edge === 1) { x = t*6 - 3; y = -3; } // Bottom
            else if (edge === 2) { x = -3; y = t*6 - 3; } // Left
            else { x = 3; y = t*6 - 3; } // Right
            x += (Math.random()-0.5)*0.3; y += (Math.random()-0.5)*0.3; z = (Math.random()-0.5)*0.3;
        } else if (i < N * 0.5) {
            // 3 Vertical Tracks
            const track = i % 3;
            const tx = -1.5 + track * 1.5; // -1.5, 0, 1.5
            const t = Math.random();
            x = tx;
            y = -2.0 + t * 4.0;
            x += (Math.random()-0.5)*0.2; y += (Math.random()-0.5)*0.2; z = (Math.random()-0.5)*0.1;
        } else if (i < N * 0.8) {
            // 3 Knobs (Spheres/Cubes on the tracks)
            const track = i % 3;
            const tx = -1.5 + track * 1.5;
            let ty = 0;
            if (track === 0) ty = 1.0;
            if (track === 1) ty = -0.5;
            if (track === 2) ty = 1.5;
            
            // Generate a knob block
            x = tx + (Math.random()-0.5)*1.0;
            y = ty + (Math.random()-0.5)*0.6;
            z = (Math.random()-0.5)*0.6 + 0.2;
        } else {
            // Ambient
            x = (Math.random() - 0.5) * 25;
            y = (Math.random() - 0.5) * 20;
            z = (Math.random() - 0.5) * 15 - 5;
        }
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    }
    return pos;
}

const positions = [
    generateToolSearch(),
    generateVizBank(),
    generateThemePalettes(),
    generateAutoColor(),
    generateThemeExtractor(),
    generateSlideDoctor(),
    generateAgendaMaker(),
    generatePresetStudio()
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
