import { assert } from 'chai';
import Chunk from '../../src/shared/chunk';
import Brick from '../../src/shared/brick';

describe('shared/chunk', () => {
  describe('#constructor(options)', () => {
    it('should create a chunk', () => {
      const chunk = new Chunk();
      assert(chunk);
    });
  });

  describe('#add(brick)', () => {
    it('should increment brick count when adding', () => {
      const chunk = new Chunk();
      assert(chunk);
      assert.equal(Object.keys(chunk.bricks).length, 0);
      const brick = new Brick();
      brick.geometry; // Force the creation of the geometry
      brick.studs; // Force the creation of the studs
      brick.selectables; // Force the creation of the selectables
      chunk.add(brick);
      assert.equal(Object.keys(chunk.bricks).length, 1);
    });
  });

  describe('#get brickMesh()', () => {
    it('should have a brick mesh', () => {
      const chunk = new Chunk();
      assert(chunk.brickMesh);
    });
  });

  describe('#get studMesh()', () => {
    it('should have a stud mesh', () => {
      const chunk = new Chunk();
      assert(chunk.studMesh);
    });
  });

  describe('#toJSON()', () => {
    it('should return proper json', () => {
      const chunk = new Chunk();
      chunk.add(new Brick({ part: '3001', position: [1,1,1], color: '#C91A09' }));
      chunk.add(new Brick({ part: '3002', position: [2,2,2], color: '#C91A09' }));
      const json = chunk.toJSON();
      // Don't check that these json values are equal
      assert.deepEqual(json, {
        id: chunk.id,
        version: 1,
        bricks: [{
          id: chunk.bricks[0].id,
          part: '3001',
          position: [1,1,1],
          color: '#C91A09'
        }, {
          id: chunk.bricks[1].id,
          part: '3002',
          position: [2,2,2],
          color: '#C91A09'
        }]
      });
    });
  });
});
