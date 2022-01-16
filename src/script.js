import './style.css';
import * as three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui';

const debugUI = new lil.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

const textureLoader = new three.TextureLoader();
const cubeTextureLoader = new three.CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

gradientTexture.minFilter = three.NearestFilter;
gradientTexture.magFilter = three.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/1/px.jpg',
  '/textures/environmentMaps/1/nx.jpg',
  '/textures/environmentMaps/1/py.jpg',
  '/textures/environmentMaps/1/ny.jpg',
  '/textures/environmentMaps/1/pz.jpg',
  '/textures/environmentMaps/1/nz.jpg',
]);

// Scene
const scene = new three.Scene();

const ambientLight = new three.AmbientLight(0xffffff, 0.5);
const pointLight = new three.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

// const material = new three.MeshBasicMaterial({
//   map: doorColorTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true,
//   side: three.DoubleSide,
// });
// const material = new three.MeshNormalMaterial({ flatShading: true });
// const material = new three.MeshMatcapMaterial({ matcap: matcapTexture });
// const material = new three.MeshDepthMaterial();
// const material = new three.MeshLambertMaterial();
// const material = new three.MeshPhongMaterial({
//   shininess: 100,
//   specular: new three.Color(0x0000ff),
// });
// const material = new three.MeshToonMaterial({ gradientMap: gradientTexture });
const material = new three.MeshStandardMaterial({
  //   map: doorColorTexture,
  //   aoMap: doorAmbientOcclusionTexture,
  //   aoMapIntensity: 1,
  //   displacementMap: doorHeightTexture,
  //   displacementScale: 0.05,
  //   metalnessMap: doorMetalnessTexture,
  //   roughnessMap: doorRoughnessTexture,
  //   normalMap: doorNormalTexture,
  //   transparent: true,
  //   alphaMap: doorAlphaTexture,
  metalness: 0.9,
  roughness: 0.1,
  envMap: environmentMapTexture,
});

debugUI.add(material, 'metalness').min(0).max(1).step(0.0001);
debugUI.add(material, 'roughness').min(0).max(1).step(0.0001);

const sphere = new three.Mesh(new three.SphereGeometry(1, 64, 64), material);
const plane = new three.Mesh(new three.PlaneGeometry(1, 1, 100, 100), material);
const torus = new three.Mesh(new three.TorusGeometry(1, 0.2, 64, 128), material);

sphere.position.set(-3, 0, 0);
plane.position.set(0, 0, 0);
torus.position.set(3, 0, 0);

sphere.geometry.setAttribute(
  'uv2',
  new three.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  'uv2',
  new three.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  'uv2',
  new three.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 6;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.2 * elapsedTime;
  plane.rotation.y = 0.2 * elapsedTime;
  torus.rotation.y = 0.2 * elapsedTime;

  sphere.rotation.x = 0.2 * elapsedTime;
  plane.rotation.x = 0.2 * elapsedTime;
  torus.rotation.x = 0.2 * elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
