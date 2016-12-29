import { applyToGeometry, GEOMETRY_STUD, GEOMETRY_STUD_BOX, GEOMETRY_STUD_SELECT_BOX } from './brick-geometry';


class Stud {
  constructor(parent, options = {}) {
    this._parent = parent;
    this._position = options.position ? Object.freeze(options.position) : null;
    this._orientation = options.orientation ? Object.freeze(options.orientation) : null;
    this._geometry = null;
  }

  copyTo(dest) {
    dest._position = this._position;
    dest._orientation = this._orientation;
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get geometry() {
    return this._geometry;
  }

  get orientation() {
    return this._orientation;
  }

  get parent() {
    return this._parent;
  }

  get position() {
    return this._position;
  }

  get outline() {
    return this._outline;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  createGeometry(heap) {
    if (this._geometry) {
      this._geometry.dispose();
    }
    this._geometry = heap.newFromGeometry(GEOMETRY_STUD);
    applyToGeometry(this._geometry, this._position, null, this._orientation);
    return this._geometry;
  }

  createSelectable(highlight) {
    const entry = highlight.addSelectable(this, GEOMETRY_STUD_SELECT_BOX, GEOMETRY_STUD_BOX);
    applyToGeometry(entry.selectable, this._position, null, this._orientation);
    applyToGeometry(entry.outline, this._position, null, this._orientation);
    return entry;
  }

  dispose() {
    if (this._geometry) {
      this._geometry.dispose();
    }
  }
}

export default Stud;
