import { BufferGeometry } from 'three';


const INITIAL_SIZE = 1000;

class GeometryHeap {
  constructor(size = INITIAL_SIZE) {
    this.geometry = new BufferGeometry();
  }
}

export default GeometryHeap;
