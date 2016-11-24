import chai from 'chai';
import Brick from '../../src/shared/brick';

describe('es6 module smoke test', () => {
  it('should assert true', () => {
    const b = new Brick();
    chai.assert(true);
  });
});
