import Engine from '../ge/engine';
import { BRICK_WIDTH, BRICK_HEIGHT } from '../../shared/brick-geometry';
import Brick from '../../shared/brick';
import Chunk from '../../shared/chunk';
import Materials from '../../shared/materials';
import Storage from '../ge/storage';
import jsonKate from './chunk-kate';
import json1 from './chunk-1';
import json2 from './chunk-2';
import colors from '../../shared/colors';

import { Object3D,AmbientLight, DirectionalLight, DirectionalLightHelper, Mesh, MeshStandardMaterial, PointLight } from 'three';

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

class MyGame extends Engine {

  constructor(options) {
    super(options);
    this.storage = new Storage();
  }

  initScene() {
    super.initScene();
    this.controls.position.set(0, 88, 20 * 10); // Set starting position
    //this.controls.position.set(0, 0, 20 * 10); // Set starting position
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
    const light = new AmbientLight(0xffffff, 0.6); // soft white light
    light.name = 'Ambient';
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.name = 'Sun';
    directionalLight.position.set(3000, 6120, 0);
    this.scene.add(directionalLight);
    const sunHelper = new DirectionalLightHelper(directionalLight, 40);
    this.scene.add(sunHelper);
    // const pointLight = new PointLight(0xFFFFFF);
    // pointLight.name = 'Point';
    // pointLight.position.set(10, 30, 130);
    // this.scene.add(pointLight);



    //this.scene.add(new PointLightHelper(pointLight, 5));

    //----------------------------------
    // Add Geometry
    //----------------------------------
    // const reflectionCube = loadCubeMap();
    // this.scene.background = reflectionCube;


    this.brickMaterial = Materials.get(Materials.BRICK);
    this.brickMaterial.envMap = reflectionCube;
    this.brickMaterial.wireframe = false;


    this.chunk = Chunk.createFromJSON(jsonKate);
    this.chunk.createLod(0);
    const o1 = new Object3D();
    o1.position.x = this.chunk.position[0];
    o1.position.y = this.chunk.position[1];
    o1.position.z = this.chunk.position[2];
    o1.add(new Mesh(this.chunk.buffers.geometry, this.brickMaterial));
    this.scene.add(o1);
    //
    // const chunk1 = Chunk.createFromJSON(json1);
    // const o2 = new Object3D();
    // o2.position.x = chunk1.position[0];
    // o2.position.y = chunk1.position[1];
    // o2.position.z = chunk1.position[2];
    // chunk1.createLod(0);
    // o2.add(new Mesh(chunk1.geometry, this.brickMaterial));
    // this.scene.add(o2);
    //
    // const chunk2 = Chunk.createFromJSON(json2);
    // const o3 = new Object3D();
    // o3.position.x = chunk2.position[0];
    // o3.position.y = chunk2.position[1];
    // o3.position.z = chunk2.position[2];
    // chunk2.createLod(0);
    // o3.add(new Mesh(chunk2.geometry, this.brickMaterial));
    // this.scene.add(o3);
    //


    console.log('chunk-geo', this.chunk.buffers.geometry);
    this.highlight.selectables = this.chunk.buffers.selectables;
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
          this.highlight.selectables = this.chunk.buffers.selectables;
        });
    };

    const reload = (args) => {
      this.chunk.createLod(0);
      this.scene.remove(this.highlight.mesh);
      this.highlight.selectables = null;
      this.highlight.selectables = this.chunk.buffers.selectables;
      this.scene.add(this.highlight.mesh);
    };

    console.log(`game.execute("${command}")`);
    const args = command.split(' ');
    const commandName = args[0];
    switch (commandName) {
    case 'save':
      return save(args);
    case 'load':
      return load(args);
    case 'reload':
      return reload(args);
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
        if (brick && now - this.lastMouseLeft > 200 && this.chunk.plate !== brick) {
          this.lastMouseLeft = now;
          console.log('highlight-left', this.highlight.selected);
          this.chunk.remove(brick.brick);
        }
      } else {
        this.lastMouseLeft = 0;
      }

      if (this.controls.mouseMiddle) {
        if (brick && (now - this.lastMouseMiddle > 200)) {
          this.lastMouseMiddle = now;
          this.savedBrick = brick.brick;
          console.log('savedbrick: ', this.savedBrick);
        }
      } else {
        this.lastMouseMiddle = 0;
      }

      if (this.controls.mouseRight) {
        if (brick &&  (now - this.lastMouseRight > 200)) {
          this.lastMouseRight = now;

          //this.chunk.add()
          if (brick !== brick.brick) {
            // It's a stud
            const position = brick.position;
            const orientation = brick.orientation;
          } else {
            const normalArray = this.chunk.buffers.selectables.attributes.normal.array;
            console.log(this.chunk.buffers.selectables);

            const x = normalArray[this.highlight.faceIndex * 3];
            const y = normalArray[this.highlight.faceIndex * 3 + 1];
            const z = normalArray[this.highlight.faceIndex * 3 + 2];
            console.log(`x=${x},y=${y},z=${z}`);
            const color = this.savedBrick ? this.savedBrick.color : colors.getById('21');
            console.log(this.savedBrick);

            const position = [
              brick.position[0] + (x * BRICK_WIDTH),
              brick.position[1] + (y * BRICK_HEIGHT * 3),
              brick.position[2] + (z * BRICK_WIDTH)
            ];
            console.log('brick.position', brick.position);
            console.log('position', position);
            const newBrick = Brick.createFromPart(this.savedBrick.part, {
              position: position,
              color: color.id
            });
            newBrick.name = `(${newBrick.position})`;
            this.chunk.add(newBrick);
            console.log('chunk-geo-after', this.chunk.buffers.geometry);
            console.log('Added new brick: ', newBrick);
          }

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
