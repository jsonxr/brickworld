import {
  BufferGeometry,
  BufferAttribute,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
} from 'three';
import BufferGeometryHeap from '../../shared/buffer-geometry-heap';


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
class Highlight extends LineSegments {

  /**
   *
   * @param camera
   * @param options
   */
  constructor(camera, options = {
    distance: 200,
    color: 0xffffff,
    size: 144
  }) {
    const distance = options.distance || 200;
    const color = options.color || 0xffffff;
    const size = options.size || 144; // 72 verts for an edge box * 2 boxes max
    // Prepare for drawing the highlight
    const geometry = new BufferGeometry();
    // why 72?  Because EdgeGeometry has size 72 for a box
    geometry.addAttribute('position', new BufferAttribute(new Float32Array(size), 3)); // Need two boxes
    const material = new LineBasicMaterial({
      color: color,
      //transparent: true,
    });
    //const highlightEdges = new EdgesGeometry(_highlightBoxGeometry, 0.1);
    super(geometry, material);

    //this._highlightBoxGeometry = _highlightBoxGeometry;

    this.name = 'Highlight';
    // this._heap = new BufferGeometryHeap();
    // this._selectableMesh = new Mesh(this._heap, new MeshStandardMaterial({
    //   //wireframe:true
    // }));
    // this._selectableMesh.name = 'highlight';

    this._camera = camera;
    this._raycaster = new Raycaster();
    this._raycaster.near = 0;
    this._raycaster.far = distance;
    //this._ui = options.domElement;
    this.enabled = true;
    this._faceIndex = null;

    // Track where we are pointing...
    // This is 0,0 in fullscreen mode and never changes
    this._mouse = new Vector2(0, 0);
  }

  get enabled() {
    return super.enabled;
  }

  set enabled(value) {
    super.enabled = value;
    this._selectedNode = null;
    this._faceIndex = null;
  }

  set selectable(value) {
    this._selectable = value;
    this._selectableMesh = new Mesh(this._selectable, new MeshStandardMaterial());
    this._selectableMesh.name = 'highlight';
  }

  // addSelectable(obj, selectable, outline = null) {
  //   const entry = {};
  //   entry.obj = obj;
  //   entry.outline = new EdgesGeometry(outline || selectable);  // Create edges outline from selectable if outline not available
  //   entry.outline.scale(1.005, 1.005, 1.005);
  //   entry.selectable = this._heap.newFromGeometry(selectable, entry);
  //   return entry;
  // }

  // add(geometry, obj) {
  //   const entry = {
  //     obj: obj,
  //     outline: null,
  //     geometry: null
  //   };
  //   entry.geometry = this._heap.newFromGeometry(geometry, entry);
  //   return entry.geometry;
  // }

  // get selectable() {
  //   return this._geometry;
  // }

  get selected() {
    if (this._selectedNode && this._selectedNode.value) {
      return this._selectedNode.value.obj;
    } else {
      return null;
    }
  }

  /**
   * Get the faceIndex that was last intersected
   * @returns {null|*}
   */
  get faceIndex() {
    return this._faceIndex;
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

  getIntersection() {
    // Gather the intersections from the origin of the mouse (0,0) in the same
    // direction that the camera is looking
    this._raycaster.setFromCamera(this._mouse, this._camera);
    const intersects = this._raycaster.intersectObject(this._selectableMesh);
    if (intersects.length > 0) {
      // We had at least one intersection, grab the first one
      //this.visible = this.enabled && true;
      const intersect = intersects[0];
      if (intersect.faceIndex !== this._faceIndex) {
        // rollOverMesh.position.copy( this.intersect.point ).add( this.intersect.face.normal );
        this._faceIndex = intersect.faceIndex;
console.log(this._faceIndex);
        // const linePosition = this.lines.geometry.attributes.position;
        // this.onSelection(this.intersect, linePosition);

        // why do we have to update the matrix here?
        this._selectableMesh.updateMatrix();
        this.geometry.applyMatrix(this._selectableMesh.matrix);
      }
    } else {
      //this.visible = false;
      this.intersect = null;
      this._faceIndex = null;
    }
  }

  /**
   *
   * @param delta
   * @param frameno
   */
  update() {
    // We don't need to find the intersection if highlight is disabled
    if (!this.enabled) {
      return;
    }

    const faceIndex = this.getIntersection();

    // If this is the same face we've already seen, leave everything else the same
    if (faceIndex === this._faceIndex) return;
    this._faceIndex = this._faceIndex;
    // Hide if nothing is selected
    if (!this._faceIndex) {
      this._selectedNode = null;
      this.visible = false;
      return;
    }

    // Get the currently selected node. If it is the same node, return
    const node = this._selectable.getNodeByIndex(this._faceIndex);
    if (node === this._selectedNode) {
      return;
    }
    this._selectedNode = node;

    // If this node doesn't exist, hide and return
    if (!node) {
      this.visible = false;
      return;
    }
    console.log(node);
    // This is a new node that we need to highlight
    this.visible = true;
    // if (! node.value.outline) {
    //   node.value.outline = new EdgesGeometry(node.value.geometry);
    //   node.value.outline.scale(1.005, 1.005, 1.005);
    // }
    const outline = node.value.outline;
    console.log('outline: ', outline);
    this.geometry.attributes.position.array.set(outline.attributes.position.array);
    console.log(outline.attributes.position.array);
    this._selectedNode = node;
  }

  /**
   *
   * @param intersect
   * @param positions
   */
  onSelection(intersect, positions) {
    debug.log('onSelection!');
    const face = this.intersect.face;
    const meshPosition = this._selectableMesh.geometry.attributes.position;
    positions.copyAt(0, meshPosition, face.a);
    positions.copyAt(1, meshPosition, face.b);
    positions.copyAt(2, meshPosition, face.c);
    positions.copyAt(3, meshPosition, face.a);
  }
}

export default Highlight;
