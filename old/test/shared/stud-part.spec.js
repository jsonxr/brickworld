import { assert } from 'chai';
import StudPart from '../../src/shared/stud-part';


describe('shared/stud-part', () => {

  describe('#constructor(options)', () => {
    it('should create part', () => {
      const studPart = new StudPart();
      assert(studPart);
    });
  });

});
