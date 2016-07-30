// var lineSegments = new THREE.LineSegments(
//   new THREE.EdgesGeometry( b2.getBufferGeometry(), 0.1),
//   new THREE.LineBasicMaterial({ color: '#ffffff' })
// );
// scene.add(lineSegments);
let debug = console;

class Highlight extends THREE.LineSegments {
  constructor(camera, options = {}) {
    // Defaults
    options.distance = (options.distance !== undefined) ? options.distance : 200; // 10 bricks
    options.color = (options.color !== undefined) ? options.color : 0xffffff;
    options.lineWidth = (options.lineWidth !== undefined) ? options.lineWidth : 4;
    options.domElement = options.domElement || window;

    // var egh = new THREE.EdgesHelper( mesh, 0x00ffff );
    // egh.material.linewidth = 2;
    // scene.add( egh );

    // Prepare for drawing the highlight
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(72), 3));
    const material = new THREE.LineBasicMaterial({
      color: options.color,
      linewidth: options.lineWidth,
      transparent: true
    });

    super(geometry, material);
    this.lines = this;

    this._camera = camera;
    this._raycaster = new THREE.Raycaster();
    this._raycaster.near = 0;
    this._raycaster.far = options.distance; // 8 blocks distance
    this._ui = options.domElement;
    this.enabled = true;
    this.intersect = null;
    this._selectableMesh = null;
    this._faceIndex = null;

    this._material = new THREE.MeshStandardMaterial({
      //wireframe:true
    });

    // Track where we are pointing...
    this._mouse = new THREE.Vector2(0, 0);
  }


  get selectable() {
    return this._geometry;
  }

  set selectable(value) {
    this._geometry = value;
    this._selectableMesh = new THREE.Mesh(value, this._material);
  }

  attachMouseMoveListener(ui) {
    // // this is not necessary because we only select in fullscreen mode
    document.addEventListener('mousemove', event => {
      let width, height;
      if (ui) {
        width = ui.offsetWidth;
        height = ui.offsetHeight;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      //event.preventDefault();
      this._mouse.x = (event.clientX / width) * 2 - 1;
      this._mouse.y = -(event.clientY / height) * 2 + 1;
    }, false);
  }

  update(delta, frameno) {
    if (!this._selectableMesh) {
      if (frameno < 10) {
        debug.log('!this._selectableMesh', this);
      }
      debug.log('nothing...');
      return;
    }

    this._raycaster.setFromCamera(this._mouse, this._camera);
    let intersects = this._raycaster.intersectObject(this._selectableMesh);

    if (intersects.length > 0) {
      this.visible = this.enabled && true;
      this.intersect = intersects[0];
      if (this.intersect.faceIndex !== this._faceIndex) {
        debug.log(this.intersect);
        // rollOverMesh.position.copy( this.intersect.point ).add( this.intersect.face.normal );
        this._faceIndex = this.intersect.faceIndex;
        console.log(this._faceIndex);

        var linePosition = this.lines.geometry.attributes.position;
        this.onSelection(this.intersect, linePosition);

        this._selectableMesh.updateMatrix();
        this.geometry.applyMatrix(this._selectableMesh.matrix);
      }
    } else {
      this.visible = false;
      this.intersect = null;
    }
  }

  onSelection(intersect, positions) {
    const face = this.intersect.face;
    const meshPosition = this._selectableMesh.geometry.attributes.position;
    positions.copyAt(0, meshPosition, face.a);
    positions.copyAt(1, meshPosition, face.b);
    positions.copyAt(2, meshPosition, face.c);
    positions.copyAt(3, meshPosition, face.a);
  }
}

export default Highlight;
