import { BufferAttribute, BufferGeometry } from 'three';
import createDebug from './debug';
import FaceList from './face-list';


const debug = createDebug('buffer-geometry-heap');

class BufferGeometryHeap extends BufferGeometry {
  constructor(capacity, options = {}) {
    debug(`buffer-geometry-heap: constructor(${capacity})`);
    if (!capacity) {
      throw new Error('Must set an initial capacity.');
    }
    super();
    this._offset = 0;
    this._capacity = capacity;
    this._buffers = {};
    this._faceList = new FaceList();
    this._objList = new WeakMap();

    // position
    this._buffers.position = new ArrayBuffer(this._capacity * 3 * Float32Array.BYTES_PER_ELEMENT);
    this._positions = new Float32Array(this._buffers.position);
    this.addAttribute('position', new BufferAttribute(new Float32Array(this._buffers.position), 3)); // x,y,z
    // normal
    if (options.normal !== false) {
      this._buffers.normal = new ArrayBuffer(this._capacity * 3 * Float32Array.BYTES_PER_ELEMENT);
      this.addAttribute('normal', new BufferAttribute(new Float32Array(this._buffers.normal), 3)); // x,y,z
    }
    // color
    if (options.color !== false) {
      this._buffers.color = new ArrayBuffer(this._capacity * 3 * Float32Array.BYTES_PER_ELEMENT);
      this.addAttribute('color', new BufferAttribute(new Float32Array(this._buffers.color), 3)); // x,y,z
    }
    // uv
    if (options.uv !== false) {
      this._buffers.uv = new ArrayBuffer(this._capacity * 2 * Float32Array.BYTES_PER_ELEMENT);
      this.addAttribute('uv', new BufferAttribute(new Float32Array(this._buffers.uv), 2)); // u,v
    }
  }

  newBuffer(vertexCount, obj) {
    const newGeometry = new BufferGeometry(vertexCount);
    this.growToFit(this._offset + vertexCount);
    this._faceList.push(this._offset, this._offset + vertexCount - 1, obj);
    // So we can remove all by object later.
    const createViewIntoBuffer = (name) => {
      // Normal... vertex=x,y,z
      const itemSize = this.attributes[name].itemSize;
      const byteOffset = this._offset * itemSize * Float32Array.BYTES_PER_ELEMENT;
      const floatCount = vertexCount * itemSize;
      const array = new Float32Array(this._buffers[name], byteOffset, floatCount);
      newGeometry.addAttribute(name, new BufferAttribute(array, itemSize));
    };

    // Create a view for each attribute we have
    Object.keys(this.attributes).forEach( (key) => {
      createViewIntoBuffer(key);
    });

    // Save the geometry that we hand out so we can do stuff with it later
    const entry = {
      offset: this._offset,
      count: vertexCount,
      geometry: newGeometry
    };
    if (typeof obj === 'object') {
      this._objList.set(obj, entry);
    }

    // Move the offset to the end...
    this._offset = this._offset + vertexCount;

    return newGeometry;
  }

  newFromGeometry(geometryToCopy, obj) {
    debug(`buffer-geometry-heap: newFromGeometry(geometryToCopy, ${obj})`);
    const vertexCount = geometryToCopy.attributes.position.count;
    const newGeometry = this.newBuffer(vertexCount, obj);

    const copyToBufferWindow = (name) => {
      const array = newGeometry.attributes[name].array;
      if (geometryToCopy.attributes[name]) {
        array.set(geometryToCopy.attributes[name].array);
      } else {
        array.fill(0);
      }
      this.attributes[name].needsUpdate = true;
    };

    // Create a view for each attribute we have
    Object.keys(this.attributes).forEach( (key) => {
      copyToBufferWindow(key);
    });

    return newGeometry;
  }

  getNodeByIndex(index) {
    return this._faceList.find(index);
  }

  growToFit(count) {
    debug(`buffer-geometry-heap: growToFit(${count})`);
    // Do we have enough room in our geometry?
    const actualCount = this.attributes.position.count;
    if (count > actualCount) {
      // Double the size. Should we use growby instead to prevent that one extra brick from destroying memory
      // by doubling 64Mb to 128Mb?
      let newCapacity = (actualCount * 2);
      if (newCapacity < count + this._offset) {
        newCapacity = count + this._offset;
      }
      this.grow(newCapacity);
    }
  }

  grow(capacity) {
    debug(`buffer-geometry-heap: ${this.name}.grow(${capacity})`);
    console.log(`buffer-geometry-heap: ${this.name}.grow(${capacity})`);
    // We need to make sure we always grow this thing, not shrink it...
    if (this._capacity >= capacity) {
      throw new Error(`capacity (${capacity}) must be greater than it is now (${this.capacity}).`);
    }
    this._capacity = capacity;

    const growAttribute = (name) => {
      if (! this.attributes[name]) return; // Only copy buffers that exist in this heap

      const oldArray = this.attributes[name].array;
      const itemSize = this.attributes[name].itemSize;
      this._buffers[name] = new ArrayBuffer(this._capacity * itemSize * Float32Array.BYTES_PER_ELEMENT);
      const newArray = new Float32Array(this._buffers[name]);
      newArray.set(oldArray);
      this.addAttribute(name, new BufferAttribute(newArray, itemSize)); // x,y,z
    };

    growAttribute('position');
    growAttribute('color');
    growAttribute('normal');
    growAttribute('uv');
  }

  getBuffer(obj) {
    const entry = this._objList.get(obj);
    if (!entry) {
      throw new Error(`entry does not exist for object ${obj}`);
    }
    return entry.geometry;
  }

  remove(obj) {
    const entry = this._objList.get(obj);
    if (!entry) {
      throw new Error(`entry does not exist for object ${obj}`);
    }
    //const geometry = entry.geometry;

    Object.keys(this.attributes).forEach( (key) => {
      const itemSize = this.attributes[key].itemSize;
      const start = entry.offset * itemSize;
      const stop = start + (entry.count * itemSize);
      this.attributes[key].array.fill(0, start, stop);
      this.attributes[key].needsUpdate = true; // Let the containing buffer know we need to refresh
    });

  }
}

export default BufferGeometryHeap;
