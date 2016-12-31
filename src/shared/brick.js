import { EdgesGeometry } from 'three';
import Stud from './stud';
import { generateId } from './utils';
import { OUTLINE_SCALE, applyToGeometry } from './brick-geometry';
import colors from './colors';
import { Color, Matrix4 } from 'three';


const mat = new Matrix4();

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
    this._orientation = Object.freeze(options.orientation || null);
    this._mat = null;
    this.updateMatrix();
    this.color = options.color || '21';

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

  get geometry() {
    return this._geometry;
  }

  get id() {
    return this._id;
  }

  set orientation(value) {
    this._orientation = value;
    this.updateMatrix();
  }
  get orientation() {
    return this._orientation;
  }

  get matrix() {
    return this._mat;
  }

  get part() {
    return this._part;
  }

  set part(value) {
    this._part = value;

    this._studs = [];
    this._part.forEachStud((partStud) => {
      const stud = new Stud(this);
      partStud.copyTo(stud);
      this._studs.push(stud);
    });
  }

  get outline() {
    return this._part.outline;
  }

  set position(value) {
    this._position = value;
    this.updateMatrix();
  }
  get position() {
    return this._position;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  updateMatrix() {
    this._mat = new Matrix4();
    if (this.orientation) {
      this._mat = mat.makeRotationFromQuaternion({
        x:this.orientation[0],
        y:this.orientation[1],
        z:this.orientation[2],
        w:this.orientation[3]
      });
    }
    // Translate to the correct location
    this._mat.setPosition({x: this.position[0], y: this.position[1], z: this.position[2]});
    Object.freeze(this._mat);
  }

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
    this._geometry = this.chunk.buffers.geometry.newFromGeometry(this._part.getGeometryByLod(level), this);
    applyToGeometry(this._geometry, this._position, this._color, this._orientation);
    // No need to apply transformation to this because it's already been done
    this._selectables = this.chunk.buffers.selectables.newFromGeometry(this._geometry, this);

    // Get the outline from the part so we can scale it BEFORE we move to position
    // otherwise, x,y,z gets way off due to scale
    //const outline = this.chunk.outline.newFromGeometry(this._part.getGeometryByLod(level), this);
    //outline.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE); // Make outline just a bit bigger than brick
    //applyToGeometry(outline, this._position, null, this._orientation);
    //this._outline = new EdgesGeometry(outline);

    // All the studs
    this.forEachStud((stud) => {
//      stud.createLod(level);
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

  // Clean's up all the buffers
  dispose() {
    if (this._geometry) { this._geometry.dispose(); this._geometry = null; }
    if (this._selectables) { this._selectables.dispose(); this._selectables = null; }
    if (this._outline) { this._outline.dispose(); this._outline = null; }
  }

}

export default Brick;

