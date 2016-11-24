

/**
 * Geometry that is used
 * @memberOf client/game
 */
const GAP = 1 / 4;
const VECTORS_PER_TRIANGLE = 3;
const VALUES_PER_VECTOR = 3;
const TRIANGLES_PER_CUBE = 12;
const RADIUS_SEGMENTS = 16;

/**
 * Creates a simple brick from width, depth, height
 */
class BrickTemplate {

  /**
   * Generates geometry for simple bricks
   * @param options
   * @param {number} options.width=2 The number of studs along the x-axis (left to right)
   * @param {number} options.depth=4 The number of studs along the z-axis
   * (out of
   * the screen).
   * @param {number} options.height=3 The height of the brick in plates. A
   * standard
   * brick height would be 3.
   */
  constructor(options = { width: 2, depth: 4, height: 3 }) {
    this._geometry = BrickTemplate._getBufferGeometry(options.width, options.depth, options.height);
    // this._edges = new THREE.EdgesGeometry(this._geometry, 0.1);
    this._studs = BrickTemplate._getStudGeometry(options.width, options.depth, options.height);
  }

  /**
   * Returns the internal geometry buffer for the brick
   * @returns {THREE.BufferGeometry}
   */
  get geometry() {
    return this._geometry;
  }

  /**
   * Returns the internal geometry buffer for the studs. If machine isn't
   * powerful enough, we can choose to not render the studs.
   * @returns {THREE.BufferGeometry}
   */
  get studs() {
    return this._studs;
  }

  /**
   * Creates the box geometry for the brick.
   * @param {number} width
   * @param {number} depth
   * @param {number} height
   * @returns {THREE.BoxBufferGeometry}
   */
  static _getBufferGeometry(width, depth, height) {
    const geometry = new THREE.BoxBufferGeometry(
      (width * 20) - GAP,
      (height * 8) - GAP,
      (depth * 20) - GAP
    ).toNonIndexed();
    const colors = new Float32Array(TRIANGLES_PER_CUBE * VECTORS_PER_TRIANGLE * VALUES_PER_VECTOR);
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, VECTORS_PER_TRIANGLE));
    geometry.removeAttribute('uv');
    // Make 0,0,0 sit on the ground
    geometry.translate(0, (height * 4) + (GAP / 2), 0);
    return geometry;
  }

  /**
   * Creates the stud geometry for the brick.
   * @param {number} width
   * @param {number} depth
   * @param {number} height
   * @returns {THREE.BufferGeometry} Geometry that represents the studs
   */
  static _getStudGeometry(width, depth, height) {
    const studCount = width * depth;
    const verticexCount = studCount * RADIUS_SEGMENTS * 4 * 3; // 1 top
    // triangle, 1 bottom
    // triangle, 2 triangles on side

    const studs = new THREE.BufferGeometry();
    // Positions
    const vertices = new Float32Array(verticexCount * 3);
    studs.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(verticexCount * 3);
    studs.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    // Colors
    const colors = new Float32Array(verticexCount * 3); // 3 floats per vertex
    studs.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    // let geo = null;
    let offset = 0;
    const blockHeight = 8;
    const blockWidth = 20;
    const studHeight = 4;
    const y = (studHeight / 2) + (blockHeight * height);
    for (let i = 0; i < width; i++) {
      const x = (((-blockWidth / 2) * width) + (blockWidth / 2)) + (blockWidth * i);
      for (let j = 0; j < depth; j++) {
        const z = (((-blockWidth / 2) * depth) + (blockWidth / 2)) + (blockWidth * j);
        const geometry = (new THREE.CylinderBufferGeometry(6, 6, 4, RADIUS_SEGMENTS)).toNonIndexed();
        geometry.translate(x, y, z);
        studs.merge(geometry, offset);
        offset += geometry.getAttribute('position').count;
      }
    }

    return studs;
  }

}

export {
  BrickTemplate as default,
};
