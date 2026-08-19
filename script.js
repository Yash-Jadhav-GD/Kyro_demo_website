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

// --- SHAPE HELPERS ---
function setPoint(pos, idx, x, y, z) {
    pos[idx*3] = x + (Math.random()-0.5)*0.15;
    pos[idx*3+1] = y + (Math.random()-0.5)*0.15;
    pos[idx*3+2] = z + (Math.random()-0.5)*0.15;
}
function drawRectOutline(pos, startIdx, count, cx, cy, w, h, z=0) {
    for(let i=0; i<count; i++) {
        const t = Math.random();
        const edge = Math.floor(Math.random()*4);
        let x, y;
        if(edge===0) { x = cx-w/2+t*w; y = cy+h/2; }
        else if(edge===1) { x = cx-w/2+t*w; y = cy-h/2; }
        else if(edge===2) { x = cx-w/2; y = cy-h/2+t*h; }
        else { x = cx+w/2; y = cy-h/2+t*h; }
        setPoint(pos, startIdx+i, x, y, z);
    }
}
function drawCircleOutline(pos, startIdx, count, cx, cy, r, z=0) {
    for(let i=0; i<count; i++) {
        const angle = Math.random()*Math.PI*2;
        setPoint(pos, startIdx+i, cx+Math.cos(angle)*r, cy+Math.sin(angle)*r, z);
    }
}
function drawLine(pos, startIdx, count, x1, y1, x2, y2, z=0) {
    for(let i=0; i<count; i++) {
        const t = Math.random();
        setPoint(pos, startIdx+i, x1+t*(x2-x1), y1+t*(y2-y1), z);
    }
}
function drawSolidRect(pos, startIdx, count, cx, cy, w, h, z=0) {
    for(let i=0; i<count; i++) {
        setPoint(pos, startIdx+i, cx-w/2+Math.random()*w, cy-h/2+Math.random()*h, z);
    }
}
function drawSolidCircle(pos, startIdx, count, cx, cy, r, z=0) {
    for(let i=0; i<count; i++) {
        const angle = Math.random()*Math.PI*2;
        const rad = Math.sqrt(Math.random())*r;
        setPoint(pos, startIdx+i, cx+Math.cos(angle)*rad, cy+Math.sin(angle)*rad, z);
    }
}
function drawCross(pos, startIdx, count, cx, cy, size, z=0) {
    const half = count/2;
    drawLine(pos, startIdx, half, cx-size/2, cy, cx+size/2, cy, z);
    drawLine(pos, startIdx+half, count-half, cx, cy-size/2, cx, cy+size/2, z);
}
function drawCheckmark(pos, startIdx, count, cx, cy, size, z=0) {
    const half = Math.floor(count*0.4);
    drawLine(pos, startIdx, half, cx-size/2, cy, cx-size/6, cy-size/2, z);
    drawLine(pos, startIdx+half, count-half, cx-size/6, cy-size/2, cx+size/2, cy+size/2, z);
}
function drawArrow(pos, startIdx, count, x1, y1, x2, y2, z=0) {
    const stemCount = Math.floor(count*0.7);
    const headCount = count - stemCount;
    drawLine(pos, startIdx, stemCount, x1, y1, x2, y2, z);
    // Arrow head
    const angle = Math.atan2(y2-y1, x2-x1);
    const headLen = 0.5;
    const h1x = x2 - headLen * Math.cos(angle - Math.PI/6);
    const h1y = y2 - headLen * Math.sin(angle - Math.PI/6);
    const h2x = x2 - headLen * Math.cos(angle + Math.PI/6);
    const h2y = y2 - headLen * Math.sin(angle + Math.PI/6);
    drawLine(pos, startIdx+stemCount, Math.floor(headCount/2), x2, y2, h1x, h1y, z);
    drawLine(pos, startIdx+stemCount+Math.floor(headCount/2), headCount-Math.floor(headCount/2), x2, y2, h2x, h2y, z);
}
function drawAmbient(pos, startIdx, count) {
    for(let i=0; i<count; i++) {
        pos[(startIdx+i)*3] = (Math.random()-0.5)*25;
        pos[(startIdx+i)*3+1] = (Math.random()-0.5)*20;
        pos[(startIdx+i)*3+2] = (Math.random()-0.5)*15 - 5;
    }
}


