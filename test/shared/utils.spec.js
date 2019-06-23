import { assert } from 'chai';
import { setOptions, generateId } from '../../src/shared/utils';


describe('shared/utils', () => {
  describe('#generateId', () => {
    it('should generate unique ids', () => {
      const values = [];
      for (let i = 0; i < 100; i++) {
        const uuid = generateId();
        assert.isBelow(values.indexOf(uuid), 0, `${uuid} was already generated!`);
        values.push(uuid);
      }
    });
    it('should generate uuid in the format x-x', () => {
      const uuid = generateId();
      assert(uuid);
    });
  });

  describe('#setOptions(obj, options, ignore', () => {
    it('should set keys of object given options', () => {
      const obj = {
        one: '1',
        two: '1'
      };
      setOptions(obj, { two: '2' });
      assert.deepEqual(obj, { one: '1', two: '2' });
    });

    it('should ignore requested keys', () => {
      const obj = {
        one: '2',
        two: '1',
        three: '1'
      };
      setOptions(obj, { one: '1', two: '2', three: '3' }, ['two', 'three']);
      assert.deepEqual(obj, { one: '1', two: '1', three: '1' });
    });

    // Useful when you keep changing your mind between new Obj(1,2) and new Obj({ one: 1, two: 2});
    it('should throw an error if you pass in something not an object', () => {
      const obj = {};
      try {
        setOptions(obj, 'oops');
      } catch(err) {
        assert(err);
      }
    });
  });
});
