import { assert } from 'chai';
import FaceList from '../../src/shared/face-list';

describe('shared/face-list', () => {
  describe('#push()', () => {
    const list = new FaceList();
    it('should push node to the end of an array', () => {
      list.push(0, 9, { id: 0 });
      list.push(10, 19, { id: 1 });
      assert.equal(list.length, 2);
    });
  });

  describe('#values(index)', () => {
    it('should return entry at index specified', () => {
      const list = new FaceList();
      list.push(0,9, { id: 0 });
      list.push(10,19, { id: 1 });
      list.push(20,29, { id: 2 });
      assert(list.nodes[1].value.id === 1);
    });
  });

  describe('#isValid()', () => {
    it('should return true if values are pushed in order', () => {
      const list = new FaceList();
      list.push(0,9, { id: 0 });
      list.push(10,19, { id: 1 });
      list.push(20,29, { id: 2 });
      assert(list.isValid());
    });

    it('should return false if values are pushed out of order', () => {
      const list = new FaceList();
      list.push(10,19, { id: 1 });
      list.push(0,9, { id: 0 });
      list.push(20,29, { id: 2 });
      assert(list.isValid());
    });
  });

  describe('#find()', () => {
    const list = new FaceList();
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

    it('should find left number', () => {
      const item = list.find(10);
      assert(item);
      assert.equal(item.value.id, 1);
    });
    it('should find right number', () => {
      const item = list.find(19);
      assert(item);
      assert.equal(item.value.id, 1);
    });
    it('should find middle number', () => {
      const item = list.find(15);
      assert(item);
      assert.equal(item.value.id, 1);
    });
    it('should return null if doesn\'t exist', () => {
      const item = list.find(-1000);
      assert(item === null);
    });
    it('should return null if doesn\'t exist', () => {
      const item = list.find(1000);
      assert(item === null);
    });
    it('should find all numbers accounted for in the array', () => {
      for (let i = 0; i < 100; i++) {
        const item = list.find(i);
        assert(item.left <= i && item.right >= i);
      }
    });
  });
});
