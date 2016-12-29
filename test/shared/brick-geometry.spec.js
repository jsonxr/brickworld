import { assert } from 'chai';
import {
  BRICK_HEIGHT,
  BRICK_WIDTH,
  STUD_HEIGHT,
  STUD_RADIUS,

  getBrickGeometry,
  getStudGeometry,
  getStudGeometryArrayForBrick
} from '../../src/shared/brick-geometry';


describe('shared/brick-geometry', () => {

  describe('#getStudGeometry()', () => {
    it('should create stud geometry', () => {
      const geometry = getStudGeometry();
      assert(geometry);
      geometry.computeBoundingBox();
      assert.equal(geometry.boundingBox.min.x, -(STUD_RADIUS));
      assert.equal(geometry.boundingBox.min.y, 0);
      assert.equal(geometry.boundingBox.min.z, -(STUD_RADIUS));
      assert.equal(geometry.boundingBox.max.x, (STUD_RADIUS));
      assert.equal(geometry.boundingBox.max.y, STUD_HEIGHT);
      assert.equal(geometry.boundingBox.max.z, (STUD_RADIUS));
    });
  });

  describe('#getBrickGeometry(width, depth, height)', () => {
    it('should create brick geometry respecting given width,depth,height', () => {
      const geometry = getBrickGeometry(2, 2, 3);
      geometry.computeBoundingBox();
      // Since this is centered on the 1x1 cube, the 20LDU will be on either side of 0,0
      assert.equal(geometry.boundingBox.min.x, -(BRICK_WIDTH));
      assert.equal(geometry.boundingBox.min.y, 0);
      assert.equal(geometry.boundingBox.min.z, -(BRICK_WIDTH));
      assert.equal(geometry.boundingBox.max.x, (BRICK_WIDTH));
      assert.equal(geometry.boundingBox.max.y, BRICK_HEIGHT * 3);
      assert.equal(geometry.boundingBox.max.z, (BRICK_WIDTH));
    });
  });

  describe('#getStudsGeometryArrayForBrick(width, depth, height)', () => {
    it('should return the correct number of studs', () => {
      const width = 2;
      const depth = 2;
      const height = 1;
      const array = getStudGeometryArrayForBrick(width, depth, height);
      assert.equal(array.length, 4);
    });

    it('should return the studs in the correct x,y,z position', () => {
      const array = getStudGeometryArrayForBrick(2, 2, 1);
      const stud = array[0];
      stud.computeBoundingBox();
      assert.equal(stud.boundingBox.min.x, -16, 'min x wrong');
      assert.equal(stud.boundingBox.max.x, -4, 'max x wrong');
      assert.equal(stud.boundingBox.min.y, BRICK_HEIGHT, 'min y wrong');
      assert.equal(stud.boundingBox.max.y, BRICK_HEIGHT + STUD_HEIGHT, 'max y wrong');
      assert.equal(stud.boundingBox.min.z, -16, 'min z wrong');
      assert.equal(stud.boundingBox.max.z, -4, 'max z wrong');
    });

  });
});
