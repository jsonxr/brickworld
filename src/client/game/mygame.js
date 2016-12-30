import Engine from '../ge/engine';
import { BRICK_WIDTH, BRICK_HEIGHT } from '../../shared/brick-geometry';
import Brick from '../../shared/brick';
import Chunk from '../../shared/chunk';
import Materials from '../../shared/materials';
import parts from '../../shared/parts';
import colors from '../../shared/colors';
import { createSceneObjects, createSelectableObjects } from '../../shared/chunk-geometry';
import BufferGeometryHeap from '../../shared/buffer-geometry-heap';
//import colors from '../../shared/colors';

import * as brickGeometry from '../../shared/brick-geometry';

import Storage from '../ge/storage';
import kateChunk from './kate-chunk';
import brickChunk from './brick-chunk';
import oneChunk from './one-chunk';

import { AmbientLight, DirectionalLight, Mesh, MeshStandardMaterial, PointLight, PointLightHelper, VertexColors } from 'three';

function loadCubeMap() {
  const urls = [
    'textures/cube/SwedishRoyalCastle/px.jpg',
    'textures/cube/SwedishRoyalCastle/nx.jpg',
    'textures/cube/SwedishRoyalCastle/py.jpg',
    'textures/cube/SwedishRoyalCastle/ny.jpg',
    'textures/cube/SwedishRoyalCastle/pz.jpg',
    'textures/cube/SwedishRoyalCastle/nz.jpg'
  ];
  const reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;
  return reflectionCube;
}

function addLotsOfBricks(chunk, options = {}) {
  const width = options.width || 32;
  const depth = options.depth || 10;
  const height = options.height || 4;
  const offsets = options.offsets || [0, 0, 0];
  // width = 32, depth = 10, height = 4, offsets [0,0,0]
  let color;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      for (let k = 0; k < height; k++) {
        if (i >= 0 && i < colors.values.length) {
          color = colors.values[i];
        } else {
          const colorIndex = Math.floor(Math.random() * colors.values.length);
          color = colors.values[colorIndex];
        }
        const position = [i * BRICK_WIDTH - 310 + offsets[0] * BRICK_WIDTH, k * BRICK_HEIGHT * 3 + 0 + offsets[1] * BRICK_HEIGHT * 3, j * BRICK_WIDTH - 310 + offsets[2] * BRICK_WIDTH];
        chunk.add(Brick.createFromPart(parts.getById('3005'), { color: color, position: position }));
        //chunk.add(b);
      }
    }
  }
}

class MyGame extends Engine {

  constructor(options) {
    super(options);
    this.storage = new Storage();
  }

  initScene() {
    super.initScene();
    this.controls.position.set(0, 88, 20 * 10); // Set starting position
    // Todo: Pass the id in when we create the game instead
    this.controls.domCommand = {
      input: document.getElementById('command'),
      history: document.getElementById('commandhistory')
    };

    const reflectionCube = loadCubeMap();
    this.scene.background = reflectionCube;
    //----------------------------------
    // Lights
    //----------------------------------
    const light = new AmbientLight(0xffffff);//ffffff, 0.6); // soft white light
    light.name = 'Ambient';
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.name = 'Sun';
    directionalLight.position.set(0.2, 1, 0.2);
    this.scene.add(directionalLight);

    const pointLight = new PointLight(0xFFFFFF);
    pointLight.name = 'Point';
    pointLight.position.set(10, 30, 130);
    this.scene.add(pointLight);



    //this.scene.add(new PointLightHelper(pointLight, 5));

    //----------------------------------
    // Add Geometry
    //----------------------------------
    // const reflectionCube = loadCubeMap();
    // this.scene.background = reflectionCube;

    this.brickMaterial = new MeshStandardMaterial({
      vertexColors: VertexColors,
      // refractionRatio: 0.98,
      // roughness: 0.6,
      // metalness: 0.2,
      // //wireframe: false,
      // envMap: reflectionCube,
      // envMapIntensity: 1
    });

    const heap = new BufferGeometryHeap(1024, { uv: false });
    let bg = heap.newFromGeometry(brickGeometry.getGeometryForBrickPart(1,1,3));
    brickGeometry.applyToGeometry(bg, [-10,0,-10], '#05131D', null);
    let b = new Mesh(bg, this.brickMaterial);
    this.scene.add(b);
    console.log('bg1', bg);

    bg = heap.newFromGeometry(brickGeometry.getGeometryForBrickPart(1,1,3));
    brickGeometry.applyToGeometry(bg, [10, 0, -10], '#C91A09', null);
    b = new Mesh(bg, this.brickMaterial);
    this.scene.add(b);
    console.log('bg2', bg);


    // this.brickMaterial = Materials.get(Materials.BRICK);
    // this.brickMaterial.wireframe = false;
    // this.brickMaterial.envMap = reflectionCube;
    // this.brickMaterial.envMapIntensity = 1.0;

    this.chunk = new Chunk();
    addLotsOfBricks(this.chunk, { width: 29, depth: 1, height: 1, offsets: [0, 0, 0] });
    // this.chunk.add(Brick.createFromPart(parts.getById('3005'), { position: [-10, 0, 10] }));
    // this.chunk.add(Brick.createFromPart(parts.getById('3004'), { position: [30, 0, 0] }));

//    this.chunk.fromJSON(kateChunk);
    //this.chunk.fromJSON(oneChunk);
//    this.chunk.fromJSON(brickChunk);

    // build Object3d now
    this.chunk.createLod(0);
    this.scene.add(new Mesh(this.chunk.geometry, this.brickMaterial));
    console.log(this.chunk.geometry);
    this.highlight.selectable = this.chunk.selectable;
    this.highlight.outline = this.chunk.outline;

    //this.chunk.createSelectable(this.highlight);
    //createSelectableObjects(this.chunk, this.highlight);






    /*
    const mesh = new ChunkMesh(chunk, this.brickMaterial, 0);
    this.scene.add(mesh);
    this.chunk.add(new Brick({}));

    events.on(chunk, 'add', () => {

    });

    events.emit(chunk, 'add'

    this.scene.remove(mesh);


    this.chunk.createMesh(this.brickMaterial, 0);

    this.chunk.add(new Brick({})); // Adds to the geometry...
    brick.geometry...
*/




    //this.scene.add(this.highlight.selectableMesh);
  }


