const MAX_VERTICES = 100000 * 3;

/**
 * @memberOf client/game
 */
class Chunk {

  /**
   *
   */
  constructor() {
    this.bricks = [];
    this.scale = 1;
  }

  /**
   *
   * @param brick
   */
  add(brick) {
    this.bricks.push(brick);
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getBufferGeometry() {
    const chunk = new THREE.BufferGeometry();
    // const VECTORS_PER_TRIANGLE = 3;
    // const VALUES_PER_VECTOR = 3;
    // const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

    let offset = 0;
    this.bricks.forEach((brick) => {
      // Add each brick...
      const geometry = brick.getBufferGeometry();
      if (this.scale && this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }
      chunk.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    });
    return chunk;
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getStudGeometry() {
    const chunk = new THREE.BufferGeometry();
    // const VECTORS_PER_TRIANGLE = 3;
    // const VALUES_PER_VECTOR = 3;
    // const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

    let offset = 0;
    // Now draw studs
    this.bricks.forEach((brick) => {
      // Studs
      const geometry = brick.getStudGeometry();
      if (this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }
      chunk.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    });
    return chunk;
  }

  /**
   *
   * @returns {THREE.BufferGeometry}
   */
  getSelectable() {
    this.selectables = [];

    const chunk = new THREE.BufferGeometry();
    // const VECTORS_PER_TRIANGLE = 3;
    // const VALUES_PER_VECTOR = 3;
    // const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

    let offset = 0;
    this.bricks.forEach((brick) => {
      // Add each brick...
      const geometry = brick.getSelectable();
      if (this.scale && this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }

      // Save so we can highlight appropriately
      const vertexCount = geometry.getAttribute('position').count;
      const startFace = offset;
      const stopFace = (offset + vertexCount) - 1;

      // This is setting the brick to each face between start and stop
      // so we can find the geometry based on the index of this chunk.

      // should use a more efficient storage system since
      // 0 = brick
      // 1 = brick
      // 2 = brick
      // ...
      // 35 = brick

      //TODO: We should really use the same box for the same brick and translate to right place
      //      instead of creating an entire box for each brick
      for (let i = startFace; i <= stopFace; i++) {
        this.selectables[i] = brick;
      }

      chunk.merge(geometry, offset);
      offset += vertexCount;
    });
    return chunk;
  }

  /**
   * When given an index, returns the outline
   * @param index
   * @returns {*}
   */
  getHighlightFromFaceIndex(index) {
    const outline = this.selectables[index].outline;
    return outline;
  }

}

export {
  Chunk as default,
};
