'use strict'

import Profiler from './profiler';
import FirstPersonControls from './first-person-controls';
import Crosshair from './crosshair';
import Highlight from './highlight';


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
    this.profiler = new Profiler();
    this._prevTime = performance.now();
    this._highlight = null;
    this.frameno = 0;
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
      this._highlight.enabled = true;
    } else {
      this.controls.enabled = false;
      this._highlight.enabled = false;
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

    // FPS stats
    this.stats = new Stats();
    this._ui.appendChild(this.stats.dom);

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
    this._highlight = new Highlight(this._camera);
    this._highlight.enabled = false;
    this.scene.add(this._highlight);

    window.addEventListener('mousedown', function(event) {
        event.preventDefault();
        switch (event.which) {
        case 1:
          console.log('left');
          break;
        case 2:
          console.log('middle');
          break;
        case 3:
          console.log('right');
          break;
        }
        console.log('down!', event);
        return false;
    }, false);
  }

  drawScene() {
    this._renderer.clear();
    this._renderer.render(this.scene, this._camera);
    this._renderer.clearDepth();
    this._renderer.render(this.sceneui, this._camera);
    if (this.frameno < 10) {
      console.log(`engine.drawScene: ${this.profiler.mark()}`);
    }
  }

  update(frameno) {
    const time = performance.now();
    const delta = (time - this._prevTime) / 1000;
    this.controls.update(delta, frameno);
    this.crosshair.update(delta, frameno);
    this._highlight.update(delta, frameno);
    this._prevTime = time;
    if (this.frameno < 10) {
      console.log(`engine.update: ${this.profiler.mark()}`);
    }
  }

  animate() {
    this.stats.begin();
    if (this.frameno < 10) {
      console.log(`engine.animate start: ${this.profiler.mark()}`);
    }

    if (this._isRunning) {
      requestAnimationFrame(this.animate.bind(this));
    }

    this.update(this.frameno);    // Update Objects
    this.frameno++;
    this.drawScene(); // Draw the objects

    if (this.frameno < 10) {
      console.log(`engine.animate end: ${this.profiler.mark()}`);
    }

    this.stats.end();
  }

  start(options) {
    console.log(`engine.start: ${this.profiler.mark()}`);
    this.initScene();
    console.log(`engine.initScene: ${this.profiler.mark()}`);
    this._isRunning = true;
    this.animate();
  }

  stop() {
    this._isRunning = false;
  }

  get highlight() {
    return this._highlight;
  }

}

export default Engine;
