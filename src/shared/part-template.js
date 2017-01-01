import assert from './assert';
import Object3D from './object-3d';


class PartTemplate extends Object3D {
  constructor(options) {
    super(options);
    this._type = options.type;
    this._name = options.name;
    this._outline = null;
    this._selectable = null;
    this._geometry = null;
  }

  get id() {
    return this._id;
  }
  set id(value) {
    if (this._id) {
      throw new Error('id has already been set.');
    }
    this._id = value;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    if (this._name) {
      throw new Error('name has already been set.');
    }
    this._name = value;
  }

  get type() {
    return this._type;
  }
  set type(value) {
    if (this._type) {
      throw new Error('type has already been set.');
    }
    this._type = value;
  }

  get outline() {
    return this._outline;
  }
  set outline(value) {
    if (this._outline) {
      throw new Error('outline has already been set.');
    }
    this._outline = value;
  }

  get selectable() {
    return this._selectable;
  }
  set selectable(value) {
    if (this._selectable) {
      throw new Error('selectable has already been set.');
    }
    this._selectable = value;
  }

  get geometry() {
    return this._geometry;
  }
  set geometry(value) {
    assert( () => {
      assert.isOk(value);
      assert.isArray(value);
    });
    if (this._geometry) {
      throw new Error('geometry has already been set')
    }
    this._geometry = value;
  }
  /**
   * Pushes a geometry to the part. Push in order of most detailed to least detailed
   * @param geometry
   */
  pushGeometryLod(geometry) {
    if (!this._geometry) {
      this._geometry = [];
    }
    this._geometry.push(geometry);
  }

  /**
   * Convention is level 0 is the most detailed polygon.
   * @param level
   * @returns {*}
   */
  getGeometryByLod(level) {
    // Return highlest level requested possible
    if (level >= this._geometry.length) {
      level = this._geometry.length - 1;
    }
    return this._geometry[level];
  }
}

export default PartTemplate;
