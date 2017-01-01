import { assert } from 'chai';
import Part from '../../src/shared/part';


describe('shared/part', () => {

  describe('#constructor(options)', () => {
    it('should create part', () => {
      const part = new Part({ id: '1', type: 'brick', name: 'Brick 1x1' });
      assert(part);
      assert.equal(part.id, '1');
      assert.equal(part.type, 'brick');
      assert.equal(part.name, 'Brick 1x1');
    });
  });

  describe('#pushGeometryLod(level)', () => {
    it('should push geometry', () => {
      const part = new Part({ id: '1', type: 'brick', name: 'Brick 1x1' });
      part.pushGeometryLod('zero');
      part.pushGeometryLod('one');
      assert.equal(part.getGeometryByLod(0), 'zero');
      assert.equal(part.getGeometryByLod(1), 'one');
      assert.equal(part.getGeometryByLod(2), 'one');

    });
  });

  describe('#getGeometryByLod(level)', () => {
    it('should get geometry based on the level of detail', () => {
      const part = new Part({ id: '1', type: 'brick', name: 'Brick 1x1' });
      part.pushGeometryLod('zero');
      part.pushGeometryLod('one');
      assert.equal(part.getGeometryByLod(0), 'zero');
      assert.equal(part.getGeometryByLod(1), 'one');
      assert.equal(part.getGeometryByLod(2), 'one');

    });
  });

});
