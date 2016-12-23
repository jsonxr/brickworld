import Engine from '../ge/engine';
import Brick from './brick';
import Chunk from './chunk';
import colors from '../../shared/colors';
import Storage from '../ge/storage';
import { BRICK_WIDTH, BRICK_HEIGHT } from '../../shared/brick-geometry';


function addBottomPlate(chunk) {
  const b = new Brick({ width: 32, depth: 32, height: 0.5, color: '#9BA19D', position: [0, -4, 0] });
  b.name = 'baseplate';
  chunk.add(b);
  return b;
}

// this.chunk = this.createChunk(myjson);
// this.scene.add(this.chunk.studMesh);
// this.scene.add(this.chunk.brickMesh);

function addLotsOfBricks(chunk, options = {}) {
  const width = options.width || 32;
  const depth = options.depth || 10;
  const height = options.height || 4;
  const offsets = options.offsets || [0,0,0];
  // width = 32, depth = 10, height = 4, offsets [0,0,0]
  let color;
  let b;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      for (let k = 0; k < height; k++) {
        if (i >= 0 && i < colors.values.length) {
          color = colors.values[i];
        } else {
          const colorIndex = Math.floor(Math.random() * colors.values.length);
          color = colors.values[colorIndex];
        }
        b = new Brick({
          width: 1,
          depth: 1,
          height: 3,
          color,
          position: [
            (i * BRICK_WIDTH) - 310 + (offsets[0] * BRICK_WIDTH),
            (k * BRICK_HEIGHT*3) + 0 + (offsets[1] * BRICK_HEIGHT * 3),
            (j * BRICK_WIDTH) - 310 + (offsets[2] * BRICK_WIDTH)
          ] });
        b.name = `(${i},${j},${k})`
        chunk.add(b);
      }
    }
  }
}

// Set the normals so we can see them
function addNormals(bricks, scene) {
  const edges = new THREE.VertexNormalsHelper(bricks, 2, 0xffffff, 1 );
  scene.add(edges);
}
//
// function addInstances() {
//
//   const triangles = 1;
//   const instances = 65000;
//
//   var geometry = new THREE.InstancedBufferGeometry();
//   geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise
//
//   var vertices = new THREE.BufferAttribute( new Float32Array( triangles * 3 * 3 ), 3 );
//   vertices.setXYZ( 0, 20.025, -20.025, 0 );
//   vertices.setXYZ( 1, -20.025, 20.025, 0 );
//   vertices.setXYZ( 2, 0, 0, 20.025 );
//   geometry.addAttribute( 'position', vertices );
//   var offsets = new THREE.InstancedBufferAttribute( new Float32Array( instances * 3 ), 3, 1 );
//   for ( let i = 0, ul = offsets.count; i < ul; i++ ) {
//     offsets.setXYZ( i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
//   }
//   geometry.addAttribute( 'offset', offsets );
//   var colors = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
//   for ( let i = 0, ul = colors.count; i < ul; i++ ) {
//     colors.setXYZW( i, Math.random(), Math.random(), Math.random(), Math.random() );
//   }
//   geometry.addAttribute( 'color', colors );
//   var vector = new THREE.Vector4();
//   var orientationsStart = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
//   for ( let i = 0, ul = orientationsStart.count; i < ul; i++ ) {
//     vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
//     vector.normalize();
//     orientationsStart.setXYZW( i, vector.x, vector.y, vector.z, vector.w );
//   }
//   geometry.addAttribute( 'orientationStart', orientationsStart );
//   var orientationsEnd = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
//   for ( let i = 0, ul = orientationsEnd.count; i < ul; i++ ) {
//     vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
//     vector.normalize();
//     orientationsEnd.setXYZW( i, vector.x, vector.y, vector.z, vector.w );
//   }
//   geometry.addAttribute( 'orientationEnd', orientationsEnd );
//   // material
//   var material = new THREE.RawShaderMaterial( {
//     uniforms: {
//       time: { value: 1.0 },
//       sineTime: { value: 1.0 }
//     },
//     vertexShader: document.getElementById( 'vertexShader' ).textContent,
//     fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
//     side: THREE.DoubleSide,
//     transparent: true
//   } );
//   var mesh = new THREE.Mesh( geometry, material );
//   return mesh;
// }

function loadCubeMap() {
  const urls = [
    'cubemaps/px.jpg', 'cubemaps/nx.jpg',
    'cubemaps/py.jpg', 'cubemaps/ny.jpg',
    'cubemaps/pz.jpg', 'cubemaps/nz.jpg'
  ];
  const refractionCube = new THREE.CubeTextureLoader().load( urls );
  refractionCube.mapping = THREE.CubeRefractionMapping;
  refractionCube.format = THREE.RGBFormat;
  return refractionCube;
}

class MyGame extends Engine {

  constructor() {
    super();
    this.storage = new Storage();
  }

