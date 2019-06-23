/**
 * @module client/ge
 */
import HeroControl from './controls/hero-control';
import Cursor3d from './cursor-3d';
import Highlight from './highlight';

import Stats from 'stats.js';
import { GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/**
 * Handles working with the browser
 * @memberOf client/ge
 */
class Engine {
  /**
   * @constructor
   */
  constructor(options) {
    this._ui = options.ui;
    this._canvas = options.canvas;

    this._isRunning = false;
    this._camera = null;
    this._renderer = null;
    this.scene = null;
    this._prevTime = window.performance.now();
    this._highlight = null;
    this.frameno = 0;
    //this.focused = true;

    // This handles when user cmd-tab away from fullscreen
    // window.onfocus = () => {
    //   this.focused = true;
    //   //debug.log('window.onfocus');
    //   this._fullscreenChange();
    // };
    // window.onblur = () => {
    //   this.focused = false;
    //   //debug.log('window.onblur');
    //   this._fullscreenChange();
    // };

    // if ('onpointerlockchange' in document) {
    //   document.addEventListener('pointerlockchange', () => {
    //     if (document.pointerLockElement) {
    //       this.controls.clear();
    //       this.controls.enabled = true;
    //       this._highlight.enabled = true;
    //     } else {
    //       this.controls.enabled = false;
    //       this._highlight.enabled = false;
    //     }
    //   });
    // }
    window.addEventListener('resize', this.doWindowResize.bind(this), false);
  }

  get ui() {
    return this._ui;
  }

  //--------------------------------------------------------------------------
  // Windowing, Fullscreen, Pointerlock
  //--------------------------------------------------------------------------

  // _fullscreenChange() {
  //   const element = document.fullscreenElement ||
  //                   document.webkitFullscreenElement ||
  //                   document.mozFullScreenElement ||
  //                   document.msFullscreenElement;
  //   this.onWindowResize();
  //   if (this.focused && element) {
  //     //document.body.className = 'focused';
  //     element.requestPointerLock();
  //     this.controls.enabled = true;
  //     this._highlight.enabled = true;
  //   } else {
  //     //document.body.className = 'blurred';
  //     this.controls.enabled = false;
  //     this._highlight.enabled = false;
  //   }
  // }

  setDomElement(id) {
    this._ui = document.getElementById(id);
    if (!this._ui) {
      throw new Error(`element "${id}" not found.`);
    }

    // window events...
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // When user clicks the UI, go into fullscreen mode
    //    this._ui.addEventListener('click', this.requestFullscreen.bind(this), false);

    // Polyfill for fullscreen api
    //document.addEventListener('fullscreenchange', this._fullscreenChange.bind(this));
    //_fullscreenPolyfill(this._ui, this._fullscreenChange.bind(this));
  }

  // requestFullscreen() {
  //   // this._ui.requestFullscreen();
  //   this._ui.requestPointerLock();
  //   this.controls.enabled = true;
  //   this._highlight.enabled = true;
  // }

  doWindowResize() {
    if (this._ui && this._renderer && this._camera) {
      this.setSize();
    }
  }

  //--------------------------------------------------------------------------
  // Graphics - Three.js
  //--------------------------------------------------------------------------

  setSize() {
    console.log(`${this._ui.offsetWidth}x${this._ui.offsetHeight}`);
    // TODO: Respect the fullscreen aspect ratio...
    //const width = this._ui.offsetWidth;
    //const height = this._ui.offsetHeight;
    // this._renderer.setSize(width, height, false);
    //this._camera.aspect = (width / height);
    //this._camera.updateProjectionMatrix();
  }

  initScene(
    options = {
      camera: {
        fov: 70,
        near: 1,
        far: 10000,
      },
    }
  ) {
    // const width = this._ui.offsetWidth;
    // const height = this._ui.offsetHeight;
    // const aspectRatio = width / height;
    const aspectRatio = this._canvas.offsetWidth / this._canvas.offsetHeight;

    //----------------------------------
    // Scene
    //----------------------------------

    // this is the main scene where the geometry lives
    this.scene = new Scene();
    this.scene.name = 'Scene';
    window.scene = this.scene; // Needed for Three.js inspector

    // This will render all elements on top of the underlying scene
    this.sceneui = new Scene();
    this.sceneui.name = 'Scene UI';

    //----------------------------------
    // Camera
    //----------------------------------
    this._camera = new PerspectiveCamera(options.camera.fov, aspectRatio, options.camera.near, options.camera.far);
    // Flashlight?
    // Flashlight?
    // const flashlight = new PointLight( 0xff6666, 1, 20 * 16);
    // flashlight.position.set(0, 0, -20);
    // this._camera.add(flashlight);

    //this.scene.add(new PointLightHelper(flashlight, 5));
    //
    //
    // var pointLight2 = new PointLight( 0xff6666, 1, 20 * 16);
    // this._camera.add( pointLight2 );
    // this.scene.add(new PointLightHelper(pointLight2, 5));

    //----------------------------------
    // 3d Cursor
    //----------------------------------
    // Cursor
    this.crosshair = new Cursor3d(this._camera);
    this.sceneui.add(this.crosshair);

    //----------------------------------
    // Renderer
    //----------------------------------
    this._renderer = new WebGLRenderer({ canvas: this._canvas });
    this._renderer.setClearColor(0x0f0f0f);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.autoClear = false;

    //TODO: Understand gamma, this means everything is pre-multiplied gamma
    this._renderer.gammaInput = false;
    this._renderer.gammaOutput = false;

    // FPS stats
    this.stats = new Stats();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    this._ui.appendChild(this.stats.dom);

    // Grid
    const size = 16 * 20; // 20LDU units x 16 studs
    const step = 32;
    this.gridHelper = new GridHelper(size, step);
    //this.scene.add(this.gridHelper);

    // FirstPerson Perspective
    //this.controls = new FirstPersonControl(this._camera);
    this.controls = new HeroControl(this);
    this.scene.add(this.controls);

    // This is used for selecting geometry...
    this._highlight = new Highlight(this._camera);
    this._highlight.enabled = false;
    this._highlight.name = '_highlight';
    this.scene.add(this._highlight);
  }

  drawScene() {
    this._renderer.clear();
    this._renderer.render(this.scene, this._camera);
    this._renderer.clearDepth();
    this._renderer.render(this.sceneui, this._camera);
  }

  update(frameno) {
    const time = window.performance.now();
    const delta = (time - this._prevTime) / 1000;

    this.controls.update(delta);
    this.crosshair.update(delta, frameno);
    this._highlight.update(delta, frameno);
    this._prevTime = time;
  }

  animate() {
    this.stats.begin();

    if (this._isRunning) {
      window.requestAnimationFrame(this.animate.bind(this));
    }

    this.update(this.frameno); // Update Objects
    this.frameno++;

    this.drawScene(); // Draw the objects

    this.stats.end();
  }

  start() {
    this.initScene();
    this._isRunning = true;
    this.animate();
  }

  stop() {
    this._isRunning = false;
  }

  get highlight() {
    return this._highlight;
  }
  get camera() {
    return this._camera;
  }

  execute() {}
}

export default Engine;
