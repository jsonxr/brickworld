import { Color, Matrix4, Mesh, Quaternion, Vector3 } from 'three';
import BufferGeometryHeap from './buffer-geometry-heap';


function fillArrayWithColor(array, color) {
  const rgb = new Color(color);
  for (let i = 0; i < array.length; i += 3) {
    array[i] = rgb.r;
    array[i + 1] = rgb.g;
    array[i + 2] = rgb.b;
  }
}

function applyToGeometry(geometry, position, color, orientation) {
  const mat = new Matrix4();
  if (orientation) {
    const q = orientation;
    const tquaternion = new Quaternion();
    tquaternion.set(q[0], q[1], q[2], q[3]);
    mat.makeRotationFromQuaternion(tquaternion);
  }
  // Translate to the correct location
  mat.setPosition(new Vector3(position[0], position[1], position[2]));
  fillArrayWithColor(geometry.attributes.color.array, color);
  geometry.applyMatrix(mat);
}

function createSceneObjects(chunk, material, level = 0) {
  //const vertexCount = chunk.getVertexCountByLod(level);
  // Create geometries for brick
  const heapGeometry = new BufferGeometryHeap(1024);
  //
  console.log('bricks: ', chunk.bricks);
  chunk.bricks.forEach( (brick) => {
  // Object.keys(chunk.bricks).forEach( (id) => {
  //   const brick = chunk.bricks[id];
    const brickGeometry = heapGeometry.newFromGeometry(brick.part.getGeometryByLod(level));
    console.log('b1: ', brickGeometry);
    applyToGeometry(brickGeometry, brick.position, brick.color, brick.orentiation);
    console.log('b2: ', brickGeometry);
  });

  return {
    geometryMesh: new Mesh(heapGeometry, material)
  };
}

function createSelectableObjects(chunk, highlight) {
  chunk.bricks.forEach( (brick) => {
  //Object.keys(chunk.bricks).forEach( (id) => {
  //  const brick = chunk.bricks[id];
    const brickGeometry = highlight.add(brick.part.getGeometryByLod(2), brick);
    brickGeometry.translate(brick.position[0], brick.position[1], brick.position[2]); // Move it into place
  });
}

export {
  createSceneObjects as default,
  createSceneObjects,
  createSelectableObjects,
};
