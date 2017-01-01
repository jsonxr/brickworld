import assert from './assert';
import { generateId } from './utils';
import { Matrix4 } from 'three';


class Object3D {
  constructor(options = {}) {
    this._id = options.id || generateId();
    this._parent = options.parent || null;
    this._position = Object.freeze(options.position || [0,0,0]);
    this._orientation = Object.freeze(options.orientation || null);
    this._mat = createMatrix.apply(this);
  }

  get id() {
    return this._id;
  }

  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value;
    this._mat = createMatrix.apply(this);
  }

  get matrix() {
    return this._mat;
  }

  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
    this._mat = createMatrix.apply(this);
  }

  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this._mat = createMatrix.apply(this);
  }

}

// Private methods...
function createMatrix() {
  assert( () => {
    assert.isOk(this);
    assert.isDefined(this.position);
    assert.isArray(this.position);
    if (this.orientation) {
      assert.isArray(this.orientation);
    }
  });
  const mat = new Matrix4();
  if (this.orientation) {
    mat.makeRotationFromQuaternion({
      x:this.orientation[0],
      y:this.orientation[1],
      z:this.orientation[2],
      w:this.orientation[3]
    });
  }
  // Translate to the correct location
  mat.setPosition({x: this.position[0], y: this.position[1], z: this.position[2]});
  // Translate to the parent's location
  if (this.parent) {
    mat.premultiply(this.parent.matrix);
  }
  return Object.freeze(mat);
}

export default Object3D;
