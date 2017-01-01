'use strict';

import PartBrick from './part-brick';
import PartStud from './part-stud';
import {
  OUTLINE_SCALE,
  GEOMETRY_STUD,
  GEOMETRY_STUD_BOX,
  getGeometryForBrickPart,
  getStudPositionsForBrickPart
} from './brick-geometry';


/**
 * Generated bricks
 */
class PartBrickBlock extends PartBrick {
  constructor(options) {
    super(options);
    // Brick details...
    this.pushGeometryLod(getGeometryForBrickPart(options.width, options.depth, options.height, 'none'));
    this.selectable = getGeometryForBrickPart(options.width, options.depth, options.height, 'none');
    this.outline = getGeometryForBrickPart(options.width, options.depth, options.height, 'none');
    this.outline.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE);

    // Studs...
    const studs = [];
    const positions = getStudPositionsForBrickPart(options.width, options.depth, options.height);
    positions.forEach( (position) => {
      const stud = new PartStud({ parent: this, position: position });
      stud.geometry = [GEOMETRY_STUD, GEOMETRY_STUD_BOX];
      stud.outline = GEOMETRY_STUD_BOX;
      stud.selectable = GEOMETRY_STUD_BOX;
      studs.push(stud);
    });
    this.studs = studs;
  }
}

export default PartBrickBlock;
