import { EdgesGeometry } from 'three';
import Stud from './stud';
import { generateId } from './utils';
import { applyToGeometry } from './brick-geometry';


class Brick {
  /**
   *
   * @param options.part
   * @param options.position
   * @param options.color
   * @param options.quaternion
   */
  constructor(options = {}) {
    this._id = generateId();
    this._geometry = null;
    this._position = Object.freeze(options.position || [0,0,0]);
    this._color = Object.freeze(options.color || '#C91A09');
    this._orientation = Object.freeze(options.orientation || null);
    // Set the part
    this._chunk = null;
    this._part = null;
    this._studs = null;
    this._outline = null;
  }

  static createFromPart(part, options) {
    const brick = new Brick(options);
    brick.part = part;
    return brick;
  }

  //------------------------------------
  // Properties
  //------------------------------------
  get chunk() {
    return this._chunk;
  }
  set chunk(value) {
    this._chunk = value;
  }

  get color() {
    return this._color;
  }

  get geometry() {
    return this._geometry;
  }

  get id() {
    return this._id;
  }

  get orientation() {
    return this._orientation;
  }

  get part() {
    return this._part;
  }

  set part(value) {

    this._part = value;

    this._studs = [];
    this._part.forEachStud((partStud) => {
      const stud = new Stud(this);
      console.log(stud);
      partStud.copyTo(stud);
      this._studs.push(stud);
    });
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
  forEachStud(fn) {
    this._studs.forEach(fn);
  }

  // createSelectable(highlight) {
  //   // This
  //   const entry = highlight.addSelectable(this, this.geometry);
  //   entry.children = [];
  //   // Children
  //   this.forEachStud((stud) => {
  //     const studEntry = stud.createSelectable(highlight);
  //     applyToGeometry(studEntry.selectable, this._position, this._color, this._orientation);
  //     applyToGeometry(studEntry.outline, this._position, this._color, this._orientation);
  //     entry.children.push(studEntry);
  //   });
  //   return entry;
  // }

  createLod(level = 0) {
    if (this._geometry) {
      this._geometry.dispose();
    }
    // This brick shape
    this._geometry = this.chunk.geometry.newFromGeometry(this._part.getGeometryByLod(level), this);
    applyToGeometry(this._geometry, this._position, this._color, this._orientation);
    this._selectable = this.chunk.selectable.newFromGeometry(this._geometry, this);
    //applyToGeometry(this._selectable, this._position, null, this._orientation);
    const outline = this.chunk.outline.newFromGeometry(this._geometry, this);
    //applyToGeometry(outline, this._position, null, this._orientation);
    this._outline = new EdgesGeometry(outline);

    //   entry.outline = new EdgesGeometry(outline || selectable);  // Create edges outline from selectable if outline not available
    //   entry.outline.scale(1.005, 1.005, 1.005);
    //   entry.selectable = this._heap.newFromGeometry(selectable, entry)

    // All the studs
    this.forEachStud((stud) => {
      stud.createLod(level);
    });
  }

  toJSON() {
    const json = {
      id: this._id,
      part: this._part.id,
      color: this._color,
      position: this._position
    };
    // Only specifiy quaternion if we need to
    if (this._orientation) {
      json.orientation = this._orientation;
    }
    return json;
  }

  dispose() {
    if (this._geometry) {
      this._geometry.dispose();
      this._geometry = null;
    }
  }

}

export default Brick;

