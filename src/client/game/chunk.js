import FaceList from '../../shared/face-list';

const INITIAL_SIZE = 1024;

function growArray(geometry, name, size) {
  // Attribute doesn't exist, no need to grow
  if (! geometry.attributes[name]) {
    return;
  }
  const data = new Float32Array(size * 3);
  data.set(geometry.attributes[name].array); // Copy old data
  geometry.addAttribute(name, new THREE.BufferAttribute(data, 3));
}

class GeometryHeap {
  constructor(options = {}) {
    // Get options
    const size = options.size || INITIAL_SIZE;
    const color = options.color !== undefined ? options.color : true;
    const normal = options.normal !== undefined ? options.normal : true;

    this._offset = 0;
    this._geometry = new THREE.BufferGeometry();
    this._geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(size * 3), 3));
    if (color) {
      this._geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(size * 3), 3));
    }
    if (normal) {
      this._geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(size * 3), 3));
    }
  }

  grow(size) {
    // We need to make sure we always grow this thing, not shrink it...
    if (this._geometry.attributes.position.count > size) {
      throw new Error(`size (${size}) must be greater than it is now (${this._geometry.attributes.position.count}) silly.`);
    }
    growArray(this._geometry, 'position', size);
    growArray(this._geometry, 'color', size);
    growArray(this._geometry, 'normal', size);
  }

  add(geometry) {
    const count = geometry.attributes.position.count;
    const startFace = this._offset;
    const stopFace = this._offset + count - 1;

    // Do we have enough room in our geometry?
    if ( (this._offset + count) > this._geometry.attributes.position.count) {
      let newSize = (this._geometry.attributes.position.count * 2); // Double the size
      if (newSize < count + this._offset) {
        newSize = count + this._offset;
      }
      this.grow(newSize);
    }

    this._geometry.merge(geometry, this._offset);
    this._geometry.attributes.position.needsUpdate = true;
    this._geometry.attributes.color.needsUpdate = true;
    this._geometry.attributes.normal.needsUpdate = true;
    this._offset += count;

    return {
      start: startFace,
      stop: stopFace
    };
  }

  remove(start, stop) {
    const position = this._geometry.attributes.position;
    position.array.fill(0, start * 3, stop * 3);
    position.needsUpdate = true;
  }

  get geometry() {
    return this._geometry;
  }
}




const MAX_VERTICES = INITIAL_SIZE * 3;


function growGeometry(geo, size) {
  console.log(`growing geometry... ${size}`);

  // Positions
  const vertices = new Float32Array(size * 3);
  if (geo.attributes.position) {
    vertices.set(geo.attributes.position.array);
  }
  geo.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

  // Per Vertex Colors
  const colors = new Float32Array(size * 3); // 3 floats per vertex
  if (geo.attributes.color) {
    colors.set(geo.attributes.color.array);
  }
  geo.addAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Normals
  const normals = new Float32Array(size * 3);
  if (geo.attributes.normal) {
    normals.set(geo.attributes.normal.array);
  }
  geo.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

}

function mergeGeometry(bricks, fnName) {
  const chunk = new THREE.BufferGeometry();
  growGeometry(chunk, MAX_VERTICES);

  let offset = 0;
  // Now draw studs
  bricks.forEach((brick) => {
    // Studs
    const geometry = brick[fnName]();
    const count = geometry.attributes.position.count;

    // Do we have enough room in our geometry?
    if ( (offset + count) > chunk.attributes.position.count) {
      let newSize = (chunk.attributes.position.count * 2); // Double the size
      if (newSize < count + offset) {
        newSize = count+offset;
      }
      growGeometry(chunk, newSize);
    }

    chunk.merge(geometry, offset);
    offset += geometry.getAttribute('position').count;
  });
  return chunk;
}

/**
 * @memberOf client/game
 */
class Chunk {

  /**
   *
   */
  constructor(options = {}) {
    this.bricks = [];
    this.faceList = new FaceList();
    //
    this.offset = 0;
    this.geometryHeap = new GeometryHeap();
    this.studHeap = new GeometryHeap();
    this.selectionHeap = new GeometryHeap()
    this.geometry = new THREE.BufferGeometry();
    growGeometry(this.geometry, INITIAL_SIZE);
  }

  /**
   *
   * @param brick
   */
  add(brick) {
    this.bricks.push(brick);
    brick.links = {};
    brick.links.geometries = this.geometryHeap.add(brick.getBufferGeometry());
    brick.links.studs = this.studHeap.add(brick.getStudGeometry());
    brick.links.selections = this.selectionHeap.add(brick.getBufferGeometry());
    this.faceList.push(brick.links.selections.start, brick.links.selections.stop, brick);
    console.log(brick);
  }

  remove(brick) {
    this.geometryHeap.remove(brick.links.geometries.start, brick.links.geometries.stop);
    this.studHeap.remove(brick.links.studs.start, brick.links.studs.stop);
    this.selectionHeap.remove(brick.links.selections.start, brick.links.selections.stop);
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getBufferGeometry() {
    return this.geometryHeap.geometry;
    //return mergeGeometry(this.bricks, 'getBufferGeometry');
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getStudGeometry() {
    return this.studHeap.geometry;
    //return mergeGeometry(this.bricks, 'getStudGeometry');
  }

  get selectable() {
    return this.selectionHeap.geometry;
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getSelectable() {
    //
    // this.selectables = [];
    //
    // let offset = 0;
    // this.bricks.forEach((brick) => {
    //   // Add each brick...
    //   const brickGeometry = brick.getSelectable();
    //   // Save so we can highlight appropriately
    //   const vertexCount = brickGeometry.getAttribute('position').count;
    //   const startFace = offset;
    //   const stopFace = (offset + vertexCount) - 1;
    //
    //   // This is setting the brick to each face between start and stop
    //   // so we can find the geometry based on the index of this chunk.
    //
    //   // should use a more efficient storage system since
    //   // 0 = brick
    //   // 1 = brick
    //   // 2 = brick
    //   // ...
    //   // 35 = brick
    //   // Note, that the faceIndex is actually the vertex
    //
    //   //TODO: We should really use the same box for the same brick and translate to right place
    //   //      instead of creating an entire box for each brick
    //   for (let i = startFace; i <= stopFace; i++) {
    //     //TODO: Use face-list.js which handles left/right face selection?
    //     this.selectables[i] = brick;
    //   }
    //
    //   offset += vertexCount;
    // });
    // //return geometry;

    return this.selectionHeap.geometry;
  }

  /**
   * When given an index, returns the outline
   * @param index
   * @returns {*}
   */
  getHighlightFromFaceIndex(index) {
    const node = this.faceList.find(index);
    this.selectedBrick = node.value;

    if (this.selectedBrick) {
      this.faceIndex = index;
      return this.selectedBrick.outline;
    } else {
      this.faceIndex = null;
      return null;
    }
  }

}

export {
  Chunk as default,
};
