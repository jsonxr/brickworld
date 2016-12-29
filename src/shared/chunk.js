import { generateId } from './utils';
import parts from './parts';
import Brick from './brick';
import BufferGeometryHeap from './buffer-geometry-heap';


class Chunk {
  constructor() {
    this.id = generateId();
    this._bricks = new Map();
    this._geometry = null;
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

  //------------------------------------
  // Methods
  //------------------------------------
  forEachBrick(fn) {
    this._bricks.forEach(fn);
  }

  add(brick) {
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

  createGeometry(level) {
    if (this._geometry) {
      this._geometry.dispose();
    }

    // Get the vertex count of the bricks
    let vertexCount = 0;
    this.forEachBrick( (brick) => {
      vertexCount += brick.part.getGeometryByLod(level).vertexCount;
    });
    // Create the geometry
    this._geometry = new BufferGeometryHeap(vertexCount);
    this.forEachBrick( (brick) => {
      brick.createGeometry(this._geometry, level);
    });
  }

  createSelectable(highlight) {
    this.forEachBrick( (brick) => {
      brick.createSelectable(highlight);
    });
  }

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
    if (this._geometry) {
      this._geometry.dispose();
      this._geometry = null;
    }
  }

}

export default Chunk;
