import Stud from './stud';
import { applyToGeometry } from './brick-geometry';
import colors from './colors';
import Object3D from './object-3d';


class Brick extends Object3D {
  /**
   *
   * @param options.part
   * @param options.position
   * @param options.color
   * @param options.quaternion
   */
  constructor(options = {}) {
    super(options);
    this.color = options.color || '21';

    // Set the part
    this._chunk = null;
    this._part = null;
    this._studs = null;
    this._outline = null;
  }

  static createFromPart(part, options) {
    const brick = new Brick(options);
    brick._part = part;
    brick._studs = [];
    brick._part.forEachStud((partStud) => {
      const stud = Stud.createFromStudPart(partStud, { parent: brick });
      brick._studs.push(stud);
    });
    return brick;
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get brick() {
    return this;
  }

  get chunk() {
    return this._chunk;
  }
  set chunk(value) {
    this._chunk = value;
  }

  get color() {
    return this._color;
  }
  set color(value) {
    if (typeof value === 'object') {
      this._color = value;
    } else {
      this._color = Object.freeze(colors.getById(value));
    }
  }

  get outline() {
    return this._part.outline;
  }

  get selectable() {
    return this._part.selectable;
  }

  get part() {
    return this._part;
  }
  set part(value) {
    if (this._part) {
      throw new Error('part has already been set');
    }
    this._part = value;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  /**
   * Iterate over each stud
   * @param fn
   */
  forEachStud(fn) {
    this._studs.forEach(fn);
  }

  /**
   * Generate all the geometry, selction boxes, and outlines for this brick
   * @param level
   */
  createLod(level = 0) {
    // This brick shape
    const geometry = this.chunk.buffers.geometry.newFromGeometry(this.part.getGeometryByLod(level), this);
    applyToGeometry(geometry, this.position, this._color, this.orientation);
    // No need to apply transformation to this because it's already been done
    const selectables = this.chunk.buffers.selectables.newFromGeometry(this.part.selectable, this);
    applyToGeometry(selectables, this.position, null, this.orientation);

    // All the studs
    this.forEachStud((stud) => {
      stud.createLod(level);
    });
  }

  /**
   * Return
   * @returns {{id: *, part, color: String, position: (array)}}
   */
  toJSON() {
    const json = {
      id: this._id,
      part: this._part.id,
      color: this._color.id,
      position: this._position
    };
    // Only specifiy quaternion if we need to
    if (this._orientation) {
      json.orientation = this._orientation;
    }
    return json;
  }

}

export default Brick;

