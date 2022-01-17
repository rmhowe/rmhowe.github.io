import './style.css';
import * as three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const fontLoader = new FontLoader();
const scene = new three.Scene();
scene.background = new three.Color('#c193f9');
const material = new three.MeshNormalMaterial();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Robbie Howe', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  const text = new three.Mesh(textGeometry, material);
  scene.add(text);
});

const donutGeometry = new three.TorusGeometry(0.2, 0.1, 20, 45);
for (let i = 0; i < 100; i++) {
  const donut = new three.Mesh(donutGeometry, material);

  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  donut.rotation.z = Math.random() * Math.PI;

  const scale = Math.max(0.3, Math.random());
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector('canvas.webgl') as HTMLElement;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new three.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
