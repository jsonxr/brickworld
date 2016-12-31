import { assert } from 'chai';
import { BoxBufferGeometry, BufferAttribute } from 'three';
import {
  GEOMETRY_STUD,
  GEOMETRY_STUD_BOX,
  GEOMETRY_STUD_SELECT_BOX,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  STUD_HEIGHT,
  STUD_RADIUS,
  STUD_RADIUS_SEGMENTS,

  applyToGeometry,
  fillArrayWithColor,
  getGeometryForBrickPart,
  getStudPositionsForBrickPart
} from '../../src/shared/brick-geometry';

/*
 applyToGeometry,
 fillArrayWithColor,
 getGeometryForBrickPart,
 getStudPositionsForBrickPart,
 */

describe('shared/brick-geometry', () => {

  describe('CONSTANTS', () => {
    it('should create constants for brick geometries', () => {
      assert(GEOMETRY_STUD.attributes.position);
      assert(GEOMETRY_STUD_BOX.attributes.position);
      assert(GEOMETRY_STUD_SELECT_BOX.attributes.position);
      assert(BRICK_HEIGHT);
      assert(BRICK_WIDTH);
      assert(STUD_HEIGHT);
      assert(STUD_RADIUS);
      assert(STUD_RADIUS_SEGMENTS);
    });
  });

  describe('#getGeometryForBrickPart(width, depth, height)', () => {
    it('should create brick geometry respecting given width,depth,height', () => {
      const geometry = getGeometryForBrickPart(2, 2, 3);
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

  describe('#getStudPositionsForBrickPart(width, depth, height)', () => {
    it('should return the correct number of studs', () => {
      const array = getStudPositionsForBrickPart(2, 3, 1);
      assert.equal(array.length, 6);
    });

    it('should return the studs in the correct x,y,z position', () => {
      const array = getStudPositionsForBrickPart(2, 2, 1);
      const stud = array[0];
      assert.equal(stud[0], -BRICK_WIDTH/2);
      assert.equal(stud[1], BRICK_HEIGHT); // On top of the brick
      assert.equal(stud[2], -BRICK_WIDTH/2);
    });

  });

  describe('#fillArrayWithColor', () => {
    it('should throw an error if the array is not a multiple of 3', () => {
      const array = new Float32Array(5);
      assert.throws(() => {
        fillArrayWithColor(array, '#ff00ff');
      });
    });
    it('should fill an array with a color', () => {
      const array = new Float32Array(6);
      fillArrayWithColor(array, '#ff00ff');
      assert.equal(array[0], 1);
      assert.equal(array[1], 0);
      assert.equal(array[2], 1);
      assert.equal(array[3], 1);
      assert.equal(array[4], 0);
      assert.equal(array[5], 1);
    });
  });

  describe('#applyToGeometry', () => {
    it('should apply position to geometry', () => {
      const geometry = new BoxBufferGeometry(2,2,2).toNonIndexed();
      const x = geometry.attributes.position.array[0];
      const y = geometry.attributes.position.array[1];
      const z = geometry.attributes.position.array[2];
      const position = [1, 1, 1];
      applyToGeometry(geometry, position, null, null);
      assert.equal(geometry.attributes.position.array[0], x + position[0]);
      assert.equal(geometry.attributes.position.array[0], y + position[1]);
      assert.equal(geometry.attributes.position.array[0], z + position[2]);
    });
    it('should apply color to geometry', () => {
      const geometry = new BoxBufferGeometry(2,2,2).toNonIndexed();
      geometry.addAttribute('color', new BufferAttribute(new Float32Array(geometry.attributes.position.count), 3));
      applyToGeometry(geometry, null, '#ffffff', null);
      geometry.attributes.color.array.forEach( (value) => {
        assert.equal(value, 1);
      });
    });
  });

});
