import {
  BoxBufferGeometry,
  Color,
  CylinderBufferGeometry,
  Matrix4,
  Quaternion,
  Vector3,
} from 'three';
import BufferGeometryHeap from './buffer-geometry-heap';


const BRICK_HEIGHT = 8;
const BRICK_WIDTH = 20;
const STUD_HEIGHT = 4;
const STUD_RADIUS = 6;
const STUD_RADIUS_SEGMENTS = 16;
const OUTLINE_SCALE = 1.001;

const uvs = new Float32Array([
  0,0,   0,0,   0,0,      0,0,   0,0,   0,0,   // +x
  0,0,   0,0,   0,0,      0,0,   0,0,   0,0,   // -x

  0,1,   0,0, 0.5,1,      0,0, 0.5,0, 0.5,1,
  0.5,1, 0.5,0,   1,1,      0.5,0,   1,0,   1,1,

  0,0,   0,0,   0,0,      0,0,   0,0,   0,0,   // +z
  0,0,   0,0,   0,0,      0,0,   0,0,   0,0,   // -z
]);

const GEOMETRY_STUD_SELECT_BOX = (function getStudBoxGeometry() {
  const stud = new BoxBufferGeometry(
    (BRICK_WIDTH),
    STUD_HEIGHT,
    (BRICK_WIDTH)
  ).toNonIndexed(); // We don't want to share any indices to simplify how we deal with triangles
  // Position...
  stud.translate(0,(STUD_HEIGHT / 2),0);
  return stud;
})();

/**
 * Returns a box instead of a stud for the geometry. Useful for selecting.
 * Uses a closure so the function is just always returning the savedStud
 */
const GEOMETRY_STUD_BOX = (function getStudBoxGeometry() {
  const stud = new BoxBufferGeometry(
    (STUD_RADIUS * 2),
    STUD_HEIGHT,
    (STUD_RADIUS * 2)
  ).toNonIndexed(); // We don't want to share any indices to simplify how we deal with triangles
  // Position...
  stud.translate(0,(STUD_HEIGHT / 2),0);
  return stud;
})();

/**
 * Returns a cylinder of the stud centered on 0,0 grounded at 0.
 * Uses a closure so the function is just always returning the savedStud
 */
const GEOMETRY_STUD = (function getStudGeometry() {
  const stud = (new CylinderBufferGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, STUD_RADIUS_SEGMENTS)).toNonIndexed();
  // savedStud.removeAttribute('uv'); // No textures
  // savedStud.removeAttribute('color'); // No color
  stud.translate(0,(STUD_HEIGHT / 2),0);
  return stud;
})();

function fillArrayWithColor(array, color) {
  if (array.length % 3 > 0) {
    throw new Error('Array must be in multiples of 3');
  }
  const rgb = (typeof color === 'string') ? new Color(color) : new Color(color.value);
  for (let i = 0; i < array.length; i += 3) {
    array[i] = rgb.r;
    array[i + 1] = rgb.g;
    array[i + 2] = rgb.b;
  }
}

function applyToGeometry(geometry, position, color, orientation) {
  if (position || orientation) {
    const mat = new Matrix4();
    if (orientation) {
      const q = orientation;
      const tquaternion = new Quaternion();
      tquaternion.set(q[0], q[1], q[2], q[3]);
      mat.makeRotationFromQuaternion(tquaternion);
    }
    if (position) {
      // Translate to the correct location
      mat.setPosition(new Vector3(position[0], position[1], position[2]));
    }
    geometry.applyMatrix(mat);
  }
  if (color) {
    if (!geometry.attributes.color) {
      throw new Error('geometry must have a color array to fill.');
    }
    fillArrayWithColor(geometry.attributes.color.array, color);
  }
}

function getGeometryForBrickPart(width, depth, height, studs) {
  const geometry = getBoxGeometryForBrickPart(width, depth, height);
  if (studs === 'square') {
    const heap = new BufferGeometryHeap();
    heap.newFromGeometry(geometry);
    heap.newFromGeometry(getStudGeometryForBrick(width, depth, height, GEOMETRY_STUD_BOX));
    return heap;
  } else if (studs === 'round') {
    const heap = new BufferGeometryHeap();
    heap.newFromGeometry(geometry);
    heap.newFromGeometry(getStudGeometryForBrick(width, depth, height, GEOMETRY_STUD));
    return heap;
  } else {
    return geometry;
  }


}

/**
 * Returns the box for a brick
 * @param width
 * @param depth
 * @param height
 * @returns {*}
 */
function getBoxGeometryForBrickPart(width, depth, height) {
  // Set default parameters
  const geometry = new BoxBufferGeometry(
    (width * BRICK_WIDTH),
    (height * BRICK_HEIGHT),
    (depth * BRICK_WIDTH)
  ).toNonIndexed(); // We don't want to share any indices to simplify how we deal with triangles
  geometry.attributes.uv.array.set(uvs);
  // Position...
  // Make 0,0,0 sit on the ground
  geometry.translate(
    0,
    height * BRICK_HEIGHT / 2,
    0);
  return geometry;
}

function getStudGeometryForBrick(width, depth, height, studTemplate) {
  studTemplate = studTemplate || GEOMETRY_STUD;
  const positions = getStudPositionsForBrickPart(width, depth, height);
  // Set default parameters
  const heap = new BufferGeometryHeap(positions.length * studTemplate.attributes.position.count);
  for (const position of positions) {
    const stud = heap.newFromGeometry(studTemplate);
    stud.translate(position[0], position[1], position[2]);
  }
  return heap;
}

/**
 * Returns the array of positions for a brick
 * @param width
 * @param depth
 * @param height
 * @returns {Array}
 */
function getStudPositionsForBrickPart(width, depth, height) {
  const positions = [];
  // Calculate all the positions
  const y = (BRICK_HEIGHT * height);
  for (let i = 0; i < width; i++) {
    const x = (((-BRICK_WIDTH / 2) * width) + (BRICK_WIDTH / 2)) + (BRICK_WIDTH * i);
    for (let j = 0; j < depth; j++) {
      const z = (((-BRICK_WIDTH / 2) * depth) + (BRICK_WIDTH / 2)) + (BRICK_WIDTH * j);
      positions.push([x,y,z]);
    }
  }
  return positions;
}

export {
  GEOMETRY_STUD,
  GEOMETRY_STUD_BOX,
  GEOMETRY_STUD_SELECT_BOX,
  BRICK_HEIGHT,
  BRICK_WIDTH,
  STUD_HEIGHT,
  STUD_RADIUS,
  STUD_RADIUS_SEGMENTS,
  OUTLINE_SCALE,

  applyToGeometry,
  fillArrayWithColor,
  getGeometryForBrickPart,
  getStudPositionsForBrickPart,
};

//export function getBrickGeometry;
