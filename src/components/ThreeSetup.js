import * as THREE from 'three'
import { color } from 'three/tsl'
import Stats from 'three/examples/jsm/libs/stats.module.js';


export function createScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.5,
      3000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Create cube
  const cubegeo = new THREE.SphereGeometry(1, 16, 16);
  const cubecol = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cube = new THREE.Mesh(cubegeo, cubecol);

  // Shader Material
  const material = new THREE.ShaderMaterial({
      vertexShader: `
          varying float vY;
          void main() {
              vY = position.y;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          varying float vY;
          void main() {
              float gradient = (vY + 1.0) / 2.0;
              vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), gradient);
              gl_FragColor = vec4(color, 1.0);
          }
      `,
      side: THREE.DoubleSide,
  });

  const geometry = new THREE.SphereGeometry(1, 16, 16);

  const spheres = [
      new THREE.Mesh(geometry, material),
     // new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
  ];

  // Set sphere positions
  const positions = [
      [8.5, -2.5, -10.5],
      // [-5.5, -2.5, -0.5],
      [4.5, 0.5, -2.5],
      [2.5, 0.5, -7.5],
      [9.5, 0.5, -3.5],
      [-4.5, 0.5, -5.5],
      [9.5, 0.5, -5.5],
      [-9.5, 0.5, -8.5],
  ];

  spheres.forEach((sphere, i) => {
      const [x, y, z] = positions[i];
      sphere.position.set(x, y, z);
  });

  // Add spheres and cube to scene
  spheres.forEach(s => scene.add(s));
  scene.add(cube);

  // Create pivot groups and add spheres to them
  const pivots = spheres.map(sphere => {
      const pivot = new THREE.Group();
      pivot.add(sphere);
      scene.add(pivot);
      return pivot;
  });

  // Create orbital rings using RingGeometry
  function createOrbitRing(radius) {
      const geometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 32);
      const material = new THREE.MeshBasicMaterial({ 
          color: 0xff0000, 
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2; // Make flat in XZ plane
      return ring;
  }

  spheres.forEach(sphere => {
      // Calculate distance from origin in XZ plane only (ignoring Y)
      const distance = Math.sqrt(sphere.position.x * sphere.position.x + sphere.position.z * sphere.position.z);
      const ring = createOrbitRing(distance);
      ring.position.y = sphere.position.y; // Match sphere's Y position
      scene.add(ring);
  });

  camera.position.set(1, 2, 10);
  const stats = Stats();
  document.body.appendChild(stats.dom);

  const animate = () => {
      requestAnimationFrame(animate);
      
      // Uncomment to enable animations
      
    //  cube.rotation.x += 0.01;
    //  cube.rotation.y += 0.01;
    //  pivots[0].rotation.y += 0.001; // Slowest
    //  pivots[1].rotation.y += 0.0012;
    //  pivots[2].rotation.y += 0.0009;
     // pivots[3].rotation.y += 0.0015;
     // pivots[4].rotation.y += 0.0011;
     // pivots[5].rotation.y += 0.0008;
    //  pivots[6].rotation.y += 0.0014;
   //   pivots[7].rotation.y += 0.001;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats.update(); // shows FPS
      
      
      renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  });

  
 
  
  return { scene, camera, renderer, spheres };
}