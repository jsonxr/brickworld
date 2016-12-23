import { assert } from 'chai';
import Chunk from '../../src/shared/chunk';

describe('shared/chunk', () => {

  describe('#constructor', () => {

    it('should instantiate without parameters', () => {
      const chunk = new Chunk();
      assert(chunk);
    });

  });

});
