import Engine from './ge/engine';
import Mesh from './ge/mesh';
import Scene from './ge/scene'

class MyGame extends Engine {
  constructor(id) {
    super(id);
  }

  method() {
    console.log('calling method...');
    console.log(location.hostname);
  }

  update2() {
    console.log('my game update');
  }
  
  requestFullscreen(id) {
    if (typeof document.fullscreenEnabled !== undefined) {
      let element = document.getElementById(id);
      element.requestFullscreen();
    }
  }
}

console.log('loading game now 3210...');
window.game = new MyGame();

