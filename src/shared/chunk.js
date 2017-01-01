import assert from './assert';
import { generateId } from './utils';
import parts from './parts';
import Brick from './brick';
import BufferGeometryHeap from './buffer-geometry-heap';


// Private
function computeBounds(chunk) {
  //TODO: Optimize? We only need to recompute the bounds if we place a brick outside our current bounds
  // Need to compute bounding spheres for ray picking and rendering to work
  assert( () => {
    assert.isDefined(chunk);
    assert.isDefined(chunk._buffers);
    assert.isDefined(chunk._buffers.geometry);
    assert.isDefined(chunk._buffers.studs);
    assert.isDefined(chunk._buffers.selectables);
  });
  chunk._buffers.geometry.computeBoundingSphere();
  chunk._buffers.studs.computeBoundingSphere();
  chunk._buffers.selectables.computeBoundingSphere();
}

class Chunk {
  constructor(options = {}) {
    this.id = generateId();
    this._level = 0;
    this._position = Object.freeze(options.position || [0,0,0]);
    this._bricks = new Map();
    this._buffers = null;
  }

  static createFromJSON(json) {
    assert( () => {
      assert.isDefined(json);
    });
    const chunk = new Chunk();
    chunk._position = json.position || [0,0,0];
    for (const brickJson of json.bricks) {
      const part = parts.getById(brickJson.part);
      const brick = Brick.createFromPart(part, brickJson);
      chunk.add(brick);
    }
    return chunk;
  }

  //------------------------------------
  // Properties
  //------------------------------------
  get bricks() {
    return this._bricks;
  }

  get buffers() {
    return this._buffers;
  }

  get position() {
    return this._position;
  }
  set position(value) {
    this._position = Object.freeze(value);
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
    if (this._buffers) {
      brick.createLod(0);
      computeBounds(this);
    }
  }

  createLod(level) {
    this.dispose();
    // Create the geometry
    this._buffers = {
      geometry: null,
      studs: null,
      selectables: null
    };
    this._buffers.geometry = new BufferGeometryHeap(2160, { uv: false });
    this._buffers.geometry.name = `${this.id}: geometry`;

    this._buffers.studs = new BufferGeometryHeap(5320, { uv: false });
    this._buffers.studs.name = `${this.id}: studs`;

    this._buffers.selectables = new BufferGeometryHeap(5320, { uv: false, color: false });
    this._buffers.selectables.name = `${this.id}: selectables`;

    this.forEachBrick( (brick) => {
      brick.createLod(level);
    });
    computeBounds(this);
  }

  remove(brick) {
    this._bricks.delete(brick.id);
    // Remove each stud
    brick.forEachStud((stud) => {
      this.buffers.geometry.remove(stud);
      this.buffers.selectables.remove(stud);
    });
    // Remove the brick
    this.buffers.geometry.remove(brick);
    this.buffers.selectables.remove(brick);
    // No need to compute bounds because it would only make it smaller
  }

  toJSON() {
    const bricksJson = [];
    this.forEachBrick((brick) => {
      if (brick !== null) {
        bricksJson.push(brick.toJSON());
      }
    });
    return {
      id: this.id,
      version: 1,
      position: this._position,
      bricks: bricksJson
    };
  }

  dispose() {
    if (this._buffers) {
      if (this._buffers.geometry) { this._buffers.geometry.dispose(); }
      if (this._buffers.selectables) { this._buffers.selectables.dispose(); }
      if (this._buffers.studs) { this._buffers.studs.dispose(); }
      this._buffers = null;
    }
  }

}

export default Chunk;
