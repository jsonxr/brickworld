import Engine from './ge/engine';
// import Mesh from './ge/mesh';
// import Scene from './ge/scene';
import Brick from './game/brick';
import BrickPart from './game/brick-part';
import Chunk from './game/chunk';

class MyGame extends Engine {

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
    const light = new THREE.AmbientLight(0x808080); // soft white light
    light.name = 'Ambient';
    this.scene.add(light);
    console.log(`create light: ${this.profiler.mark()}`);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.name = 'Sun';
    directionalLight.position.set(0.2, 1, 0.2);
    this.scene.add(directionalLight);
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
      vertexColors: THREE.VertexColors,
    });

    this.controls.position.set(0, 88, 20 * 3); // Set starting position

    this.chunk = new Chunk();
    const b = new Brick({ width: 32, depth: 32, height: 0.5, color: '#9BA19D', position: [0, -4, 0] });
    this.chunk.add(b);

    let color;
    let b2;
    const colors = [
      '#C870A0', // LEGOID 221 - Bright Purple
      '#E4ADC8', // LEGOID 222 - Light Purple
      '#923978', // LEGOID 124 - Bright Reddish Violet
      '#C91A09', // LEGOID 21  - Bright Red
      '#720E0F', // LEGOID 154 - New Dark Red
      '#FE8A18', // LEGOID 106 - Bright Orange
      '#F8BB3D', // LEGOID 191 - Flame Yellowish Orange
      '#F2CD37', // LEGOID 24  - Bright Yellow
      '#FFF03A', // LEGOID 226 - Cool Yellow
      '#4B9F4A', // LEGOID 37  - Bright Green
      '#A0BCAC', // LEGOID 151 - Sand Green
      '#257A3E', // LEGOID 28  - Dark Green
      '#184632', // LEGOID 141 - Earth Green
      '#BBE90B', // LEGOID 119 - Bright Yellowish Green
      '#9B9A5A', // LEGOID 330 - Olive Green
      '#0055BF', // LEGOID 23  - Bright Blue
      '#5C9DD1', // LEGOID 102 - Medium Blue
      '#86C1E1', // LEGOID 212 - Light Royal Blue
      '#597184', // LEGOID 135 - Sand Blue
      '#0D325B', // LEGOID 140 - Earth Blue
      '#1498D7', // LEGOID 321 - Dark Azur
      '#3EC2DD', // LEGOID 322 - Medium Azur
      '#AC78BA', // LEGOID 324 - Medium Lavender
      '#E1D5ED', // LEGOID 325 - Lavender
      '#3F3691', // LEGOID 268 - Medium Lilac
      '#582A12', // LEGOID 192 - Reddish Brown,
      '#352100', // LEGOID 308 - Dark Brown
      '#05131D', // LEGOID  26 - Black
      '#FFFFFF', // LEGOID   1 - White
    ];
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 10; j++) {
        if (i >= 0 && i < colors.length) {
          color = colors[i];
        } else {
          const colorIndex = Math.floor(Math.random() * colors.length);
          color = colors[colorIndex];
        }
        b2 = new Brick({
          width: 1,
          depth: 1,
          height: 1,
          color,
          position: [(i * 20) - 310, 0, (j * 20) - 310] });
        this.chunk.add(b2);
      }
    }

    b2 = new Brick({
      width: 2,
      depth: 4,
      height: 1,
      color: '#F2705E',
      position: [0, 0, 120],
    });
    this.chunk.add(b2);

    b2 = new BrickPart({
      part: '3001',
      color: '#C91A09',
      position: [0, 0, 120],
    });
    this.chunk.add(b2);

    // Get the main geometry
    let g = this.chunk.getBufferGeometry();
    console.log(`create chunk geometry: ${this.profiler.mark()}`);
    const bricks = new THREE.Mesh(g, m);
    bricks.name = 'Bricks';
    this.scene.add(bricks);
    // let edges = new THREE.VertexNormalsHelper(bricks, 2, 0xffffff, 1 );
    // this.scene.add(edges);
    console.log(`add bricks to scene: ${this.profiler.mark()}`);

    g = this.chunk.getStudGeometry();
    console.log(`create studs: ${this.profiler.mark()}`);
    const studs = new THREE.Mesh(g, m);
    studs.name = 'Studs';
    this.scene.add(studs);
    // edges = new THREE.VertexNormalsHelper(studs, 2, 0xffffff, 1 );
    // this.scene.add(edges);
    console.log(`add studs to scene: ${this.profiler.mark()}`);

    if (this.frameno < 10) {
      console.log(`game.initScene: ${this.profiler.mark()}`);
    }

    this.highlight.selectable = this.chunk.getSelectable();
    // this.highlight.onSelection = (intersect, positions) => {
    //   const linestodraw = this.chunk.getHighlightFromFaceIndex(intersect.faceIndex);
    //   positions.array.set(linestodraw.attributes.position.array);
    // };
  }


  update(frameNo) {
    super.update(frameNo);
    const faceIndex = this.highlight.faceIndex;
    if (faceIndex) {
      const linestodraw = this.chunk.getHighlightFromFaceIndex(faceIndex);
      //TODO: get left/right node and compare to see if we need to update the
      // lines to highlight.
      if (linestodraw) {
        this.highlight.visible = true;
        //this.highlight.setPositionsArray(linestodraw.attributes.position.array);
        this.highlight.geometry.attributes.position.array.set(linestodraw.attributes.position.array);
      }
    } else {
      this.highlight.visible = false;
    }
  }
}

/**
 * Called when fullscreen mode changes
 * @param {object} event - the event passed in by fullscreen
 * @private
*/
function logFullscreenChange(event) {
  // The event object doesn't carry information about the fullscreen state of the browser,
  // but it is possible to retrieve it through the fullscreen API
  const element = document.fullscreenElement ||
                  document.webkitFullscreenElement ||
                  document.mozFullScreenElement ||
                  document.msFullscreenElement;
  // The target of the event is always the document,
  // but it is possible to retrieve the fullscreen element through the API
  console.log('fullscreenchange', event);
  console.log(element);
}
document.addEventListener('webkitfullscreenchange', logFullscreenChange);
document.addEventListener('msfullscreenchange', logFullscreenChange);
document.addEventListener('mozfullscreenchange', logFullscreenChange);

document.addEventListener('pointerlockchange', (event) => {
  // The target of the event is always the document,
  // but it is possible to retrieve the locked element through the API
  const pointerLockElement = document.pointerLockElement ||
                             document.webkitPointerLockElement ||
                             document.mozPointerLockElement ||
                             document.msPointerLockElement;
  console.log('pointerlockchange: ', event);
  console.log(`pointerLockElement: ${pointerLockElement}`);
});

window.game = new MyGame();
setTimeout(() => { // Ensure we can fail in a source map friendly place (not index.html)
  window.game.setDomElement('ui');
  window.game.start();
}, 0);