  execute(command) {

    const save = (args) => {
      const name = args[1] || this.chunk.name;
      this.chunk.name = name;
      return this.storage.save(name, this.chunk.toJSON())
        .then( () => {
          console.log('success');
        });
    };

    const load = (args) => {
      return this.storage.load(args[1])
        .then((myjson) => {
          this.scene.remove(this.chunk.studMesh); // Remove old chunk
          this.scene.remove(this.chunk.brickMesh); // Remove old chunk

          this.chunk = this.createChunk(myjson);
          this.scene.add(this.chunk.studMesh);
          this.scene.add(this.chunk.brickMesh);
          this.highlight.selectable = this.chunk.selectables;
        });
    };

    console.log(`game.execute("${command}")`);
    const args = command.split(' ');
    const commandName = args[0];
    switch (commandName) {
    case 'save':
      return save(args);
    case 'load':
      return load(args);
    default:
      return Promise.reject();
    }
  }

  update(frameNo) {
    super.update(frameNo);

    // var time = performance.now();
    // var object = this.instances;
    // object.rotation.y = time * 0.0005;
    // object.material.uniforms.time.value = time * 0.005;
    // object.material.uniforms.sineTime.value = Math.sin( object.material.uniforms.time.value * 0.05 );

    //console.log(`this.isFullscreen: ${this.isFullscreen} highlight: ${this.highlight.visible}`);
    if (this.isFullscreen && this.highlight.visible) {
      const brick = this.highlight.selected;
      const now = performance.now();
      if (this.controls.mouseLeft) {
        console.log('highlight-left', this.highlight.selected);
        if (brick && now - this.lastMouseLeft > 200 && this.chunk.plate !== brick) {
          this.chunk.remove(brick);
          this.lastMouseLeft = now;
        }
      } else {
        this.lastMouseLeft = 0;
      }

      if (this.controls.mouseMiddle) {
        if (brick && (now - this.lastMouseMiddle > 200)) {
          brick.color;
          this.savedBrick = brick;
          this.lastMouseMiddle = now;
          console.log('savedbrick: ', this.savedBrick);
        }
      } else {
        this.lastMouseMiddle = 0;
      }

      if (this.controls.mouseRight) {
        if (brick &&  (now - this.lastMouseRight > 200)) {
          this.lastMouseRight = now;
          console.log(this.chunk.faceIndex);
          //this.chunk.add()
          const normalArray = this.chunk.selectables.attributes.normal.array;
          const x = normalArray[this.chunk.faceIndex * 3];
          const y = normalArray[this.chunk.faceIndex * 3 + 1];
          const z = normalArray[this.chunk.faceIndex * 3 + 2];
          console.log(`x=${x},y=${y},z=${z}`);
          const color = this.savedBrick ? this.savedBrick.color : '#C91A09';
          const b = new Brick({
            width: 1,
            depth: 1,
            height: 3,
            color: color,
            position: [
              brick.position[0] + (x * BRICK_WIDTH),
              brick.position[1] + (y * BRICK_HEIGHT * 3),
              brick.position[2] + (z * BRICK_WIDTH)
            ]
          });
          b.name = `(${b.position})`;
          this.chunk.add(b);
          console.log(b);

          //this.chunk.remove(this.chunk.selectedBrick);
        }
      } else {
        this.lastMouseRight = 0;
      }

    }

  }
}

/**
 * Called when fullscreen mode changes
 * @param {object} event - the event passed in by fullscreen
 * @private
*/
function logFullscreenChange(event) {
  // The event object doesn't carry information about the fullscreen state of the browser,
  // but it is possible to retrieve it through the fullscreen API
  const element = document.fullscreenElement ||
                  document.webkitFullscreenElement ||
                  document.mozFullScreenElement ||
                  document.msFullscreenElement;
  // The target of the event is always the document,
  // but it is possible to retrieve the fullscreen element through the API
  //console.log('fullscreenchange', event);
  //console.log(event);
  window.game.isFullscreen = (element !== undefined);
}
document.addEventListener('webkitfullscreenchange', logFullscreenChange);
document.addEventListener('msfullscreenchange', logFullscreenChange);
document.addEventListener('mozfullscreenchange', logFullscreenChange);
document.addEventListener('fullscreenchange', logFullscreenChange);

document.addEventListener('pointerlockchange', (event) => {
  // The target of the event is always the document,
  // but it is possible to retrieve the locked element through the API
  const pointerLockElement = document.pointerLockElement ||
                             document.webkitPointerLockElement ||
                             document.mozPointerLockElement ||
                             document.msPointerLockElement;
  //console.log('pointerlockchange: ', event);
  //console.log(`pointerLockElement: ${pointerLockElement}`);
});

window.game = new MyGame({
  canvas: document.getElementById('canvas')
});
setTimeout(() => { // Ensure we can fail in a source map friendly place (not index.html)
  window.game.setDomElement('ui');
  window.game.start();
}, 0);
