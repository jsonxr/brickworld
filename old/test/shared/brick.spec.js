import { assert } from 'chai';
import Brick from '../../src/shared/brick';
import { Color, Matrix4, Quaternion, Vector3 } from 'three';


describe('shared/brick', () => {
  describe('#constructor(options)', () => {
    it('should create a brick centered at 0,0', () => {
      const brick = new Brick();
      assert(brick);
      assert.equal(brick.position[0], 0);
      assert.equal(brick.position[1], 0);
      assert.equal(brick.position[2], 0);
    });
    it('should create a brick with no rotation', () => {
      const brick = new Brick();
      assert(brick);
      assert.equal(brick.orientation, null);
    });
    it('should create a unique id', () => {
      const ids = [];
      for (let i = 0; i < 100; i++) {
        const brick = new Brick();
        assert(ids.indexOf(brick.id) < 0);
        ids.push(brick.id);
      }
    });
    it('should support options passed to constructor', () => {
      const options = {
        color: '#00ff00',
        part: '3005',
        position: [20,24,20],
        orientation: [0,0,0,1]
      };
      const brick = new Brick(options);
      assert(brick.color);
      assert.equal(brick.color, options.color);
      assert(brick.position);
      assert.equal(brick.position, options.position);
      assert(brick.orientation);
      assert.equal(brick.orientation, options.orientation);
    });
  });

  describe('#get geometry()', () => {
    it('should retrieve geometry at proper position', () => {
      const brick = new Brick();
      assert(brick);
      assert(brick.geometry);
    });
    it('should retrieve geometry with proper color', () => {
      const color = new Color('#ff00ff');
      const brick = new Brick({ color: '#ff00ff' });
      assert(brick);
      assert(brick.geometry);

      const array = brick.geometry.attributes.color.array;
      for (let i = 0; i < array.length; i+=3) {
        if (array[i] !== color.r) throw new Error();
        if (array[i + 1] !== color.g) throw new Error();
        if (array[i + 2] !== color.b) throw new Error();
      }
    });
    it('should support a quaternion rotation', () => {
      const brick1 = new Brick({part: '3005'});
      // First, get a brick with no rotation and apply transform ourself to check
      const threeQ = new Quaternion();
      threeQ.setFromAxisAngle( new Vector3( 0, 1, 0 ), Math.PI / 2 );
      const mat4 = new Matrix4();
      mat4.makeRotationFromQuaternion(threeQ);
      const g1 = brick1.geometry; // This is regenerated every time, so need to save it to apply transform
      g1.applyMatrix(mat4);
      const p1 = g1.attributes.normal.array;

      // Now create a brick with the threeQ quaternion represented as an array
      const q = [threeQ.x, threeQ.y, threeQ.z, threeQ.w];
      const brick2 = new Brick({ part: '3005', orientation: q });
      const p2 = brick2.geometry.attributes.normal.array;

      // Compare every element and make sure they are close-ish
      for (let i = 0; i < brick1.geometry.attributes.normal.array.length; i++) {
        const equal = (Math.abs(p1[i] - p2[i]) < Number.EPSILON);
        assert.equal(equal, true, `Values at ${i} do not match: ${p1[i]} !== ${p2[i]}`);
      }
      assert.deepEqual(p1, p2);
    });
  });

  describe('#get studs()', () => {
    it('should retrieve studs array', () => {
      const brick = new Brick({part: '3003'});
      assert(brick);
      assert(brick.studs);
      assert.equal(brick.studs.length, 4);
    });
  });

  describe('#toJSON()', () => {
    it('should return some json', () => {
      const brick = new Brick({ part: '3005', position: [0,0,0], color: '#C91A09'});
      const json = brick.toJSON();
      assert.deepEqual(json, {
        id: brick.id,
        part: '3005',
        position: [0,0,0],
        color: '#C91A09'
      });
    });
  });
});
