import Engine from './ge/engine';
import Mesh from './ge/mesh';
import Scene from './ge/scene'

export default class MyGame extends Engine {
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
}


console.log('loading game now 3210...');
let game = new MyGame();
let mesh = new Mesh();
let scene = new Scene();

scene.add(mesh);
game.start();
