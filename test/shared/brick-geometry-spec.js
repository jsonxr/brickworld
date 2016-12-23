import { assert } from 'chai';
import * as brickGeometry from '../../src/shared/brick-geometry';


describe('shared/brick-geometry', () => {

  describe('#getBrickGeometry', () => {

    it('should create 2x4 brick geometry without parameters', () => {
      const geometry = brickGeometry.getBrickGeometry(); // standard 2x4 brick
      assert(geometry);
      geometry.computeBoundingBox();
      // Since this is centered on the 1x1 cube, the 20LDU will be on either side of 0,0
      assert.equal(geometry.boundingBox.min.x, -(brickGeometry.BRICK_WIDTH));
      assert.equal(geometry.boundingBox.min.y, 0);
      assert.equal(geometry.boundingBox.min.z, -(brickGeometry.BRICK_WIDTH * 2));
      assert.equal(geometry.boundingBox.max.x, (brickGeometry.BRICK_WIDTH));
      assert.equal(geometry.boundingBox.max.y, brickGeometry.BRICK_HEIGHT * 3);
      assert.equal(geometry.boundingBox.max.z, (brickGeometry.BRICK_WIDTH * 2));
    });

    it('should create brick given width,depth,height centered on the ground at x=0,z=0', () => {
      const geometry = brickGeometry.getBrickGeometry({ width: 1, depth: 1, height: 1 });
      geometry.computeBoundingBox();
      // Since this is centered on the 1x1 cube, the 20LDU will be on either side of 0,0
      assert.equal(geometry.boundingBox.min.x, -(brickGeometry.BRICK_WIDTH / 2));
      assert.equal(geometry.boundingBox.min.y, 0);
      assert.equal(geometry.boundingBox.min.z, -(brickGeometry.BRICK_WIDTH / 2));
      assert.equal(geometry.boundingBox.max.x, (brickGeometry.BRICK_WIDTH / 2));
      assert.equal(geometry.boundingBox.max.y, brickGeometry.BRICK_HEIGHT);
      assert.equal(geometry.boundingBox.max.z, (brickGeometry.BRICK_WIDTH / 2));
    });

    it('should create a brick with a specific position', () => {
      const geometry = brickGeometry.getBrickGeometry({ width: 1, depth: 1, height: 1, position: [1, 1, 1] });
      geometry.computeBoundingBox();
      assert.equal(geometry.boundingBox.min.x, -(brickGeometry.BRICK_WIDTH / 2) + 1);
      assert.equal(geometry.boundingBox.min.y, 1);
      assert.equal(geometry.boundingBox.min.z, -(brickGeometry.BRICK_WIDTH / 2) + 1);
      assert.equal(geometry.boundingBox.max.x, (brickGeometry.BRICK_WIDTH / 2) + 1);
      assert.equal(geometry.boundingBox.max.y, brickGeometry.BRICK_HEIGHT + 1);
      assert.equal(geometry.boundingBox.max.z, (brickGeometry.BRICK_WIDTH / 2) + 1);
    });

    it('should create a brick with a specific color', () => {
      const geometry = brickGeometry.getBrickGeometry({ color: '#ff00ff' });
      assert(geometry.attributes.color);
      assert(geometry.attributes.color.array);
      assert.equal(geometry.attributes.color.array.length, geometry.attributes.position.array.length,
                   'color and position should have the same length.');
      const colors = geometry.attributes.color.array;
      for (let i = 0; i < colors.length; i = i + 3) {
        assert.equal(colors[i], 1);
        assert.equal(colors[i + 1], 0);
        assert.equal(colors[i + 2], 1);
      }
    });

  });
});
