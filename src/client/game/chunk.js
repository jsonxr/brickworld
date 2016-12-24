import FaceList from '../../shared/face-list';
import GeometryHeap from '../../shared/geometry-heap';
import { Object3D } from 'three';
import { setOptions } from '../../shared/utils';
import Brick from './brick';

/**
 * @memberOf client/game
 */
class Chunk extends Object3D {

  /**
   *
   */
  constructor(options = {}) {
    super();
    console.log(options);
    this.name = '-generate-unique-name-';
    this.version = 1;
    setOptions(this, options, ['bricks']);
    this.bricks = [];
    this.faceList = new FaceList();
    //
    this.offset = 0;
    this.geometryHeap = new GeometryHeap();
    this.studHeap = new GeometryHeap();
    this.selectionHeap = new GeometryHeap();

    // Load up the bricks
    if (options.bricks) {
      options.bricks.forEach( (brickJson) => {
        this.add(new Brick(brickJson));
      });
    }
  }

  toJSON() {
    const bricksJson = [];
    for (const brick of this.bricks) {
      if (brick !== null) {
        console.log(brick);
        bricksJson.push(brick.toJSON());
      }
    }
    return {
      name: this.name,
      version: this.version,
      bricks: bricksJson
    };
  }

  /**
   *
   * @param brick
   */
  add(brick) {
    this.bricks.push(brick);
    brick.index = this.bricks.length - 1;
    brick.links = {};
    brick.links.geometries = this.geometryHeap.add(brick.geometry);
    brick.links.studs = this.studHeap.add(brick.studGeometry);
    brick.links.selections = this.selectionHeap.add(brick.selectionGeometry);
    this.faceList.push(brick.links.selections.start, brick.links.selections.stop, brick);
  }

  remove(brick) {
    this.bricks[brick.index] = null;
    this.geometryHeap.remove(brick.links.geometries.start, brick.links.geometries.stop);
    this.studHeap.remove(brick.links.studs.start, brick.links.studs.stop);
    this.selectionHeap.remove(brick.links.selections.start, brick.links.selections.stop);
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getBufferGeometry() {
    return this.geometryHeap.geometry;
    //return mergeGeometry(this.bricks, 'getBufferGeometry');
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getStudGeometry() {
    return this.studHeap.geometry;
    //return mergeGeometry(this.bricks, 'getStudGeometry');
  }

  get selectable() {
    return this.selectionHeap.geometry;
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getSelectable() {
    return this.selectionHeap.geometry;
  }

  /**
   * When given an index, returns the outline
   * @param index
   * @returns {*}
   */
  getHighlightFromFaceIndex(index) {
    const node = this.faceList.find(index);
    this.selectedBrick = node.value;

    if (this.selectedBrick) {
      this.faceIndex = index;
      return this.selectedBrick.outline;
    } else {
      this.faceIndex = null;
      return null;
    }
  }
}

export {
  Chunk as default,
};
