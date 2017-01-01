import PartTemplate from './part-template';
import { applyToGeometry, OUTLINE_SCALE, GEOMETRY_STUD, GEOMETRY_STUD_BOX, GEOMETRY_STUD_SELECT_BOX } from './brick-geometry';



class PartStud extends PartTemplate {
  constructor(part, options = {}) {
    super(part, options);
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get part() {
    return this.parent;
  }

  //------------------------------------
  // Methods
  //------------------------------------
  //
  // createLod(level) {
  //   const geometry = this.chunk.buffers.geometry.newFromGeometry(GEOMETRY_STUD, this);
  //   //geometry.applyMatrix(this.matrix);
  //
  //   applyToGeometry(geometry, this.position, null, this.orientation); // ours
  //   //applyToGeometry(geometry, null, this._brick.color, null); // Parent's
  //   //applyToGeometry(geometry, this.parent.position, this.parent.color, this.parent.orientation); // Parent's
  //
  //   const selectables = this.chunk.buffers.selectables.newFromGeometry(GEOMETRY_STUD_SELECT_BOX, this);
  //   selectables.applyMatrix(this.matrix);
  //   //applyToGeometry(selectables, this._position, null, this._orientation); // ours
  //   //applyToGeometry(selectables, this._brick.position, null, this._brick.orientation); // Parent's
  // }

}

export default PartStud;
