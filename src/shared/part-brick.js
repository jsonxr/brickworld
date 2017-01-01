'use strict';

import PartTemplate from './part-template';

class PartBrick extends PartTemplate {
  constructor(options) {
    super(options);
    this._studs = null;
  }

  get studs() {
    return this._studs;
  }
  set studs(values) {
    if (this._studs) {
      throw new Error('studs have already been set.');
    }
    this._studs = values;
  }

  forEachStud(fn) {
    this._studs.forEach(fn);
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

export default PartBrick;
