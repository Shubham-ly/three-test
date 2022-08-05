import "./style.css";
import {
  AmbientLight,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gameWindowSize = { width: 500, height: 500 };
const loader = new GLTFLoader();

let camera;
let scene = new Scene();
let renderer = null;
let player = null;
let ambientLight = null;
let hemiLight = null;

function init() {
  scene = new Scene();
  camera = new PerspectiveCamera(
    75,
    gameWindowSize.width / gameWindowSize.height,
    0.1,
    1000
  );
  ambientLight = new AmbientLight(0x404040);
  renderer = new WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(gameWindowSize.width, gameWindowSize.height);
  camera.position.z = 5;
  camera.position.x = 0;
  camera.position.y = 2;

  camera.lookAt(scene.position);
  loader.load(
    "/assets/models/character.glb",
    (gltf) => {
      player = gltf;
      player.scene.position.y = -4;
      player.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      scene.add(player.scene);
    },
    undefined,
    (err) => console.error(err)
  );

  ambientLight = new AmbientLight(0xffffff, 3);
  hemiLight = new HemisphereLight(0xff0000, 0xffffff, 0.5);
  hemiLight.position.set(0, 50, 0);

  let floorGeometry = new PlaneGeometry(100, 100, 1, 1);
  let floorMaterial = new MeshPhongMaterial({
    color: 0xeeeeee,
    shininess: 0,
  });

  let floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -11;
  scene.add(floor);

  scene.add(ambientLight);
  scene.add(hemiLight);
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();
document.querySelector("#app").appendChild(renderer.domElement);
