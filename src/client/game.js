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
    super.initScene();

    //----------------------------------
    // Lights
    //----------------------------------
    const light = new THREE.AmbientLight( 0x808080 ); // soft white light
    light.name = 'Ambient'
    this.scene.add( light );
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
    directionalLight.name = 'Sun';
    directionalLight.position.set( 0.2, 1, 0.2 );
    this.scene.add( directionalLight );

    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.name = 'Point';
    pointLight.position.set(10, 30, 130);
    this.scene.add(pointLight);

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

    var colors = ['#0055BF', '#257A3E', '#F2CD37', '#F2705E'];
    for (let i = 0; i < 4; i++) {
      var b2 = new Brick({ width: 2, depth: 4, height: 3, color: colors[i], position: [0,i * 24, 0]});
      chunk.add(b2);
    }

    var b = new Brick({ width: 8, depth: 2, height: 1, color: '#FC97AC', position: [0,24*4, 20]});
    chunk.add(b);

    let g = chunk.getBufferGeometry();
    const bricks = new THREE.Mesh(g, m);
    bricks.name = 'Bricks'
    this.scene.add(bricks);

    g = chunk.getStudGeometry();
    const studs = new THREE.Mesh(g, m);
    studs.name = 'Studs';
    this.scene.add(studs);

    this.selectable = bricks;
  }

}


const game = new MyGame();
setTimeout(() => { // Ensure we can fail in a source map friendly place (not index.html)
  game.setDomElement('ui');
  game.start();
}, 0);