  initScene() {
    if (this.frameno < 10) {
      console.log(`before super.initScene: ${this.profiler.mark()}`);
    }
    super.initScene();

    // Todo: Pass the id in when we create the game instead
    this.controls.domCommand = {
      input: document.getElementById('command'),
      history: document.getElementById('commandhistory')
    };

    if (this.frameno < 10) {
      console.log(`after super.initScene: ${this.profiler.mark()}`);
    }
    //----------------------------------
    // Lights
    //----------------------------------
    const light = new THREE.AmbientLight(0x808080); // soft white light
    light.name = 'Ambient';
    this.scene.add(light);
    console.log(`create light: ${this.profiler.mark()}`);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.name = 'Sun';
    directionalLight.position.set(0.2, 1, 0.2);
    this.scene.add(directionalLight);
    console.log(`create directional light: ${this.profiler.mark()}`);

    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.name = 'Point';
    pointLight.position.set(10, 30, 130);
    this.scene.add(pointLight);
    console.log(`create point light: ${this.profiler.mark()}`);

    //----------------------------------
    // Add Geometry
    //----------------------------------
    const reflectionCube = loadCubeMap();
    //this.scene.background = reflectionCube;

    // const refractionCube = loadCubeMap();
    // refractionCube.mapping = THREE.CubeRefractionMapping;

    // Material to use for drawing bricks
    this.brickMaterial = new THREE.MeshStandardMaterial({
      //wireframe:true,
      vertexColors: THREE.VertexColors,
      //precision: 'highp',
      envMap: reflectionCube,
      refractionRatio: 0.95,
      reflectivity: 0.3,
      //metalness: 0.5,
      //roughness: 0.98,
    });

    this.controls.position.set(0, 88, 20 * 3); // Set starting position

    this.chunk = this.createChunk();
    addLotsOfBricks(this.chunk, { width: 29, depth: 1, height: 1, offsets: [0,0,0]});
    this.scene.add(this.chunk.studMesh);
    this.scene.add(this.chunk.brickMesh);
    this.highlight.selectable = this.chunk.getSelectable();
    //addNormals(bricks, this.scene);

    if (this.frameno < 10) {
      console.log(`game.initScene: ${this.profiler.mark()}`);
    }

    // this.highlight.onSelection = (intersect, positions) => {
    //   const linestodraw = this.chunk.getHighlightFromFaceIndex(intersect.faceIndex);
    //   positions.array.set(linestodraw.attributes.position.array);
    // };
  }

  // Bottom plate...
  createChunk(options) {
    const chunk = new Chunk(options);
    chunk.plate = addBottomPlate(chunk);
    //addLotsOfBricks(chunk, options);
    //add2Bricks(chunk);

    const brickGeometry = chunk.getBufferGeometry();
    chunk.brickMesh = new THREE.Mesh(brickGeometry, this.brickMaterial);
    chunk.brickMesh.name = 'BrickMesh';
    const studGeometry = chunk.getStudGeometry();
    chunk.studMesh = new THREE.Mesh(studGeometry, this.brickMaterial);
    chunk.studMesh.name = 'StudMesh';

    return chunk;
  }

  execute(command) {

    const save = (args) => {
      const name = args[1] || this.chunk.name;
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
          this.highlight.selectable = this.chunk.getSelectable();
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

  //
  // execute(command) {
  //   console.log(`game.execute("${command}")`);
  //   const args = command.split(' ');
  //   if (args[0] === 'save') {
  //     this.storage.save(args[1], this.chunk.toJSON())
  //       .then( () => {
  //         console.log('success');
  //       });
  //   }
  //   if (command.indexOf('load') === 0) {
  //     this.storage.load('myname')
  //       .then((myjson) => {
  //         this.scene.remove(this.chunk.studMesh); // Remove old chunk
  //         this.scene.remove(this.chunk.brickMesh); // Remove old chunk
  //         console.log('loaded...: ', myjson);
  //
  //         this.chunk = this.createChunk(myjson);
  //         this.scene.add(this.chunk.studMesh);
  //         this.scene.add(this.chunk.brickMesh);
  //         this.highlight.selectable = this.chunk.getSelectable();
  //       });
  //   }
  // }

  update(frameNo) {
    super.update(frameNo);

    // var time = performance.now();
    // var object = this.instances;
    // object.rotation.y = time * 0.0005;
    // object.material.uniforms.time.value = time * 0.005;
    // object.material.uniforms.sineTime.value = Math.sin( object.material.uniforms.time.value * 0.05 );


    // Uncomment below to enable highlight selecting
    const faceIndex = this.highlight.faceIndex;
    if (faceIndex !== null) { // 0 is a valid faceIndex, so check for null
      const linestodraw = this.chunk.getHighlightFromFaceIndex(faceIndex);
      //TODO: get left/right node and compare to see if we need to update the
      // lines to highlight.
      if (linestodraw) {
        this.highlight.visible = true;
        //this.highlight.setPositionsArray(linestodraw.attributes.position.array);
        this.highlight.geometry.attributes.position.array.set(linestodraw.attributes.position.array);
      }
    } else {
      this.highlight.visible = false;
    }


    if (this.isFullscreen && this.highlight.visible) {
      const brick = this.chunk.selectedBrick;
      const now = performance.now();
      if (this.controls.mouseLeft) {
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
        }
      } else {
        this.lastMouseMiddle = 0;
      }

      if (this.controls.mouseRight) {
        if (brick &&  (now - this.lastMouseRight > 200)) {
          console.log(this.chunk.faceIndex);
          //this.chunk.add()
          const normalArray = this.chunk.selectable.attributes.normal.array;
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
          this.lastMouseRight = now;
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
  console.log('fullscreenchange', event);
  console.log('fullscreen: ', element);
  window.game.isFullscreen = (element !== undefined);
}
document.addEventListener('webkitfullscreenchange', logFullscreenChange);
document.addEventListener('msfullscreenchange', logFullscreenChange);
document.addEventListener('mozfullscreenchange', logFullscreenChange);

document.addEventListener('pointerlockchange', (event) => {
  // The target of the event is always the document,
  // but it is possible to retrieve the locked element through the API
  const pointerLockElement = document.pointerLockElement ||
                             document.webkitPointerLockElement ||
                             document.mozPointerLockElement ||
                             document.msPointerLockElement;
  console.log('pointerlockchange: ', event);
  console.log(`pointerLockElement: ${pointerLockElement}`);
});

window.game = new MyGame();
setTimeout(() => { // Ensure we can fail in a source map friendly place (not index.html)
  window.game.setDomElement('ui');
  window.game.start();
}, 0);
