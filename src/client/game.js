import Engine from './ge/engine';
import Mesh from './ge/mesh';
import Scene from './ge/scene';
import Brick from './brick';

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
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.name = 'Sun';
    directionalLight.position.set( 0, 1, 0 );
    this.scene.add( directionalLight );
    
    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.name = 'Point';
    pointLight.position.set(10, 30, 130);
    this.scene.add(pointLight);

    //----------------------------------
    // Add Geometry
    //----------------------------------
    var b = new Brick();
    const g = b.getBufferGeometry();
    g.translate(0.5, 0.5, -0.5);
    const m = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
      side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });
    const mymesh = new THREE.Mesh(g, m);
    mymesh.name = 'Block'
    this.scene.add(mymesh);
    console.log('what went wrong...');





    // var chunk = new THREE.BufferGeometry();
    // console.log('chunk: ', chunk.id);
    // var chunkVerts = new Float32Array(36);
    // chunk.addAttribute( 'position', new THREE.BufferAttribute( chunkVerts, 3 ) );
    //
    // var len = brick.attributes.position.count;
    // var newIndex = chunk.merge(brick, 0);
    // var offset = 0 + len;
    // console.log('new offset: ', offset);
    // var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    // var mesh = new THREE.Mesh( chunk, material );
    //    this.scene.add(mesh);



  }

}


const game = new MyGame();
game.setDomElement('ui');
game.start();
