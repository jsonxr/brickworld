import { assert } from 'chai';
import parts from '../../src/shared/parts';


describe('shared/parts', () => {
  it('should load lightweight part by id', () => {
    const part = parts.getById('3005');
    assert(part);
  });

  it('should throw an error if id doesn\'t exist', () => {
    assert.throws( () => {
      parts.getById('fake');
    });
  });
});
