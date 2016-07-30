import Engine from './ge/engine';
import Mesh from './ge/mesh';
import Scene from './ge/scene';
import Brick from './brick';
import Chunk from './chunk';

class MyGame extends Engine {
  constructor(id) {
    super(id);
  }

  initScene() {
    if (this.frameno < 10) {
      console.log(`before super.initScene: ${this.profiler.mark()}`);
    }

    super.initScene();

    if (this.frameno < 10) {
      console.log(`after super.initScene: ${this.profiler.mark()}`);
    }
    //----------------------------------
    // Lights
    //----------------------------------
    const light = new THREE.AmbientLight( 0x808080 ); // soft white light
    light.name = 'Ambient'
    this.scene.add( light );
    console.log(`create light: ${this.profiler.mark()}`);
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
    directionalLight.name = 'Sun';
    directionalLight.position.set( 0.2, 1, 0.2 );
    this.scene.add( directionalLight );
    console.log(`create directional light: ${this.profiler.mark()}`);

    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.name = 'Point';
    pointLight.position.set(10, 30, 130);
    this.scene.add(pointLight);
    console.log(`create point light: ${this.profiler.mark()}`);

    //----------------------------------
    // Add Geometry
    //----------------------------------

    // Material to use for drawing bricks
    const m = new THREE.MeshStandardMaterial({
      // wireframe:true,
      vertexColors: THREE.VertexColors
    });

    this.controls.position.set(0, 88, 20 * 3); // Set starting position

    var chunk = new Chunk();
    var b = new Brick({ width: 32, depth: 32, height: 1, color: '#9BA19D', position: [0,-8,0]});
    chunk.add(b);

    var color, b2;
    var colors = ['#0055BF', '#257A3E', '#F2CD37', '#F2705E'];
    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 80; j++) {
        if (i < 4) {
          color = colors[i];
        } else {
          let colorIndex = Math.floor(Math.random() * 4);
          color = colors[colorIndex];        }
        b2 = new Brick({ width: 2, depth: 4, height: 3, color: color, position: [j*40,i * 24, 0]});
        chunk.add(b2);
      }
    }

    console.log(`create bricks: ${this.profiler.mark()}`);

    // var b = new Brick({ width: 8, depth: 2, height: 1, color: '#FC97AC', position: [0,24*4, 20]});
    // chunk.add(b);
    // console.log(`create brick: ${this.profiler.mark()}`);

    // Get the main geometry
    let g = chunk.getBufferGeometry();
    console.log(`create chunk geometry: ${this.profiler.mark()}`);
    const bricks = new THREE.Mesh(g, m);
    bricks.name = 'Bricks'
    this.scene.add(bricks);
    console.log(`add bricks to scene: ${this.profiler.mark()}`);

    g = chunk.getStudGeometry();
    console.log(`create studs: ${this.profiler.mark()}`);
    const studs = new THREE.Mesh(g, m);
    studs.name = 'Studs';
    this.scene.add(studs);
    console.log(`add studs to scene: ${this.profiler.mark()}`);

    if (this.frameno < 10) {
      console.log(`game.initScene: ${this.profiler.mark()}`);
    }

    let selectable = chunk.getSelectable();
    this.highlight.selectable = selectable;
    this.highlight.onSelection = (intersect, positions) => {
      let linestodraw = chunk.getHighlightFromFaceIndex(intersect.faceIndex);
      console.log(linestodraw.uuid);
      positions.array.set(linestodraw.attributes.position.array);
    }

  }

}


window.game = new MyGame();
setTimeout(() => { // Ensure we can fail in a source map friendly place (not index.html)
  window.game.setDomElement('ui');
  window.game.start();
}, 0);
