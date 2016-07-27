const MAX_VERTICES = 80000 * 3;

class Chunk {
  constructor() {
    this.vertexCount = 0;
    this.bricks = [];
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
      chunk.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    });
    return chunk;
  }

}

export default Chunk;
