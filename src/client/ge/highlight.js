// var lineSegments = new THREE.LineSegments(
//   new THREE.EdgesGeometry( b2.getBufferGeometry(), 0.1),
//   new THREE.LineBasicMaterial({ color: '#ffffff' })
// );
// scene.add(lineSegments);
const debug = console;

/**
 *
 * @memberOf client/ge
 */
class Highlight extends THREE.LineSegments {

  /**
   *
   * @param camera
   * @param options
   */
  constructor(camera, options = {
    distance: 200,
    color: 0xffffff,
    lineWidth: 4,
    domElement: window,
  }) {
    // Prepare for drawing the highlight
    const geometry = new THREE.BufferGeometry();
    // why 72?
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(72), 3));
    const material = new THREE.LineBasicMaterial({
      color: options.color,
      linewidth: options.lineWidth,
      transparent: true,
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

    // Track where we are pointing...
    // This is 0,0 in fullscreen mode and never changes
    this._mouse = new THREE.Vector2(0, 0);
  }

  /**
   *
   * @returns {object}
   */
  get selectable() {
    return this._geometry;
  }

  /**
   *
   * @param {object} value
   */
  set selectable(value) {
    this._geometry = value;
    this._selectableMesh = new THREE.Mesh(value, new THREE.MeshStandardMaterial({
      //wireframe:true
    }));
  }

  /**
   * If you want to highlight when not in fullscreen mode, the mouse moves
   * so the mouse coordinates are not the center of the screen as they
   * are in fullscreen mode.
   * @param ui
   */
  attachMouseMoveListener(ui) {
    // this is not necessary because we only select in fullscreen mode
    document.addEventListener('mousemove', (event) => {
      let width;
      let height;
      if (ui) {
        width = ui.offsetWidth;
        height = ui.offsetHeight;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      //event.preventDefault();
      this._mouse.x = ((event.clientX / width) * 2) - 1;
      this._mouse.y = (-(event.clientY / height) * 2) + 1;
    }, false);
  }

  /**
   *
   * @param delta
   * @param frameno
   */
  update(delta, frameno) {
    // if we don't have a selectable mesh, then we don't do anything here
    if (!this._selectableMesh) {
      if (frameno < 10) {
        debug.log('!this._selectableMesh', this);
      }
      return;
    }

    // Gather the intersections from the origin of the mouse (0,0) in the same
    // direction that the camera is looking
    this._raycaster.setFromCamera(this._mouse, this._camera);
    const intersects = this._raycaster.intersectObject(this._selectableMesh);

    if (intersects.length > 0) {
      // We had at least one intersection, grab the first one
      //this.visible = this.enabled && true;
      this.intersect = intersects[0];
      if (this.intersect.faceIndex !== this._faceIndex) {
        // rollOverMesh.position.copy( this.intersect.point ).add( this.intersect.face.normal );
        this._faceIndex = this.intersect.faceIndex;

        const linePosition = this.lines.geometry.attributes.position;
        this.onSelection(this.intersect, linePosition);

        this._selectableMesh.updateMatrix();
        this.geometry.applyMatrix(this._selectableMesh.matrix);
      }
    } else {
      //this.visible = false;
      this.intersect = null;
    }
  }

  /**
   *
   * @param intersect
   * @param positions
   */
  onSelection(intersect, positions) {
    console.log('onSelection!')
    const face = this.intersect.face;
    const meshPosition = this._selectableMesh.geometry.attributes.position;
    positions.copyAt(0, meshPosition, face.a);
    positions.copyAt(1, meshPosition, face.b);
    positions.copyAt(2, meshPosition, face.c);
    positions.copyAt(3, meshPosition, face.a);
  }
}

export default Highlight;
