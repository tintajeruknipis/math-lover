let scene, camera, renderer, shapeGroup;
let isNetOpen = false;

const canvasContainer = document.getElementById("canvas-container");
const subMenu = document.getElementById("sub-menu");
const controls = document.getElementById("controls");

initScene();

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / 500, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasContainer.clientWidth, 500);
  canvasContainer.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (shapeGroup) shapeGroup.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function clearScene() {
  if (shapeGroup) {
    scene.remove(shapeGroup);
    shapeGroup.traverse(child => {
      if (child.isMesh) child.geometry.dispose();
    });
    shapeGroup = null;
  }
}

function selectShape(name) {
  clearScene();
  subMenu.innerHTML = "";
  controls.style.display = "block";

  if (name === "prisma" || name === "limas") {
    const jenis = ["segitiga", "segiempat", "segilima", "segienam"];
    subMenu.innerHTML = `<h3>Pilih ${name}:</h3>`;
    jenis.forEach(j => {
      const btn = document.createElement("button");
      btn.innerText = `${name} ${j}`;
      btn.onclick = () => loadShape(`${name}-${j}`);
      subMenu.appendChild(btn);
    });
  } else {
    loadShape(name);
  }
}

function loadShape(type) {
  clearScene();
  isNetOpen = false;
  shapeGroup = new THREE.Group();

  switch (type) {
    case "kubus":
      createCube(); break;
    case "balok":
      createCuboid(); break;
    case "tabung":
      createCylinder(); break;
    case "kerucut":
      createCone(); break;
    case "prisma-segitiga":
      createPrism(3); break;
    case "prisma-segiempat":
      createPrism(4); break;
    case "prisma-segilima":
      createPrism(5); break;
    case "prisma-segienam":
      createPrism(6); break;
    case "limas-segitiga":
      createPyramid(3); break;
    case "limas-segiempat":
      createPyramid(4); break;
    case "limas-segilima":
      createPyramid(5); break;
    case "limas-segienam":
      createPyramid(6); break;
  }

  scene.add(shapeGroup);
}

function toggleNet() {
  isNetOpen = !isNetOpen;
  if (!shapeGroup) return;
  shapeGroup.children.forEach((face, i) => {
    face.position.set(...face.userData[isNetOpen ? "openPos" : "closePos"]);
  });
}

function createCube() {
  const size = 1;
  const positions = [
    [0, 0, size],
    [0, 0, -size],
    [-size, 0, 0],
    [size, 0, 0],
    [0, size, 0],
    [0, -size, 0]
  ];
  for (let i = 0; i < 6; i++) {
    const geom = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshLambertMaterial({ color: 0x4dd0e1, side: THREE.DoubleSide });
    const face = new THREE.Mesh(geom, mat);
    face.userData = {
      closePos: [0, 0, 0],
      openPos: positions[i]
    };
    shapeGroup.add(face);
  }
}

function createCuboid() {
  const dims = [1.5, 1, 0.5];
  const geometry = new THREE.BoxGeometry(...dims);
  const material = new THREE.MeshLambertMaterial({ color: 0x4dd0e1, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material);
  shapeGroup.add(mesh);
}

function createCylinder() {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
  const material = new THREE.MeshLambertMaterial({ color: 0x4dd0e1 });
  const mesh = new THREE.Mesh(geometry, material);
  shapeGroup.add(mesh);
}

function createCone() {
  const geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
  const material = new THREE.MeshLambertMaterial({ color: 0x4dd0e1 });
  const mesh = new THREE.Mesh(geometry, material);
  shapeGroup.add(mesh);
}

function createPrism(sides) {
  const shape = new THREE.Shape();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * 0.5;
    const y = Math.sin(angle) * 0.5;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  const extrudeSettings = { steps: 1, depth: 1, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshLambertMaterial({ color: 0x4dd0e1 });
  const mesh = new THREE.Mesh(geometry, material);
  shapeGroup.add(mesh);
}

function createPyramid(sides) {
  const radius = 0.6;
  const height = 1;
  const baseGeom = new THREE.CylinderGeometry(radius, 0, 0.01, sides);
  const top = new THREE.Vector3(0, height, 0);

  const geometry = new THREE.Geometry();
  const baseVertices = baseGeom.vertices.slice(0, sides);
  geometry.vertices.push(...baseVertices, top);

  for (let i = 0; i < sides; i++) {
    geometry.faces.push(new THREE.Face3(i, (i + 1) % sides, sides));
  }
  geometry.computeFaceNormals();
  const material = new THREE.MeshLambertMaterial({ color: 0x4dd0e1 });
  const mesh = new THREE.Mesh(geometry, material);
  shapeGroup.add(mesh);
}
