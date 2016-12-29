import { assert } from 'chai';
import materials from '../../src/shared/materials';


describe('shared/materials', () => {
  describe('#get(id)', () => {
    it('should return a material from an id', () => {
      assert(materials.get(materials.BRICK));
    });
    it('should throw an error when a non existent material is requested', () => {
      try {
        materials.get(-1);
        assert(false, 'Material did not throw an error with id of -1');
      } catch(err) {
        assert(true);
      }
    });
  });
});
