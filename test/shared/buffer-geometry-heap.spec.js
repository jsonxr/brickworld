import { assert } from 'chai';
import BufferGeometryHeap from '../../src/shared/buffer-geometry-heap';


describe('shared/buffer-geometry-heap', () => {
  describe('#constructor()', () => {
    it('should generate a new buffer geometry', () => {
      const heap = new BufferGeometryHeap(1);
      assert(heap);
      assert(heap.attributes);
      assert(heap.attributes.position);
      assert(heap.attributes.color);
      assert(heap.attributes.normal);
      assert(heap.attributes.uv);
      assert.equal(heap.attributes.position.count, 1);
      for (const value of heap.attributes.position.array) {
        assert(value === 0);
      }
    });
    it('should create a buffer with only position', () => {
      const heap = new BufferGeometryHeap(1, { color: false, normal: false, uv: false });
      assert(heap);
      assert(heap.attributes);
      assert(heap.attributes.position);
      assert(!heap.attributes.color, 'color should not be an attribute');
      assert(!heap.attributes.normal, 'normal should not be an attribute');
      assert(!heap.attributes.uv, 'uv should not be an attribute');
    });
  });
  describe('#newBufferGeometry(count, obj)', () => {
    it('should return a buffer into the heap', () => {
      const heap = new BufferGeometryHeap(2);
      assert(heap);
      assert.equal(heap.attributes.position.count, 2);
      const g1 = heap.newBuffer(1);
      assert.equal(g1.attributes.position.count, 1);
      const g2 = heap.newBuffer(1);
      assert.equal(g2.attributes.position.count, 1);
    });
    it('should respect the buffer windows', () => {
      const heap = new BufferGeometryHeap(2);
      // Prove they are all zero to start
      for (const value of heap.attributes.position.array) {
        assert.equal(value, 0);
      }
      // Fill first buffer with all 1
      const g1 = heap.newBuffer(1);
      g1.attributes.position.array.fill(1);
      // Fill second buffer with all 2
      const g2 = heap.newBuffer(1);
      g2.attributes.position.array.fill(2);
      // Make sure our buffers are respected
      const a = heap.attributes.position.array;
      assert.equal(a[0], 1);
      assert.equal(a[1], 1);
      assert.equal(a[2], 1);
      assert.equal(a[3], 2);
      assert.equal(a[4], 2);
      assert.equal(a[5], 2);
    });
  });
  describe('#newBufferFromGeometry', () => {
    it('should return buffer initialized with geometry', () => {
      const heap = new BufferGeometryHeap(2, { color: false, normal: false, uv: false });
      // Get first buffer from geometry filled with 1
      const src1 = new BufferGeometryHeap(1, { color: false, normal: false, uv: false });
      src1.attributes.position.array.fill(1);
      const g1 = heap.newFromGeometry(src1);
      // Get second buffer from geometry filled with 2
      const src2 = new BufferGeometryHeap(1, { color: false, normal: false, uv: false });
      src2.attributes.position.array.fill(2);
      const g2 = heap.newFromGeometry(src2);
      // Now verify buffers are respected
      assert.equal(g1.attributes.position.array.length, 3);
      assert.equal(g2.attributes.position.array.length, 3);
      const a = heap.attributes.position.array;
      assert.equal(a[0], 1);
      assert.equal(a[1], 1);
      assert.equal(a[2], 1);
      assert.equal(a[3], 2);
      assert.equal(a[4], 2);
      assert.equal(a[5], 2);
    });
  });
});
