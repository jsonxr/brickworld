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

  get position() {
    return this._position;
  }

  //------------------------------------
  // Methods
  //------------------------------------
  forEachStud(fn) {
    this._studs.forEach(fn);
  }

  createSelectable(highlight) {
    // This
    const entry = highlight.addSelectable(this, this.geometry);
    entry.children = [];
    // Children
    this.forEachStud((stud) => {
      const studEntry = stud.createSelectable(highlight);
      applyToGeometry(studEntry.selectable, this._position, this._color, this._orientation);
      applyToGeometry(studEntry.outline, this._position, this._color, this._orientation);
      entry.children.push(studEntry);
    });
    return entry;

    //brickGeometry.translate(brick.position[0], brick.position[1], brick.position[2]); // Move it into place

    //const partGeometry = this._part.getGeometryByLod(2);
    //const brickGeometry = highlight.add(partGeometry, this);
    //applyToGeometry(brickGeometry, this.position, this.color, this.orientation);
    // Studs

  }

  createGeometry(heap, level = 0) {
    if (this._geometry) {
      this._geometry.dispose();
    }
    // This
    this._geometry = heap.newFromGeometry(this._part.getGeometryByLod(level));
    applyToGeometry(this._geometry, this._position, this._color, this._orientation);
    //this._outline = this._part.outline;

    // Children
    this.forEachStud((stud) => {
      const child = stud.createGeometry(heap, level);
      applyToGeometry(child, this._position, this._color, this._orientation);
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

