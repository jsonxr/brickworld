import Camera from './camera';
import Clock from './clock';
import log from './log';
import Scene from './scene';
import settings from './settings';
import WebGLRenderer from './webgl-renderer';

/**

 */
class Engine {

  constructor(id) {
    let me = this;
    me.id = id;
    me.running = false;
    me._scene = new Scene();
    me._camera = new Camera();
  }

  get camera() {
    return this._camera;
  }

  get scene() {
    return this._scene;
  }

  init() {
    console.log('Engine.init()');

    let me = this;
    me.canvas = document.getElementById(me.id);
    me._scene = new Scene();
    me.renderer = new WebGLRenderer({canvas: me.canvas});
    return new Promise(function(resolve, reject) {
      me.renderer.init().then(function () {
        resolve();
      })
    });
  }

  start() {
    console.log('Engine.start()');
    let me = this;
    me.init().then(function () {
      me.running = true;
      requestAnimationFrame(me.run.bind(me));
    });
  }

  run() {
    let me = this;
    console.log('Engine.run()');
    let clock = new Clock();
    function animate() {
      let delta = clock.getDelta();
      me.dotick(delta);
      if (me.running) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  dotick(delta) {
    if (this.ontick) {
      this.ontick(delta);
    }
  }




}

Engine.setLibraryPath = function setLibraryPath(path) {
  settings.LIBRARY_PATH = path;
};


export default Engine;
