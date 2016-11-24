import assert from 'assert';
import FaceList from '../../src/shared/face-list';

describe('shared/face-list', () => {
  const list = new FaceList();

  describe('#add()', () => {
    it('should add to the end of an array', () => {
      list.push(0, 9, { id: 0 });
      list.push(10, 19, { id: 1 });
      list.push(20, 29, { id: 2 });
      list.push(30, 39, { id: 3 });
      list.push(40, 49, { id: 4 });
      list.push(50, 59, { id: 5 });
      list.push(60, 69, { id: 6 });
      list.push(70, 79, { id: 7 });
      list.push(80, 89, { id: 8 });
      list.push(90, 99, { id: 9 });
      assert.equal(list.length, 10);
    });
  });

  describe('#find()', () => {
    it('should find left number', () => {
      const item = list.find(10);
      assert(item);
      assert.equal(item.data.id, 1);
    });
    it('should find right number', () => {
      const item = list.find(19);
      assert(item);
      assert.equal(item.data.id, 1);
    });
    it('should find middle number', () => {
      const item = list.find(15);
      assert(item);
      assert.equal(item.data.id, 1);
    });
    it('should return null if doesn\'t exist', () => {
      const item = list.find(100);
      assert(item === null);
    });
  });
});
