import { BufferGeometry, BufferAttribute } from 'three';


const INITIAL_SIZE = 1024;

function growArray(geometry, name, size) {
  // Attribute doesn't exist, no need to grow
  if (! geometry.attributes[name]) {
    return;
  }
  const data = new Float32Array(size * 3);
  data.set(geometry.attributes[name].array); // Copy old data
  geometry.addAttribute(name, new BufferAttribute(data, 3));
}

class GeometryHeap {
  constructor(options = {}) {
    // Get options
    const size = options.size || INITIAL_SIZE;
    const color = options.color !== undefined ? options.color : true;
    const normal = options.normal !== undefined ? options.normal : true;

    this._offset = 0;
    this._geometry = new BufferGeometry();
    this._geometry.addAttribute('position', new BufferAttribute(new Float32Array(size * 3), 3));
    if (color) {
      this._geometry.addAttribute('color', new BufferAttribute(new Float32Array(size * 3), 3));
    }
    if (normal) {
      this._geometry.addAttribute('normal', new BufferAttribute(new Float32Array(size * 3), 3));
    }
  }

  grow(size) {
    // We need to make sure we always grow this thing, not shrink it...
    if (this._geometry.attributes.position.count > size) {
      throw new Error(`size (${size}) must be greater than it is now (${this._geometry.attributes.position.count}) silly.`);
    }
    growArray(this._geometry, 'position', size);
    growArray(this._geometry, 'color', size);
    growArray(this._geometry, 'normal', size);
  }

  add(geometry) {
    const count = geometry.attributes.position.count;
    const startFace = this._offset;
    const stopFace = this._offset + count - 1;

    // Do we have enough room in our geometry?
    if ( (this._offset + count) > this._geometry.attributes.position.count) {
      let newSize = (this._geometry.attributes.position.count * 2); // Double the size
      if (newSize < count + this._offset) {
        newSize = count + this._offset;
      }
      this.grow(newSize);
    }

    this._geometry.merge(geometry, this._offset);
    this._geometry.attributes.position.needsUpdate = true;
    this._geometry.attributes.color.needsUpdate = true;
    this._geometry.attributes.normal.needsUpdate = true;
    this._offset += count;

    return {
      start: startFace,
      stop: stopFace
    };
  }

  remove(start, stop) {
    const position = this._geometry.attributes.position;
    position.array.fill(0, start * 3, stop * 3);
    position.needsUpdate = true;
  }

  get geometry() {
    return this._geometry;
  }
}

export default GeometryHeap;
