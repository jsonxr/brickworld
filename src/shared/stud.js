import Object3D from './object-3d';
import { applyToGeometry, OUTLINE_SCALE, GEOMETRY_STUD, GEOMETRY_STUD_BOX, GEOMETRY_STUD_SELECT_BOX } from './brick-geometry';
import assert from './assert';

class Stud extends Object3D {
  constructor(options = {}) {
    super(options);
    this._part = null;
  }

  static createFromStudPart(studPart, options = {}) {
    assert( () => {
      assert.isOk(studPart);
      assert.isOk(options.parent);
      assert.isOk(studPart.position); // Must always have a position
      assert.isArray(studPart.position);
    });
    options.position = studPart.position;
    options.orientation = studPart.orientation;
    const stud = new Stud(options);
    stud._part = studPart;
    return stud;
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get part() {
    return this._part;
  }
  set part(value) {
    if (this._part) {
      throw new Error('part has already been set');
    }
    this._part = value;
  }

  get brick() {
    return this.parent;
  }

  get chunk() {
    return (this.parent)
      ? this.parent.chunk
      : null;
  }

  get color() {
    return (this.parent)
      ? this.parent.color
      : null;
  }

  get outline() {
    return this.part.outline;
  }

  //------------------------------------
  // Methods
  //------------------------------------

  createLod(level) {
    const geometry = this.chunk.buffers.geometry.newFromGeometry(this.part.getGeometryByLod(level), this);


    //const geometry = this.chunk.buffers.geometry.newFromGeometry(GEOMETRY_STUD, this);
    //geometry.applyMatrix(this.matrix);
    applyToGeometry(geometry, this.position, null, this.orientation); // ours
    //applyToGeometry(geometry, null, this._brick.color, null); // Parent's
    applyToGeometry(geometry, this.parent.position, this.parent.color, this.parent.orientation); // Parent's

    const selectables = this.chunk.buffers.selectables.newFromGeometry(GEOMETRY_STUD_SELECT_BOX, this);
    selectables.applyMatrix(this.matrix);
    //applyToGeometry(selectables, this._position, null, this._orientation); // ours
    //applyToGeometry(selectables, this._brick.position, null, this._brick.orientation); // Parent's
  }

}

export default Stud;
