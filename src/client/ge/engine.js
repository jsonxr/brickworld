'use strict'

import Clock from './clock';
import FirstPersonControls from './first-person-controls';
import Crosshair from './crosshair';

function _fullscreenPolyfill(ui, fn, me) {
  ui.requestFullscreen = ui.requestFullscreen ||
                         ui.webkitRequestFullscreen || // Polyfill
                         ui.msRequestFullscreen ||     // Polyfill
                         ui.mozRequestFullScreen;      // Polyfill
  // Polyfills for fullscreen api. When this is fully supported, these below are not necessary
  document.addEventListener('webkitfullscreenchange', fn.bind(me));
  document.addEventListener('msfullscreenchange', fn.bind(me));
  document.addEventListener('mozfullscreenchange', fn.bind(me));
}

class Engine {

  constructor() {
    this._isRunning = false;
    this._ui = false;
    this._camera = null;
    this._renderer = null;
    this.scene = null;
    this._prevTime = performance.now();
  }

  //--------------------------------------------------------------------------
  // Windowing, Fullscreen, Pointerlock
  //--------------------------------------------------------------------------

  _fullscreenChange(event) {
    const element = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;
    this.onWindowResize();
    if (element) {
      element.requestPointerLock();
      this.controls.enabled = true;
    } else {
      this.controls.enabled = false;
    }
  }

  setDomElement(id) {
    this._ui = document.getElementById(id);
    if (!this._ui) {
      throw new Error(`element "${id}" not found.`);
    }

    // window events...
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // When user clicks the UI, go into fullscreen mode
    this._ui.addEventListener('click', this.requestFullscreen.bind(this), false);

    // Polyfill for fullscreen api
    this._ui.requestFullscreen = this._ui.requestFullscreen;
    document.addEventListener('fullscreenchange', this._fullscreenChange.bind(this));
    _fullscreenPolyfill(this._ui, this._fullscreenChange, this);
  }

  requestFullscreen(event) {    
    this._ui.requestFullscreen();
  }

  onWindowResize() {
    if (this._ui && this._renderer && this._camera) {
      const width = this._ui.offsetWidth;
      const height = this._ui.offsetHeight;
      this._renderer.setSize(width, height);
      this._camera.aspect = 1.0 * width / height;
      this._camera.updateProjectionMatrix();
    }
  }

  //--------------------------------------------------------------------------
  // Graphics - Three.js
  //--------------------------------------------------------------------------

  initScene(
    options = { 
      camera: { 
        fov: 70,
        near: 1, 
        far: 10000
      }
    }
  ) {
    const width = this._ui.offsetWidth,
          height = this._ui.offsetHeight,
          aspectRatio = width/height;

    //----------------------------------
    // Scene
    //----------------------------------

    // this is the main scene where the geometry lives
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    window.scene = this.scene; // Needed for Three.js inspector

    // This will render all elements on top of the underlying scene
    this.sceneui = new THREE.Scene();
    this.sceneui.name = 'Scene UI';

    //----------------------------------
    // Camera
    //----------------------------------
    this._camera = new THREE.PerspectiveCamera(options.camera.fov,
                                               aspectRatio,
                                               options.camera.near,
                                               options.camera.far);

    //----------------------------------
    // 3d Cursor
    //----------------------------------
    // Cursor
    this.crosshair = new Crosshair(this._camera);
    this.sceneui.add(this.crosshair);

    //----------------------------------
    // Renderer
    //----------------------------------
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(width, height);
    this._renderer.setClearColor( 0x0f0f0f );
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.autoClear = false;
    this._ui.appendChild(this._renderer.domElement);

    // Grid
    const size = 16 * 20; // 20LDU units x 16 studs
    const step = 32;
    const gridHelper = new THREE.GridHelper( size, step );
    this.scene.add(gridHelper);
    
    // FirstPerson Perspective
    this.controls = new FirstPersonControls(this._camera);  
    this.controls.position.set(0, 88, 20 * 15); // Set starting position
    this.scene.add(this.controls.getObject());


    // This is used for selecting geometry...
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 20 * 8; // 8 blocks distance
    this.mouse = new THREE.Vector2(0, 0);
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
    var material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 4,
      transparent: true
    });
    this.line = new THREE.Line(geometry, material);
    scene.add(this.line);
    // this is not necessary because we only select in fullscreen mode
    // document.addEventListener('mousemove', event => {
    //   const width = this._ui.offsetWidth;
    //   const height = this._ui.offsetHeight;
    //   event.preventDefault();
    //   mouse.x = (event.clientX / width) * 2 - 1;
    //   mouse.y = -(event.clientY / height) * 2 + 1;
    //   console.log(`mouse: ${mouse.x},${mouse.y}`);
    // }, false);

  }

  drawScene() {
    this._renderer.clear();
    this._renderer.render(this.scene, this._camera);
    this._renderer.clearDepth();
    this._renderer.render(this.sceneui, this._camera);
  }

  update() {
    const time = performance.now();
    const delta = (time - this._prevTime) / 1000;
    this.controls.update(delta);
    this.crosshair.update();
    this._prevTime = time;
  }

  animate() {
    if (this._isRunning) {
      requestAnimationFrame(this.animate.bind(this));
    }
    this.raycaster.setFromCamera(this.mouse, this._camera );
    var intersects = this.raycaster.intersectObject(this.selectable);

    if (intersects.length > 0) {

      var intersect = intersects[0];
      var face = intersect.face;

      var linePosition = this.line.geometry.attributes.position;
      var meshPosition = this.selectable.geometry.attributes.position;

      linePosition.copyAt(0, meshPosition, face.a);
      linePosition.copyAt(1, meshPosition, face.b);
      linePosition.copyAt(2, meshPosition, face.c);
      linePosition.copyAt(3, meshPosition, face.a);
      this.selectable.updateMatrix();
      this.line.geometry.applyMatrix(this.selectable.matrix);
      this.line.visible = true;
    } else {
      this.line.visible = false;
    }

    this.update();    // Update Objects
    this.drawScene(); // Draw the objects
  }

  start(options) {
    this.initScene();
    this._isRunning = true;
    this.animate();
  }

  stop() {
    this._isRunning = false;
  }
}

export default Engine;
