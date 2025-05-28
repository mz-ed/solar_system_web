import * as THREE from 'three'
import { color } from 'three/tsl'

export function createScene(container) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // Earth-like shader material
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        float y = vUv.y;

        vec3 ocean = vec3(0.0, 0.2, 0.6);  // Deep blue
        vec3 land = vec3(0.0, 0.5, 0.0);   // Green
        vec3 ice = vec3(1.0, 1.0, 1.0);    // White

        vec3 color;

        if (y < 0.4) {
          // Blend ocean -> land
          float t = smoothstep(0.2, 0.4, y);
          color = mix(ocean, land, t);
        } else {
          // Blend land -> ice
          float t = smoothstep(0.4, 0.9, y);
          color = mix(land, ice, t);
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `
  })

  const geometry = new THREE.SphereGeometry(1, 64, 64)
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.x = -2.5; 
  scene.add(sphere)
  

  //cube 
  const cubegeo = new THREE.BoxGeometry(1, 1, 1);

  const cubecol = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubegeo,cubecol);
  scene.add(cube);

  camera.position.z = 5
  const animate = () => {
    requestAnimationFrame(animate)
  
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
  
    renderer.render(scene, camera)
  }
  
  animate()
  

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer, sphere }
}
