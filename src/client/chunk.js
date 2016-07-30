const MAX_VERTICES = 100000 * 3;

class Chunk {
  constructor() {
    this.vertexCount = 0;
    this.bricks = [];
    this.scale = 1;
  }

  add(brick) {
    this.vertexCount += brick.vertexCount
    this.bricks.push(brick);
    this.brick = brick;
  }

  getBufferGeometry() {
    var chunk = new THREE.BufferGeometry();
    const VECTORS_PER_TRIANGLE = 3;
    const VALUES_PER_VECTOR = 3;
    const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3));
    
    let offset = 0;
    this.bricks.forEach( brick => {
      // Add each brick...
      let geometry = brick.getBufferGeometry();
      if (this.scale && this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }
      chunk.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    });
    return chunk;
  }

  getStudGeometry() {
    var chunk = new THREE.BufferGeometry();
    const VECTORS_PER_TRIANGLE = 3;
    const VALUES_PER_VECTOR = 3;
    const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3));
    
    let offset = 0;
    // Now draw studs
    this.bricks.forEach( brick => {
      // Studs
      let geometry = brick.getStudGeometry();
      if (this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }
      chunk.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    });
    return chunk;
  }

  getSelectable() {
    console.log('jason was here\n\n\n\n\n');
    this.selectables = [];

    var chunk = new THREE.BufferGeometry();
    const VECTORS_PER_TRIANGLE = 3;
    const VALUES_PER_VECTOR = 3;
    const TRIANGLES_PER_CHUNK = 100;

    // Per Vertex Colors
    const colors = new Float32Array(MAX_VERTICES * 3); // 3 floats per vertex
    chunk.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // Positions
    const vertices = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(MAX_VERTICES * 3);
    chunk.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3));
    
    let offset = 0;
    this.bricks.forEach( brick => {
      // Add each brick...
      let geometry = brick.getSelectable();
      if (this.scale && this.scale !== 1) {
        geometry.scale(this.scale, this.scale, this.scale);
      }

      // Save so we can highlight appropriately
      let vertexCount = geometry.getAttribute('position').count;
      let startFace = offset;
      let stopFace = offset + vertexCount - 1;

      // should use a more efficient storage system since
      // 0 = brick
      // 1 = brick
      // 2 = brick
      // ...
      // 35 = brick
      
      //TODO: We should really use the same box for the same brick and translate to right place
      //      instead of creating an entire box for each brick
      let outline = new THREE.EdgesGeometry(geometry, 0.1);
      outline.uuid = brick.uuid;
      for (let i = startFace; i <= stopFace; i++) {
        this.selectables[i] = outline;
      }

      chunk.merge(geometry, offset);
      offset += vertexCount;
      
    });
    return chunk;
  }

  getHighlightFromFaceIndex(index) {
    return this.selectables[index];
  }

}

export default Chunk;
