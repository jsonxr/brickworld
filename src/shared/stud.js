import { EdgesGeometry } from 'three';
import { applyToGeometry, GEOMETRY_STUD, GEOMETRY_STUD_BOX, GEOMETRY_STUD_SELECT_BOX } from './brick-geometry';


class Stud {
  constructor(brick, options = {}) {
    this._brick = brick;
    this._position = options.position ? Object.freeze(options.position) : null;
    this._orientation = options.orientation ? Object.freeze(options.orientation) : null;
    this._geometry = null;
    this._selectable = null;
    this._outline = null;
  }

  copyTo(dest) {
    dest._position = this._position;
    dest._orientation = this._orientation;
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get brick() {
    return this._brick;
  }

  get chunk() {
    return this._brick.chunk;
  }

  get geometry() {
    return this._geometry;
  }

  get orientation() {
    return this._orientation;
  }

  get outline() {
    return this._outline;
  }

  get position() {
    return this._position;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  createLod(level) {
    if (this._geometry) { this._geometry.dispose(); }
    if (this._selectable) { this._selectable.dispose(); }
    if (this._outline) { this._outline.dispose(); }

    this._geometry = this.chunk.geometry.newFromGeometry(GEOMETRY_STUD, this);
    applyToGeometry(this._geometry, this._position, null, this._orientation); // ours
    applyToGeometry(this._geometry, this._brick.position, this._brick.color, this._brick.orientation); // Parent's

    this._selectable = this.chunk.selectable.newFromGeometry(GEOMETRY_STUD_SELECT_BOX, this);
    applyToGeometry(this._selectable, this._position, null, this._orientation); // ours
    applyToGeometry(this._selectable, this._brick.position, null, this._brick.orientation); // Parent's

    const outline = this.chunk.outline.newFromGeometry(GEOMETRY_STUD_BOX, this);
    applyToGeometry(outline, this._position, null, this._orientation); // ours
    applyToGeometry(outline, this._brick.position, null, this._brick.orientation); // Parent's
    this._outline = new EdgesGeometry(outline);
  }
  //
  // createSelectable(highlight) {
  //   const entry = highlight.addSelectable(this, GEOMETRY_STUD_SELECT_BOX, GEOMETRY_STUD_BOX);
  //   applyToGeometry(entry.selectable, this._position, null, this._orientation);
  //   applyToGeometry(entry.outline, this._position, null, this._orientation);
  //   return entry;
  // }

  dispose() {
    if (this._geometry) { this._geometry.dispose(); this._geometry = null; }
    if (this._selectable) { this._selectable.dispose(); this._selectable = null; }
    if (this._outline) { this._outline.dispose(); this._outline = null; }
  }

}

export default Stud;
