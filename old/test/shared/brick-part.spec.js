import { assert } from 'chai';
import BrickPart from '../../src/shared/brick-part';


describe('shared/brick-part', () => {
  describe('#constructor(options)', () => {
    it('should create part with geometry, outline, selectables', () => {
      const part = new BrickPart({
        id: '3005',
        type: 'brick',
        name: 'Brick 1x1',
        width: 1,
        depth: 1,
        height: 3
      });
      assert(part);
      assert(part.getGeometryByLod(0));
      assert(part.outline);
      assert(part.selectables);
    });
  });
});
