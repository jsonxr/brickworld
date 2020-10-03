import { MeshStandardMaterial, VertexColors } from 'three';

// The loading of textures does not work on the server...

// function loadCubeMap() {
//   const urls = [
//     'cubemaps/px.jpg', 'cubemaps/nx.jpg',
//     'cubemaps/py.jpg', 'cubemaps/ny.jpg',
//     'cubemaps/pz.jpg', 'cubemaps/nz.jpg'
//   ];
//   const reflectionCube = new CubeTextureLoader().load( urls );
//   reflectionCube.format = RGBFormat;
//   return reflectionCube;
// }
//
// // const refractionCube = loadCubeMap();
// // refractionCube.mapping = THREE.CubeRefractionMapping;
// const texLoader = new TextureLoader();
// const map = texLoader.load('textures/2x4b.png');//THREE.ImageUtils.loadTexture('textures/2x4b.png', {}, function(){});
// const normalMap =  texLoader.load('textures/block.png');
// const displacementMap = texLoader.load('textures/2x4a-displacement.png');
// // Material to use for drawing bricks

class BrickMaterial extends MeshStandardMaterial {
  constructor(options = {}) {
    options.wireframe = options.wireframe !== undefined ? options.wireframe : false;
    options.vertexColors = options.vertexColors || VertexColors;
    options.refractionRatio = options.refractionRatio || 0.98;
    options.roughness = options.roughness || 0.5;
    options.metalness = options.metalness || 0;

    // These are for MeshPhysicalMaterial
    // options.clearCoat = options.clearCoat || 0.5;
    // options.clearCoatRoughness = options.clearCoatRoughness || 0.5;
    // options.reflectivity = options.reflectivity || 0.5;

    //options.map = map;
    super(options);

    //wireframe:true,
    //precision: 'highp',
    //      envMap: reflectionCube,
    //      envMapIntensity: 1.0,
    // roughness: 0.6,
    // metalness: 0.2,

    // bumpMap: displacementMap,
    // bumpScale: 0.85,

    // normalMap: normalMap,
    // normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

    // displacementMap: displacementMap,
    // displacementScale: 1,
    // displacementBias: - 0.428408,

    //reflectivity: 0.3,
    //metalness: 0.5,
    //roughness: 0.98,
  }
}

// Singleton material list
const materials = [];
materials.push(new BrickMaterial());
function getMaterial(id) {
  const material = materials[id];
  if (!material) {
    throw new Error(`material ${id} not found.`);
  }
  return material;
}

const BRICK = 0;

const exports = {
  get: getMaterial,
  BRICK,
};

export default exports;
