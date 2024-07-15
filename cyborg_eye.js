import gsap from 'https://cdn.skypack.dev/gsap';

console.clear();

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cyborg-eye'), antialias: true });
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
    color: 0x3366ff, // Base color of the cornea
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.9,
    wireframe: true, // Display mesh wireframe
    wireframeLinewidth: 1, // Adjust thickness of wireframe lines
    wireframeLinecap: 'round', // Rounded line ends for better appearance
    wireframeLinejoin: 'round', // Rounded joints for wireframe
  });
  
  
const cornea = new THREE.Mesh(corneaGeometry, corneaMaterial);

// Create wireframe material for cornea
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
const corneaWireframe = new THREE.Mesh(corneaGeometry, wireframeMaterial);
cornea.add(corneaWireframe); // Add wireframe as a child of the cornea

scene.add(cornea);

// Iris
const irisGeometry = new THREE.SphereGeometry(0.3, 64, 64);
const irisMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff, // Cyan
    roughness: 0.5,
    metalness: 0.2,
  });
  
  
const iris = new THREE.Mesh(irisGeometry, irisMaterial);
iris.position.z = 0.8;
cornea.add(iris);

// Eyelids
const eyelidMaterial = new THREE.MeshStandardMaterial({
    color: 0x00008b, // Light silver color
    roughness: 0.6,
    metalness: 0.1,
  });
  
  
  

// const upperEyelidShape = new THREE.Shape();
// upperEyelidShape.moveTo(-1, 0);
// upperEyelidShape.quadraticCurveTo(0, 1, 1, 0);
// upperEyelidShape.lineTo(1, 0.15);
// upperEyelidShape.quadraticCurveTo(0, 0.85, -1, 0.15);
// upperEyelidShape.lineTo(-1, 0);

// const upperEyelidGeometry = new THREE.ExtrudeGeometry(upperEyelidShape, { depth: 1.3, bevelEnabled: false });
// const upperEyelid = new THREE.Mesh(upperEyelidGeometry, eyelidMaterial);
// upperEyelid.position.set(0, 0.50, 0.5);
// upperEyelid.rotation.x = Math.PI / 8;
// cornea.add(upperEyelid);

// const lowerEyelidShape = new THREE.Shape();
// lowerEyelidShape.moveTo(-1, 0);
// lowerEyelidShape.quadraticCurveTo(0, -1, 1, 0);
// lowerEyelidShape.lineTo(1, -0.15);
// lowerEyelidShape.quadraticCurveTo(0, -0.85, -1, -0.15);
// lowerEyelidShape.lineTo(-1, 0);

// const lowerEyelidGeometry = new THREE.ExtrudeGeometry(lowerEyelidShape, { depth: 1.3, bevelEnabled: false });
// const lowerEyelid = new THREE.Mesh(lowerEyelidGeometry, eyelidMaterial);
// lowerEyelid.position.set(0, -0.50, 0.5);
// lowerEyelid.rotation.x = -Math.PI / 7;
// cornea.add(lowerEyelid);

// Logo on Iris
const logoTexture = new THREE.TextureLoader().load('ms_logo.png'); // Replace with your logo path
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
const logoGeometry = new THREE.PlaneGeometry(0.4, 0.6); // Adjust size as needed
const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
iris.add(logoMesh);
logoMesh.position.set(0, 0, 0.31);


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
//setInterval(animateEyelids, 2000);

// Mouse movement interaction for iris
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  iris.position.x = mouseX * 0.2;  // Adjust multiplier as needed
  iris.position.y = mouseY * 0.2;  // Adjust multiplier as needed
});

// Orbit controls for camera

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
