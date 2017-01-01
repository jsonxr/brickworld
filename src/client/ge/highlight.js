'use strict';

import {
  BufferGeometry,
  BufferAttribute,
  EdgesGeometry,
  Float32BufferAttribute,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
} from 'three';
import { OUTLINE_SCALE } from '../../shared/brick-geometry';
import { threeColors } from '../../shared/colors';
import Brick from '../../shared/brick';


// var lineSegments = new THREE.LineSegments(
//   new THREE.EdgesGeometry( b2.getBufferGeometry(), 0.1),
//   new THREE.LineBasicMaterial({ color: '#ffffff' })
// );
// scene.add(lineSegments);
const debug = console;

const EDGES_SIZE = 24 * 3 * 2; // 24 verts EdgeGeometry box, * 3 floats * 2 boxes
const OUTLINE_GEOMETRY_SIZE = 36 * 3 * 2; // 36 verts for box * 3 floats * 2 boxes

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
  constructor(camera, options = {}) {
    const distance = options.distance || 200;
    const size = options.size || EDGES_SIZE; // 24 verts EdgeGeometry box, 36 verts for a box

    // why 72?  Because EdgeGeometry has size 72 for a box
    // Prepare for drawing the highlight
    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new BufferAttribute(new Float32Array(size), 3)); // Need two boxes
    geometry.attributes.position.dynamic = true; // We will change this a lot so hint to GPU
    const material = new LineBasicMaterial({});

    super(geometry, material);

    this.name = 'Highlight';
    this.frustumCulled = false; // This must be false or else, it doesn't always paint outline at low angles
    this.enabled = true;

    this._selectables = null;
    this._camera = camera;
    this._raycaster = new Raycaster();
    this._raycaster.near = 0;
    this._raycaster.far = distance;
    // Used for Caching the highlight
    this._faceIndex = null; // Cache
    this._selectedNode = null; // Cache
    // Place to temporarily hold the geometry to create our edges
    this._outline = new BufferGeometry();
    this._outline.addAttribute('position', new Float32BufferAttribute(OUTLINE_GEOMETRY_SIZE,3));
    this._outline.addAttribute('normal', new Float32BufferAttribute(OUTLINE_GEOMETRY_SIZE,3));
    this._outline.addAttribute('color', new Float32BufferAttribute(OUTLINE_GEOMETRY_SIZE,3));
    this._stud = new BufferGeometry();
    this._stud.addAttribute('position', new Float32BufferAttribute(36 * 3,3));
    this._stud.addAttribute('normal', new Float32BufferAttribute(36 * 3,3));
    this._stud.addAttribute('color', new Float32BufferAttribute(36 * 3,3));
    // Track where we are pointing...
    // This is 0,0 in fullscreen mode and never changes
    this._mouse = new Vector2(0, 0);
  }

  get enabled() {
    return super.enabled;
  }

  set enabled(value) {
    super.enabled = value;
    if (!super.enabled) {
      this._selectedNode = null;
      this._faceIndex = null;
      this.visible = false;
    }
  }

  get selectables() {
    return this._selectables;
  }

  set selectables(value) {
    this._selectables = value;
    if (value) {
      // Need the selectable mesh in order
      this._selectableMesh = new Mesh(this._selectables, new MeshStandardMaterial({
        wireframe: true
      }));
      this._selectableMesh.name = 'highlight';
      // This must be false or else, it doesn't always paint outline at low angles
      this._selectableMesh.frustumCulled = false;
    } else {
      this._selectableMesh = null;
    }
  }

  get mesh() {
    return this._selectableMesh;
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
      return this._selectedNode.value;
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

    // Get the intersections...
    this._raycaster.setFromCamera(this._mouse, this._camera);
    const intersects = this._raycaster.intersectObject(this._selectableMesh);
    if (intersects.length === 0) {
      // no intersections, so just hide the outline
      this._selectedNode = null;
      this._faceIndex = null;
      this.visible = false;
      return;
    }

    const faceIndex = intersects[0].faceIndex;
    // If this is the same face we are already on, leave everything as is
    if (faceIndex === this._faceIndex) {
      return;
    }
    this._faceIndex = faceIndex;

    // Get the currently selected node. If it is the same node, return
    const node = this._selectables.getNodeByIndex(this._faceIndex);
    // If this node doesn't exist, hide and return
    if (!node) {
      throw Error('Could not find node, some kinda bug.');
    }

    if (node === this._selectedNode) {
      return;
    }
    this._selectedNode = node;

    // This is a new node that we need to highlight
    this.visible = true;
    // const outline = this.chunk.outline.newBuffer(vertexCount, this);
    // outline.merge(GEOMETRY_STUD_BOX, 0);
    // outline.scale(OUTLINE_SCALE,OUTLINE_SCALE,OUTLINE_SCALE); // Scale the geometry first
    // applyToGeometry(outline, this._position, null, this._orientation); // ours
    // applyToGeometry(outline, this._brick.position, null, this._brick.orientation); // Parent's
    // outline.merge(this._brick.geometry, GEOMETRY_STUD_BOX.attributes.position.count);
    //this._outline = new EdgesGeometry(node.value.outline);
    let stud = null;
    let brick = null;
    if (node.value instanceof Brick) {
      brick = node.value;
    } else {
      stud = node.value;
      brick = stud.brick;
    }


    this._outline.merge(brick.outline);
    this._outline.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE);
    this._outline.applyMatrix(brick.matrix);
    // this._brick.attributes.position.array.set(brick.outline.attributes.position.array);
    // this._brick.attributes.normal.array.set(brick.outline.attributes.normal.array);
    if (stud) {
      // this._stud.attributes.position.array.set(stud.outline.attributes.position.array);
      // this._stud.attributes.normal.array.set(stud.outline.attributes.normal.array);
      this._stud.merge(stud.outline);
      this._stud.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE);
      this._stud.applyMatrix(stud.matrix);
      this._outline.merge(this._stud, 36);
    } else {
      this._outline.attributes.position.array.fill(0, 36*3);
    }


    //
    // this._brick.attributes.position.array.set(brick.outline.attributes.position.array);
    // this._brick.attributes.normal.array.set(brick.outline.attributes.normal.array);
    // this._brick.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE);
    // this._brick.applyMatrix(brick.matrix);
    //
    // this._outline.merge(this._stud)

    const outline = new EdgesGeometry(this._outline);




    // Fill the end of the array with zeros if the outline is less than our buffer
    if (outline.attributes.position.array.length < this.geometry.attributes.position.array.length) {
      this.geometry.attributes.position.array.fill(0, outline.attributes.position.array.length);
    }
    this.geometry.attributes.position.array.set(outline.attributes.position.array);
    this.geometry.attributes.position.needsUpdate = true;
    this.material.color = threeColors[node.value.color.edge];
  }

}

export default Highlight;
