import Engine from '../ge/engine';
import { BRICK_WIDTH, BRICK_HEIGHT } from '../../shared/brick-geometry';
import Brick from '../../shared/brick';
import Chunk from '../../shared/chunk';
import Materials from '../../shared/materials';
import parts from '../../shared/parts';
import { createSceneObjects, createSelectableObjects } from '../../shared/chunk-geometry';
//import colors from '../../shared/colors';

import Storage from '../ge/storage';
import kateChunk from './kate-chunk';
import brickChunk from './brick-chunk';
import { AmbientLight, DirectionalLight, Mesh, PointLight, PointLightHelper } from 'three';


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

    //----------------------------------
    // Lights
    //----------------------------------
    const light = new AmbientLight(0xffffff, 0.1); // soft white light
    light.name = 'Ambient';
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff, 0.1);
    directionalLight.name = 'Sun';
    directionalLight.position.set(0.2, 1, 0.2);
    this.scene.add(directionalLight);

    // const pointLight = new PointLight(0xFFFFFF);
    // pointLight.name = 'Point';
    // pointLight.position.set(10, 30, 130);
    // this.scene.add(pointLight);
    // this.scene.add(new PointLightHelper(pointLight, 5));

    //----------------------------------
    // Add Geometry
    //----------------------------------
    // const reflectionCube = loadCubeMap();
    // this.scene.background = reflectionCube;

    this.brickMaterial = Materials.get(Materials.BRICK);
    this.brickMaterial.wireframe = false;

    // this.chunk = new Chunk();
    // this.chunk.add(Brick.createFromPart(parts.getById('3005'), { position: [-10, 0, 10] }));
    // this.chunk.add(Brick.createFromPart(parts.getById('3004'), { position: [30, 0, 0] }));

    this.chunk = new Chunk(this.brickMaterial);
    this.chunk.fromJSON(kateChunk);
    // this.chunk.fromJSON(brickChunk);

    // build Object3d now
    this.chunk.createGeometry(0);
    this.scene.add(new Mesh(this.chunk.geometry, this.brickMaterial));
    this.chunk.createSelectable(this.highlight);
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


  // Bottom plate...
  createChunk(options) {
    const chunk = new Chunk(options);
    chunk.plate = addBottomPlate(chunk);
    //addLotsOfBricks(chunk, options);
    //add2Bricks(chunk);

    const brickGeometry = chunk.getBufferGeometry();
    chunk.brickMesh = new Mesh(brickGeometry, this.brickMaterial);
    chunk.brickMesh.name = 'BrickMesh';
    const studGeometry = chunk.getStudGeometry();
    chunk.studMesh = new Mesh(studGeometry, this.brickMaterial);
    chunk.studMesh.name = 'StudMesh';

    return chunk;
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

    //
    //
    // // Uncomment below to enable highlight selecting
    // const faceIndex = this.highlight.faceIndex;
    // //console.log(faceIndex);
    // if (faceIndex !== null) { // 0 is a valid faceIndex, so check for null
    //   const brick = this.chunk.getBrickFromFaceIndex(faceIndex);
    //   //const linestodraw = this.chunk.getHighlightFromFaceIndex(faceIndex);
    //   //TODO: get left/right node and compare to see if we need to update the
    //   // lines to highlight.
    //   if (brick.outline) {
    //     this.highlight.visible = true;
    //     //this.highlight.setPositionsArray(linestodraw.attributes.position.array);
    //     this.highlight.geometry.attributes.position.array.set(brick.outline.attributes.position.array);
    //   }
    // } else {
    //   this.highlight.visible = false;
    // }
    //

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
