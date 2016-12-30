import { generateId } from './utils';
import parts from './parts';
import Brick from './brick';
import BufferGeometryHeap from './buffer-geometry-heap';


class Selectables {
  constructor() {
    this._highlights = null;
    this._selectables = null;
  }
  add(obj, selectable, outline) {

  }
  dispose() {
    if (this._highlights) { this._highlights.dispose(); }
    if (this._selectables) { this._selectables.dispose(); }
  }
}

class Chunk {
  constructor() {
    this.id = generateId();
    this._bricks = new Map();
    this._geometry = null;
    this._selectable = null;
    this._outline = null;
  }

  //------------------------------------
  // Properties
  //------------------------------------
  get bricks() {
    return this._bricks;
  }

  get geometry() {
    return this._geometry;
  }

  get outline() {
    return this._outline;
  }

  get selectable() {
    return this._selectable;
  }

  //------------------------------------
  // Methods
  //------------------------------------
  forEachBrick(fn) {
    this._bricks.forEach(fn);
  }

  add(brick) {
    brick.chunk = this;
    this._bricks.set(brick.id, brick);
    // if (this._geometry) {
    //
    // }

    // this._bricks.push(brick);
    // // First, set the vertex count for all LODs
    // for (let i = 0; i < brick.part.lods.length; i++) {
    //   if (!this._lods[i]) {
    //     this._lods[i] = { count: 0 };
    //   }
    //   this._lods.count += brick.part._lods[i].attributes.position.count;
    // }
  }

  createLod(level) {
    if (this._geometry) { this._geometry.dispose(); }
    if (this._selectable) { this._selectable.dispose(); }
    if (this._outline) { this._outline.dispose(); }

    // Get the vertex count of the bricks
    let vertexCount = 0;
    this.forEachBrick( (brick) => {
      vertexCount += brick.part.getGeometryByLod(level).vertexCount;
    });
    // Create the geometry
    this._geometry = new BufferGeometryHeap(vertexCount);
    this._geometry.removeAttribute('uv');
    this._selectable = new BufferGeometryHeap(vertexCount);
    this._selectable.removeAttribute('uv');
    this._selectable.removeAttribute('color');
    this._outline = new BufferGeometryHeap(vertexCount);
    this._outline.removeAttribute('uv');
    this._outline.removeAttribute('color');
    this.forEachBrick( (brick) => {
      brick.createLod(level);
    });
  }
  //
  // createSelectable(highlight) {
  //   this.forEachBrick( (brick) => {
  //     brick.createSelectable(highlight);
  //   });
  // }

  remove(brick) {
    this._bricks.delete(brick.id);
    // if (this._geometry) {
    //
    // }

    // this._bricks[brick.index] = null;
    // this._bricks[brick.index] = null;
    // // Remove the vertex count of all LODs
    // for (let i = 0; i < brick.part.lods.length; i++) {
    //   if (!this._lods[i]) {
    //     this._lods[i] = { count: 0 };
    //   }
    //   this._lods.count -= brick.part._lods[i].attributes.position.count;
    // }
  }

  toJSON() {
    const bricksJson = [];
    for (const brick of this._bricks) {
      if (brick !== null) {
        bricksJson.push(brick.toJSON());
      }
    }
    return {
      id: this.id,
      version: 1,
      bricks: bricksJson
    };
  }

  fromJSON(json) {
    for (const brickJson of json.bricks) {
      const part = parts.getById(brickJson.part);
      const brick = Brick.createFromPart(part, brickJson);
      console.log('brick', brick);
      this.add(brick);
    }
  }

  dispose() {
    if (this._geometry) { this._geometry.dispose(); this._geometry = null; }
    if (this._selectable) { this._selectable.dispose(); this._selectable = null; }
    if (this._outline) { this._outline.dispose(); this._outline = null; }
  }

}

export default Chunk;
