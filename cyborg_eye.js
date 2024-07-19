import gsap from 'https://cdn.skypack.dev/gsap';

console.clear();

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cyborg-eye'), antialias: true });
renderer.setClearColor(0x000000,0);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Cornea
const corneaGeometry = new THREE.SphereGeometry(1, 64, 64);
const corneaMaterial = new THREE.MeshStandardMaterial({
    color: 0x0096FF, // Light blue color for the cornea
    roughness: 0,
    metalness: 0.2,
    transparent: true,
    opacity: 0.3,
    emissive: 0x000008, // Emit light in a light blue color
    emissiveIntensity: 10,
    wireframe: true // Add a wireframe to give it a hologram effect
});

const cornea = new THREE.Mesh(corneaGeometry, corneaMaterial);
scene.add(cornea);

// Equatorial Ring
const ringGeometry1 = new THREE.TorusGeometry(1, 0.03, 30, 200); 
const ringMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const equatorialRing = new THREE.Mesh(ringGeometry1, ringMaterial1);
equatorialRing.rotation.x = Math.PI / 2; 
cornea.add(equatorialRing);

// Iris
const irisGeometry = new THREE.SphereGeometry(0.3, 64, 64);
const irisMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Cyan
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.3,
    emissive: 0x000008, // Emit light in a light blue color
    emissiveIntensity: 10,
    wireframe: true // Add a wireframe to give it a hologram effect
});

const iris = new THREE.Mesh(irisGeometry, irisMaterial);
iris.position.z = 0.8;
cornea.add(iris);

// Larger Iris-like Sphere
const largerIrisGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const largerIrisMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5, // Slightly transparent to distinguish it from the inner iris
});

const largerIris = new THREE.Mesh(largerIrisGeometry, largerIrisMaterial);
largerIris.position.z = 0.8; // Same z position as the iris
cornea.add(largerIris);

// Lines connecting the iris and the larger iris
const numLines = 50; // Number of lines
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    
}); 

for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    const points = [
        new THREE.Vector3(x * 0.40, y * 0.40, 0.3), // Point on the larger iris
        new THREE.Vector3(x * 0.26, y * 0.26, 0.5)  // Point on the smaller iris
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    largerIris.add(line);
}

// Circle on the surface of the larger iris
const ringGeometry = new THREE.RingGeometry(0.25, 0.27, 64);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // White
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.position.z = 0.5; // Slightly in front of the larger iris to avoid z-fighting
largerIris.add(ringMesh);

// Eyelids
const eyelidMaterial = new THREE.MeshStandardMaterial({
    color: 0x00008b, // Light silver color
    roughness: 0.6,
    metalness: 0.1,
});

// Logo on Iris
const logoTexture = new THREE.TextureLoader().load('ms_logo.png'); // Replace with your logo path
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
const logoGeometry = new THREE.PlaneGeometry(0.6 , 0.6); // Adjust size as needed
const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
iris.add(logoMesh);
logoMesh.position.set(0, 0, 0.5);

// Animation timeline using GSAP
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(cornea.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
  .fromTo('nav', { y: '-100%' }, { y: "0%" });

// Function to animate eyelids closing
function animateEyelids() {
  // Close the eyelids
  gsap.to(upperEyelid.rotation, { duration: 0.5, x: Math.PI / 4 });
  gsap.to(lowerEyelid.rotation, { duration: 0.5, x: -Math.PI / 4 });

  // Open the eyelids after a delay
  setTimeout(() => {
    gsap.to(upperEyelid.rotation, { duration: 0.5, x: Math.PI / 7 });
    gsap.to(lowerEyelid.rotation, { duration: 0.5, x: -Math.PI / 7 });
  }, 500);
}

// Call animateEyelids every 2 seconds
// setInterval(animateEyelids, 2000);

// Mouse movement interaction for cornea
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  cornea.rotation.y = mouseX * 0.2;  
  cornea.rotation.x = -mouseY * 0.2; 
  // iris.rotation.y = mouseX * 0.2;  
  // iris.rotation.x = -mouseY * 0.2;  
  // largerIris.rotation.y = mouseX * 0.2;  
  // largerIris.rotation.x = -mouseY * 0.2;  
});

// Scroll-based zooming
function handleScroll(event) {
  event.preventDefault();
  const delta = Math.max(-1, Math.min(0.5, (event.wheelDelta || -event.detail)));
  const zoomFactor = 0.1; // Adjust the zoom speed

  // Determine direction of scroll and zoom accordingly
  if (delta < 0) {
    zoomCamera(camera.position.z * (1 + zoomFactor));
  } else {
    zoomCamera(camera.position.z * (1 - zoomFactor));
  }
}

// Function to zoom the camera
function zoomCamera(zoomDistance) {
  const minZoom = 4; // Adjust the minimum zoom level
  const maxZoom = 5; // Adjust the maximum zoom level
  const targetZoom = Math.max(minZoom, Math.min(maxZoom, zoomDistance)); // Adjust minimum and maximum zoom levels
  gsap.to(camera.position, {
    duration: 0.5,
    z: targetZoom,
    ease: "power2.out"
  });
}

// Event listener for scroll events
document.addEventListener('mousewheel', handleScroll);
document.addEventListener('DOMMouseScroll', handleScroll);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
