import * as THREE from 'three';
//{ width: 2, depth: 4, height: 3 }

const BRICK_HEIGHT = 8;
const BRICK_WIDTH = 20;
const STUD_HEIGHT = 4;
const STUD_RADIUS = 6;
const STUD_RADIUS_SEGMENTS = 16;

// Used Internally
const VECTORS_PER_TRIANGLE = 3;
const VALUES_PER_VECTOR = 3;
const TRIANGLES_PER_CUBE = 12;

function fillArrayWithColor(array, color) {
  const rgb = new THREE.Color(color);
  for (let i = 0; i < array.length; i += 3) {
    array[i] = rgb.r;
    array[i + 1] = rgb.g;
    array[i + 2] = rgb.b;
  }
}

function getBrickGeometry(options = {}) {
  // Set default parameters
  options.width = options.width || 2;
  options.depth = options.depth || 4;
  options.height = options.height || 3;
  options.position = options.position || [0,0,0];
  options.color = options.color || '#C91A09';

  const geometry = new THREE.BoxBufferGeometry(
    (options.width * BRICK_WIDTH),
    (options.height * BRICK_HEIGHT),
    (options.depth * BRICK_WIDTH)
  ).toNonIndexed(); // We don't want to share any indices to simplify how we deal with triangles
  const colors = new Float32Array(TRIANGLES_PER_CUBE * VECTORS_PER_TRIANGLE * VALUES_PER_VECTOR);
  fillArrayWithColor(colors, options.color);
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, VECTORS_PER_TRIANGLE));
  geometry.removeAttribute('uv'); // No textures
  // Position...
  // Make 0,0,0 sit on the ground
  const offset = [0, options.height * BRICK_HEIGHT / 2, 0];
  geometry.translate(
    options.position[0] + offset[0],
    options.position[1] + offset[1],
    options.position[2] + offset[2]);
  //geometry.computeBoundingSphere(); // Required in order to render directly
  return geometry;
}

function getStudGeometry() {
  const geometry = (new THREE.CylinderBufferGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, STUD_RADIUS_SEGMENTS)).toNonIndexed();
  return geometry;
}

/**
 * Creates the stud geometry for the entire brick.
 * @param {number} width
 * @param {number} depth
 * @param {number} height
 * @returns {THREE.BufferGeometry} Geometry that represents the studs
 */
function getStudGeometryForBrick(options = {}) {
  // Set default parameters
  options.width = options.width || 2;
  options.depth = options.depth || 4;
  options.height = options.height || 3;
  options.position = options.position || [0,0,0];
  options.color = options.color || '#C91A09';

  const studCount = options.width * options.depth;
  const verticexCount = studCount * STUD_RADIUS_SEGMENTS * 4 * 3; // 1 top
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
  const y = (STUD_HEIGHT / 2) + (BRICK_HEIGHT * options.height);
  for (let i = 0; i < options.width; i++) {
    const x = (((-BRICK_WIDTH / 2) * options.width) + (BRICK_WIDTH / 2)) + (BRICK_WIDTH * i);
    for (let j = 0; j < options.depth; j++) {
      const z = (((-BRICK_WIDTH / 2) * options.depth) + (BRICK_WIDTH / 2)) + (BRICK_WIDTH * j);
      const geometry = (new THREE.CylinderBufferGeometry(6, 6, 4, STUD_RADIUS_SEGMENTS)).toNonIndexed();
      geometry.translate(x, y, z);
      studs.merge(geometry, offset);
      offset += geometry.getAttribute('position').count;
    }
  }

  return studs;
}

export {
  getBrickGeometry,
  getStudGeometry,
  getStudGeometryForBrick,

  BRICK_HEIGHT,
  BRICK_WIDTH,
  STUD_HEIGHT,
  STUD_RADIUS_SEGMENTS
};

//export function getBrickGeometry;
