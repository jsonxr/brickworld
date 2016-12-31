import { EdgesGeometry } from 'three';
import { applyToGeometry, OUTLINE_SCALE, GEOMETRY_STUD, GEOMETRY_STUD_BOX, GEOMETRY_STUD_SELECT_BOX } from './brick-geometry';


class Stud {
  constructor(brick, options = {}) {
    this._brick = brick;
    this._position = options.position ? Object.freeze(options.position) : null;
    this._orientation = options.orientation ? Object.freeze(options.orientation) : null;
    this._geometry = null;
    this._selectables = null;
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
    return GEOMETRY_STUD_BOX;
  }

  get position() {
    return this._position;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  createLod(level) {
    if (this._geometry) { this._geometry.dispose(); }
    if (this._selectables) { this._selectables.dispose(); }
    if (this._outline) { this._outline.dispose(); }

    this._geometry = this.chunk.geometry.newFromGeometry(GEOMETRY_STUD, this);
    applyToGeometry(this._geometry, this._position, null, this._orientation); // ours
    applyToGeometry(this._geometry, this._brick.position, this._brick.color, this._brick.orientation); // Parent's

    this._selectables = this.chunk.selectable.newFromGeometry(GEOMETRY_STUD_SELECT_BOX, this);
    applyToGeometry(this._selectables, this._position, null, this._orientation); // ours
    applyToGeometry(this._selectables, this._brick.position, null, this._brick.orientation); // Parent's


    // const outline = this.chunk.outline.newBuffer(vertexCount, this);
    // outline.merge(GEOMETRY_STUD_BOX, 0);
    // outline.scale(OUTLINE_SCALE,OUTLINE_SCALE,OUTLINE_SCALE); // Scale the geometry first
    // applyToGeometry(outline, this._position, null, this._orientation); // ours
    // applyToGeometry(outline, this._brick.position, null, this._brick.orientation); // Parent's
    // outline.merge(this._brick.geometry, GEOMETRY_STUD_BOX.attributes.position.count);
    // this._outline = new EdgesGeometry(outline);

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
    if (this._selectables) { this._selectables.dispose(); this._selectables = null; }
    if (this._outline) { this._outline.dispose(); this._outline = null; }
  }

}

export default Stud;
