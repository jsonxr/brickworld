'use strict'

import Clock from './clock';
import FirstPersonControls from './first-person-controls';

class Engine {

  constructor() {
    this._isRunning = false;
    this.ui = false;
    this.camera = null;
    this.prevTime = performance.now();
  }

  //--------------------------------------------------------------------------
  // Windowing, Fullscreen, Pointerlock
  //--------------------------------------------------------------------------

  _fullscreenChange(event) {
    console.log('fullscreenchange: ', event);//document.fullscreenElement);
    const element = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;
    if (element) {
      this.onWindowResize();
      element.requestPointerLock();
    }
  }

  setDomElement(id) {
    this.ui = document.getElementById(id);
    if (!this.ui) {
      throw new Error(`element "${id}" not found.`);
    }

    // window events...
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // When user clicks the UI, go into fullscreen mode
    this.ui.addEventListener('click', this.requestFullscreen.bind(this), false);

    // Polyfill for fullscreen api
    this.ui.requestFullscreen = this.ui.requestFullscreen ||
                                this.ui.webkitRequestFullscreen || // Polyfill
                                this.ui.msRequestFullscreen ||     // Polyfill
                                this.ui.mozRequestFullScreen;      // Polyfill
    document.addEventListener('fullscreenchange', this._fullscreenChange.bind(this));
    // Polyfills for fullscreen api. When this is fully supported, these below are not necessary
    document.addEventListener('webkitfullscreenchange', this._fullscreenChange.bind(this));
    document.addEventListener('msfullscreenchange', this._fullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this._fullscreenChange.bind(this));
  }

  requestFullscreen(event) {    
    console.log('who executed me? ', event);
    this.ui.requestFullscreen();
  }

  onWindowResize() {
    if (!this.ui) {
      return;
    }
    const width = this.ui.offsetWidth;
    const height = this.ui.offsetHeight;

    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
    if (this.camera) {
      this.camera.aspect = 1.0 * width / height;
      this.camera.updateProjectionMatrix();
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
    const width = this.ui.offsetWidth,
          height = this.ui.offsetHeight,
          aspectRatio = width/height;

    //----------------------------------
    // Scene
    //----------------------------------
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    window.scene = this.scene; // Important for Three.js inspector

    //----------------------------------
    // Camera
    //----------------------------------
    this._camera = new THREE.PerspectiveCamera(options.camera.fov,
                                               aspectRatio,
                                               options.camera.near,
                                               options.camera.far);

    //----------------------------------
    // Renderer
    //----------------------------------
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0x0f0f0f );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.ui.appendChild(this.renderer.domElement);

    // Grid
    const size = 16;
    const step = 32;
    const gridHelper = new THREE.GridHelper( size, step );
    this.scene.add(gridHelper);

    // Axis
    const axisHelper = new THREE.AxisHelper(5);
    this.scene.add(axisHelper);

    // FirstPerson Perspective
    this.controls = new FirstPersonControls(this._camera);
    this.controls.getObject().position.set(0,2,2);
    this.scene.add(this.controls.getObject());
  }

  drawScene() {
    this.renderer.render(this.scene, this._camera);
  }

  update() {
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;
    this.controls.update(delta);
    this.prevTime = time;
  }

  animate() {
    if (this._isRunning) {
      requestAnimationFrame(this.animate.bind(this));
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
