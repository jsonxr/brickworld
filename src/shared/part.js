// import { getStudGeometryArrayForBrick, getStudPositionsForBrick, getBrickGeometry } from './brick-geometry';
// import { BufferAttribute, Color } from 'three';
// import Studs from './studs';


class Part {
  constructor(options) {
    this._id = options.id;
    this._type = options.type;
    this._name = options.name;
    this._geometry = []; // Cache geometry for part
    this._studs = null;
    this._outline = null;
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

  get outline() {
    return this._outline;
  }
  set outline(value) {
    if (this._outline) {
      throw new Error('outline has already been set.');
    }
    this._outline = value;
  }

  get studs() {
    return this._studs;
  }
  set studs(values) {
    if (this._studs) {
      console.log(this);
      throw new Error('studs have already been set.');
    }
    this._studs = values;
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

  /**
   * Pushes a geometry to the part. Push in order of most detailed to least detailed
   * @param geometry
   */
  pushGeometryLod(geometry) {
    this._geometry.push(geometry);
  }

  forEachStud(fn) {
    this._studs.forEach(fn);
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

  toJSON() {
    const getArray = (name) => {
      const array = [];
      for (const value of this.geometry.attributes[name].array) {
        array.push(value);
      }
      return array;
    };

    const json = {
      id: this._id,
      name: this._name,
      type: this._type,
      positions: getArray('position'),
      normals: getArray('normal'),
      uvs: getArray('uv')
    };

    return json;
  }

}

export default Part;
