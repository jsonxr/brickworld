import { assert } from 'chai';
import Studs from '../../src/shared/studs';


describe('shared/studs', () => {

  describe('#constructor(options)', () => {
    it('should create part', () => {
      const studs = new Studs();
      assert(studs);
      assert(studs.orientation);
      assert(studs.positions);
    });
  });

});