function generateToolSearch() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1800, -1, 0.5, 3, 2); // Command Window
    drawCircleOutline(pos, 1800, 1000, 1.5, -1, 0.8); // Magnifier glass
    drawLine(pos, 2800, 800, 1.5+0.56, -1-0.56, 1.5+1.5, -1-1.5); // Handle
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateVizBank() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1200, -1, 0.5, 4, 2.5, 2);
    drawRectOutline(pos, 1200, 1200, 0, 0, 4, 2.5, 0);
    drawRectOutline(pos, 2400, 1200, 1, -0.5, 4, 2.5, -2);
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateThemePalettes() {
    const pos = new Float32Array(N * 3);

    drawSolidRect(pos, 0, 900, -2, 1, 1.5, 1.5, 0.5);
    drawSolidRect(pos, 900, 900, -0.5, 0.5, 1.5, 1.5, 0);
    drawSolidRect(pos, 1800, 900, 1, 0, 1.5, 1.5, -0.5);
    drawSolidRect(pos, 2700, 900, 2.5, -0.5, 1.5, 1.5, -1);
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateAutoColor() {
    const pos = new Float32Array(N * 3);

    drawLine(pos, 0, 1000, -2, -2, 1, 1); // Wand stick
    drawCircleOutline(pos, 1000, 1000, 1.5, 1.5, 0.8); // Star proxy
    drawSolidCircle(pos, 2000, 1600, 2.5, -1, 0.6); // Droplet
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateThemeExtractor() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1600, -1.5, -1, 3, 2); // Slide
    drawLine(pos, 1600, 1000, 1.5, 2, 0.5, 1); // Eyedropper tube
    drawCircleOutline(pos, 2600, 1000, 1.8, 2.3, 0.5); // Bulb
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateSlideDoctor() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 2000, -1.5, 0, 3, 2.5); // Slide
    drawCross(pos, 2000, 1600, 2, 0, 1.5); // Medical Cross
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateAgendaMaker() {
    const pos = new Float32Array(N * 3);

    drawLine(pos, 0, 600, -2, 1, 0, 1);
    drawLine(pos, 600, 600, -2, 0, 0, 0);
    drawLine(pos, 1200, 600, -2, -1, 0, -1);
    drawCircleOutline(pos, 1800, 1000, 2, 0, 1); // Sync circle
    drawArrow(pos, 2800, 800, 1.5, 1, 2.5, 0.5); // Sync arrow
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generatePresetStudio() {
    const pos = new Float32Array(N * 3);

    drawLine(pos, 0, 500, -2, -1.5, -2, 1.5); // Track 1
    drawLine(pos, 500, 500, -1, -1.5, -1, 1.5); // Track 2
    drawSolidCircle(pos, 1000, 500, -2, 0.5, 0.3); // Knob 1
    drawSolidCircle(pos, 1500, 500, -1, -0.5, 0.3); // Knob 2
    drawRectOutline(pos, 2000, 1600, 1.5, 0, 1.5, 2); // Bookmark
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateICE() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1000, -1.5, 1, 2, 2); // Big left
    drawRectOutline(pos, 1000, 800, 1, 1.5, 1.5, 1); // Top right
    drawRectOutline(pos, 1800, 800, 1, 0, 1.5, 1); // Mid right
    drawRectOutline(pos, 2600, 1000, 0, -1.5, 5, 1.5); // Bottom wide
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateIconsLogos() {
    const pos = new Float32Array(N * 3);

    drawCircleOutline(pos, 0, 1200, -2, 1, 1); // Circle
    drawRectOutline(pos, 1200, 1200, 2, 1, 1.8, 1.8); // Square
    drawLine(pos, 2400, 400, 0, -0.5, -1, -2.5); // Triangle L
    drawLine(pos, 2800, 400, -1, -2.5, 1, -2.5); // Triangle B
    drawLine(pos, 3200, 400, 1, -2.5, 0, -0.5);  // Triangle R
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateProfileCards() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1200, 0, 0, 3, 4); // Card
    drawCircleOutline(pos, 1200, 800, 0, 1, 0.8); // Photo
    drawLine(pos, 2000, 500, -1, -0.5, 1, -0.5); // Line 1
    drawLine(pos, 2500, 500, -1, -1.2, 1, -1.2); // Line 2
    drawLine(pos, 3000, 600, -1, -1.9, 0.5, -1.9); // Line 3
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateArcMenu() {
    const pos = new Float32Array(N * 3);

    drawSolidCircle(pos, 0, 1000, 0, 0, 0.6); // Center
    drawCircleOutline(pos, 1000, 650, 0, 0, 1.8); // Arc 1 (simulated by circle)
    drawCircleOutline(pos, 1650, 650, 0, 0, 2.4); // Arc 2
    drawCross(pos, 2300, 1300, 0, 0, 5); // Segment dividers
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateFloatingColourPalette() {
    const pos = new Float32Array(N * 3);

    drawSolidRect(pos, 0, 1200, -2.5, 1.5, 1.5, 1.5);
    drawSolidRect(pos, 1200, 1200, 0, 0, 1.5, 1.5);
    drawSolidRect(pos, 2400, 1200, 2.5, -1.5, 1.5, 1.5);
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateAligners() {
    const pos = new Float32Array(N * 3);

    drawSolidRect(pos, 0, 800, -1.5, 2, 1, 1);
    drawSolidRect(pos, 800, 800, -1.5, 0, 1, 1);
    drawSolidRect(pos, 1600, 800, -1.5, -2, 1, 1);
    drawLine(pos, 2400, 1200, -2.5, 0, 2.5, 0); // Horizontal guide
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateCopyPasteDimensions() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 800, -2, 0, 1.5, 1.5); // Small
    drawRectOutline(pos, 800, 1400, 1.5, 0, 2.5, 2.5); // Large
    drawArrow(pos, 2200, 700, -1, 1.5, 0.5, 1.5); // Arrow top
    drawArrow(pos, 2900, 700, 0.5, 1.5, -1, 1.5); // Arrow double
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateMatchAll() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 800, -2, 1.5, 1.5, 1.5);
    drawRectOutline(pos, 800, 800, -2, -0.5, 1.5, 1.5);
    drawRectOutline(pos, 1600, 800, 0, 0.5, 1.5, 1.5);
    drawCheckmark(pos, 2400, 1200, 2, 0.5, 2);
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateFindSame() {
    const pos = new Float32Array(N * 3);

    drawCircleOutline(pos, 0, 600, -2, 1, 0.8);
    drawCircleOutline(pos, 600, 600, 0, 1, 0.8);
    drawCircleOutline(pos, 1200, 600, -1, -1, 0.8);
    drawRectOutline(pos, 1800, 600, 1.5, -1, 1.5, 1.5); // The odd one out
    drawCircleOutline(pos, 2400, 800, 0, 0, 2.5); // Magnifier around circles
    drawLine(pos, 3200, 400, 1.7, -1.7, 3, -3); // Handle
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateTextFuse() {
    const pos = new Float32Array(N * 3);

    drawLine(pos, 0, 600, -1.5, 1, 1.5, 1);
    drawLine(pos, 600, 600, -1.5, 0, 1.5, 0);
    drawLine(pos, 1200, 600, -1.5, -1, 1.5, -1);
    drawArrow(pos, 1800, 900, -3, 0, -2, 0); // Merge Right
    drawArrow(pos, 2700, 900, 3, 0, 2, 0); // Merge Left
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateTextractor() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1000, 0, 1.5, 3, 1.5); // Main block
    drawArrow(pos, 1000, 700, 0, 0.5, -1.5, -0.5); // Sep L
    drawArrow(pos, 1700, 700, 0, 0.5, 1.5, -0.5); // Sep R
    drawRectOutline(pos, 2400, 600, -1.5, -1.5, 1.5, 1);
    drawRectOutline(pos, 3000, 600, 1.5, -1.5, 1.5, 1);
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateTableTools() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1600, -1, 0.5, 3, 3); // Grid outer
    drawLine(pos, 1600, 400, -2.5, 0.5, 0.5, 0.5); // Grid H
    drawLine(pos, 2000, 400, -1, -1, -1, 2); // Grid V
    drawLine(pos, 2400, 1200, 1, -1.5, 3, 0.5); // Wrench handle
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateTinyAssets() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1000, -1, -1, 3, 2); // Toolbox
    drawCircleOutline(pos, 1000, 800, -1, 1.5, 0.8); // Handle arc
    drawSolidCircle(pos, 1800, 600, 1.5, 1.5, 0.5); // Asset 1
    drawSolidRect(pos, 2400, 600, 2.5, 0.5, 1, 1); // Asset 2
    drawCheckmark(pos, 3000, 600, 2, -1, 1); // Asset 3
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateOCR() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1600, 0, 0, 4, 3); // Frame
    drawCross(pos, 1600, 500, -2, 1.5, 0.5); // Sparkle
    drawCross(pos, 2100, 500, 2, -1.5, 0.5); // Sparkle
    drawCross(pos, 2600, 500, 2, 1.5, 0.5); // Sparkle
    drawCross(pos, 3100, 500, -2, -1.5, 0.5); // Sparkle
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateHtmlToPpt() {
    const pos = new Float32Array(N * 3);

    drawLine(pos, 0, 400, -2.5, 1.5, -3.5, 0); // < top
    drawLine(pos, 400, 400, -3.5, 0, -2.5, -1.5); // < bot
    drawLine(pos, 800, 400, -1.5, 1.5, -0.5, 0); // > top
    drawLine(pos, 1200, 400, -0.5, 0, -1.5, -1.5); // > bot
    drawArrow(pos, 1600, 800, 0, 0, 1.5, 0); // Arrow
    drawRectOutline(pos, 2400, 1200, 3, 0, 2, 1.5); // Slide
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateHtmlSlideshow() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 1600, 0, 0, 5, 3); // Screen
    drawLine(pos, 1600, 400, -0.5, 0.5, -1, 0); // < top
    drawLine(pos, 2000, 400, -1, 0, -0.5, -0.5); // < bot
    drawLine(pos, 2400, 400, 0.5, 0.5, 1, 0); // > top
    drawLine(pos, 2800, 400, 1, 0, 0.5, -0.5); // > bot
    drawSolidCircle(pos, 3200, 400, -2, 1.2, 0.15); // dot
        drawAmbient(pos, 3600, 400);
    return pos;
}

function generateMediaExporter() {
    const pos = new Float32Array(N * 3);

    drawRectOutline(pos, 0, 2000, -1, -0.5, 3, 2); // Slide
    drawArrow(pos, 2000, 1600, -1, -0.5, 2, 2.5); // Export Arrow UP-RIGHT
        drawAmbient(pos, 3600, 400);
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
    generatePresetStudio(),
    generateICE(),
    generateIconsLogos(),
    generateProfileCards(),
    generateArcMenu(),
    generateFloatingColourPalette(),
    generateAligners(),
    generateCopyPasteDimensions(),
    generateMatchAll(),
    generateFindSame(),
    generateTextFuse(),
    generateTextractor(),
    generateTableTools(),
    generateTinyAssets(),
    generateOCR(),
    generateHtmlToPpt(),
    generateHtmlSlideshow(),
    generateMediaExporter()
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
