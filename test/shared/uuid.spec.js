import { assert } from 'chai';
import uuid from '../../src/shared/uuid';


describe('shared/uuid', () => {
  describe('#v4()', () => {
    it('should generate unique id', () => {
      assert.equal(uuid.v4().length, 36);
    });
    it('should generate a unique slug', () => {
      assert.equal(uuid.v4slug().length, 22);
    });
  });
});
