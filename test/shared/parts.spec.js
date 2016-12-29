import { assert } from 'chai';
import parts from '../../src/shared/parts';


describe('shared/parts', () => {
  it('should load lightweight part by id', () => {
    const part = parts['3002'];
    assert(part);
  });

  it('should throw an error if id doesn\'t exist', () => {
    try {
      parts['fake'];
    } catch(err) {
      assert(err);
    }
  });
});
