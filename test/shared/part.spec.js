import { assert } from 'chai';
import Part from '../../src/shared/part';


describe('shared/part', () => {

  describe('#constructor(id, type, name, width, depth, height)', () => {
    it('should create part', () => {
      const part = new Part('1', 'brick', 'Brick 1x1', 1, 2, 3);
      assert(part);
      assert.equal(part.id, '1');
      assert.equal(part.type, 'brick');
      assert.equal(part.name, 'Brick 1x1');
      assert.equal(part.width, 1);
      assert.equal(part.depth, 2);
      assert.equal(part.height, 3);
    });
  });

  describe('#createGeometry', () => {
    it('should create geometry for position', () => {
      const part = new Part('1', 'plate', 'Plate 1x1', 1, 1, 1);
      const geometry = part.createGeometry('#ffffff');
      assert(geometry, 'Could not get geometry');
      assert(geometry.attributes.position);
    });
    it('should create geometry with proper color', () => {
      const part = new Part('1', 'plate', 'Plate 1x1', 1, 1, 1);
      const geometry = part.createGeometry('#ff00ff');
      assert(geometry, 'Could not get geometry');
      assert.equal(geometry.attributes.color.count, geometry.attributes.position.count);
      assert.equal(geometry.attributes.color.itemSize, geometry.attributes.position.itemSize);
      const array = geometry.attributes.color.array;
      for (let i = 0; i < array.length; i+=3) {
        assert.equal(array[i], 1);
        assert.equal(array[i + 1], 0);
        assert.equal(array[i + 2], 1);
      }

    });
  });

});
