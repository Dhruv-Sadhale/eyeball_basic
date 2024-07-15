
import gsap from 'https://cdn.skypack.dev/gsap';
console.clear();
const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({  canvas: document.getElementById('cyborg-eye'),antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.PointLight(0xffffff);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Create the cornea
const corneaGeometry = new THREE.SphereGeometry(1, 64, 64);
const corneaMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
const cornea = new THREE.Mesh(corneaGeometry, corneaMaterial);
scene.add(cornea);

// Create the iris
const irisGeometry = new THREE.SphereGeometry(0.3, 64, 64);  // Iris radius
const irisMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 50 });
const iris = new THREE.Mesh(irisGeometry, irisMaterial);
iris.position.z = 0.8;  // Positioned on the surface of the cornea
cornea.add(iris);

// Load the texture for the logo
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('ms_logo.png'); // Replace with your actual logo path

// Create a material for the logo on the iris
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });

// Create a separate mesh for the logo
const logoGeometry = new THREE.PlaneGeometry(0.4, 0.6); // Adjust size as needed
const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
iris.add(logoMesh);
logoMesh.position.set(0, 0, 0.31); // Position the logo appropriately on the iris

// Create the eyelids
const eyelidMaterial = new THREE.MeshPhongMaterial({ color: 0xffcc99, shininess: 30 }); // Human skin color

// Create half-sphere shape for the upper eyelid
const upperEyelidShape = new THREE.Shape();
upperEyelidShape.moveTo(-1, 0);
upperEyelidShape.quadraticCurveTo(0, 1, 1, 0);
upperEyelidShape.lineTo(1, 0.15);
upperEyelidShape.quadraticCurveTo(0, 0.85, -1, 0.15);
upperEyelidShape.lineTo(-1, 0);

const upperEyelidGeometry = new THREE.ExtrudeGeometry(upperEyelidShape, { depth: 1.3, bevelEnabled: false });
const upperEyelid = new THREE.Mesh(upperEyelidGeometry, eyelidMaterial);
upperEyelid.position.set(0, 0.50, 0.5);
upperEyelid.rotation.x = Math.PI / 8;
cornea.add(upperEyelid);

const lowerEyelidShape = new THREE.Shape();
lowerEyelidShape.moveTo(-1, 0);
lowerEyelidShape.quadraticCurveTo(0, -1, 1, 0);
lowerEyelidShape.lineTo(1, -0.15);
lowerEyelidShape.quadraticCurveTo(0, -0.85, -1, -0.15);
lowerEyelidShape.lineTo(-1, 0);

const lowerEyelidGeometry = new THREE.ExtrudeGeometry(lowerEyelidShape, { depth: 1.3, bevelEnabled: false });
const lowerEyelid = new THREE.Mesh(lowerEyelidGeometry, eyelidMaterial);
lowerEyelid.position.set(0, -0.50, 0.5);
lowerEyelid.rotation.x =  -Math.PI / 7;
cornea.add(lowerEyelid);

// Function to animate eyelids closing
function animateEyelids() {
    // Close the eyelids
    TweenMax.to(upperEyelid.rotation,1, { x: Math.PI / 4  });
    TweenMax.to(lowerEyelid.rotation, 1, { x: -Math.PI / 4 });

    // Open the eyelids after 1 second
    setTimeout(() => {
        TweenMax.to(upperEyelid.rotation, 1, { x: Math.PI / 7 });
        TweenMax.to(lowerEyelid.rotation, 1, { x: -Math.PI / 7 });
    }, 1000);
}

// Call animateEyelids every 2 seconds
//setInterval(animateEyelids, 3000);

// Mouse movement interaction for iris
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    iris.position.x = mouseX * 0.2;  // Adjust multiplier as needed
    iris.position.y = mouseY * 0.2;  // Adjust multiplier as needed
});

// Camera positioning
camera.position.z = 5;

// Render loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

const t1=gsap.timeline({defaults:{duration:1}})
t1.fromTo(cornea.scale,{z:0,x:0,y:0},{z:1,x:1,y:1})
t1.fromTo('nav',{y:'-100%'},{y:"0%"})

const controls=new OrbitControls(camera,canvas);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


