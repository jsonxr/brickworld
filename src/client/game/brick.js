// import colors from './colors';
import BrickTemplate from './brick-template';

const VECTORS_PER_TRIANGLE = 3;
const VALUES_PER_VECTOR = 3;
const TRIANGLES_PER_CUBE = 12;
const RADIUS_SEGMENTS = 16;


// Scale: 1 unit = 5/16" = 20 LDU
//        20:1

// Scale: LDU to Actual Lego size
//        20 LDU = 5/16"
//        24 LDU = 3/8"
//        1 LDU = 1/64"


// Scale: Lego To People Size
//         4 blocks high = 6 feet tall
//         4 * 3/8" = 6'
//         1.5" = 6'
//         24/16 = 6'
//         1/4" = 1'
//         1/4" = 12"
//         1" = 48"

// Scale: Run 5mph = 7.33333 ft/sec = 88 inch/sec
//        x=5
//        y = (x * 5280 * 12 * 64) / 3600;
//        5 mi/hr * (1/48 scale * 5280 ft/mi * 12 inch/ft * 64 inch/LDU) / (1hr * 60min/hr * 60sec/min) = LDU/sec = 117

//
const blockGap = 1 / 4;


// const geometries =


const Bricks = {};
Bricks['3001'] = new BrickTemplate({ name: 'Brick 2x4', width: 2, depth: 4, height: 3 });
Bricks['3002'] = new BrickTemplate({ name: 'Brick 2x3', width: 2, depth: 3, height: 3 });
// Bricks[3003] = new BrickTemplate({ name: 'Brick 2x2', width: 2, depth: 2, height: 3});
// Bricks[3004] = new BrickTemplate({ name: 'Brick 1x2', width: 1, depth: 2, height: 3});
// Bricks[3005] = new BrickTemplate({ name: 'Brick 1x1', width: 1, depth: 2, height: 3});
// Bricks[3006] = new BrickTemplate({ name: 'Brick 2x10', width: 2, depth: 10, height: 3});
// Bricks[3007] = new BrickTemplate({ name: 'Brick 2x8', width: 2, depth: 8, height: 3});
// Bricks[3008] = new BrickTemplate({ name: 'Brick 1x8', width: 1, depth: 8, height: 3});
// Bricks[3009] = new BrickTemplate({ name: 'Brick 1x6', width: 1, depth: 6, height: 3});
// Bricks[3010] = new BrickTemplate({ name: 'Brick 1x4', width: 1, depth: 4, height: 3});
// Bricks[3622] = new BrickTemplate({ name: 'Brick 1x3', width: 1, depth: 3, height: 3});

class Brick {
  constructor(options = { width: 2, depth: 4, height: 3, color: '#f0f0f0', position: [0, 0, 0] }) {
    // this.uuid = THREE.Math.generateUUID();
    this.color = new THREE.Color(options.color);
    this.options = options;
    this.position = new THREE.Vector3(options.position[0],
                                      options.position[1],
                                      options.position[2]);
  }

  // get triangles() {
  //   return 12;
  // }

  get geometry() {
    if (!this._geometry) {
      this._geometry = this.getBufferGeometry();
    }
    return this._geometry;
  }

  get outline() {
    if (!this._outline) {
      this._outline = new THREE.EdgesGeometry(this.geometry, 0.1);
    }
    return this._outline;
  }

  getBufferGeometry() {
    const geometry = new THREE.BoxBufferGeometry(
      (this.options.width * 20) - blockGap,
      (this.options.height * 8) - blockGap,
      (this.options.depth * 20) - blockGap
    ).toNonIndexed();
    const colors = new Float32Array(TRIANGLES_PER_CUBE * VECTORS_PER_TRIANGLE * VALUES_PER_VECTOR);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = this.color.r;
      colors[i + 1] = this.color.g;
      colors[i + 2] = this.color.b;
    }
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, VECTORS_PER_TRIANGLE));
    geometry.removeAttribute('uv');
    // Make it sit on the ground at x,y,z
    geometry.translate(0, (this.options.height * 4) + (blockGap / 2), 0);

    // geometry position in the world...
    geometry.translate(this.position.x, this.position.y, this.position.z);

    return geometry;
  }


  getStudGeometry() {
    const studCount = this.options.width * this.options.depth;
    const verticexCount = studCount * RADIUS_SEGMENTS * 4 * 3; // 1 top
    // triangle, 1 bottom
                                                             // triangle, 2 triangles on side

    const studs = new THREE.BufferGeometry();
    // Per Vertex Colors
    const colors = new Float32Array(verticexCount * 3); // 3 floats per vertex
    studs.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = this.color.r;
      colors[i + 1] = this.color.g;
      colors[i + 2] = this.color.b;
    }
    // Positions
    const vertices = new Float32Array(verticexCount * 3);
    studs.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Normals
    const normals = new Float32Array(verticexCount * 3);
    studs.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

    let offset = 0;
    const blockHeight = 8;
    const blockWidth = 20;
    const studHeight = 4;
    const y = (studHeight / 2) + (blockHeight * this.options.height);
    for (let i = 0; i < this.options.width; i++) {
      const x = (((-blockWidth / 2) * this.options.width) + (blockWidth / 2)) + (blockWidth * i);
      for (let j = 0; j < this.options.depth; j++) {
        const z = (((-blockWidth / 2) * this.options.depth) + (blockWidth / 2)) + (blockWidth * j);
        const geometry = (new THREE.CylinderBufferGeometry(6, 6, 4, RADIUS_SEGMENTS)).toNonIndexed();
        geometry.translate(x, y, z);
        studs.merge(geometry, offset);
        offset += geometry.getAttribute('position').count;
      }
    }
    studs.translate(this.position.x, this.position.y, this.position.z);

    return studs;
  }

  getSelectable() {
    return this.getBufferGeometry();
  }

}


export {
  Brick as default
};


/*
const legoScale = 3.2;// 5/16" = 1'
const personHeight = (1 + 9/16.0) * legoScale;
const eyeHeight = (1 + 3/8.0) * legoScale;
const blockHeight = (1/8.0) * legoScale;
const blockWidth = (5/16.0) * legoScale;
const studHeight = (1/16.0) * legoScale;
const studWidth = (3/16.0) * legoScale;
const studRadius = (studWidth ) / 2.0;
const studFaces = 12;
const blockGap = (1/512) * legoScale;

var X_IDX=0, Y_IDX=1, Z_IDX=2;

var Block = function Block(params) {
    console.log('new block');
    this.location = params.loc !== undefined ? params.loc : [0,0,0]
    this.height = params.height !== undefined ? params.height : 3;
    this.width = params.width !== undefined ? params.width : 1;
    this.length = params.length !== undefined ? params.length : 1;
    this.axis = params.axis !== undefined ? params.axis : 'x';
    this.studs = params.studs !== undefined ? params.studs : true;
    this.color = params.color !== undefined ? params.color : 0x090909
    this.wireframe = params.wireframe !== undefined ? params.wireframe : false
    this.material = {
        color: this.color,
//        ambient: 0xFF9999,
        wireframe: this.wireframe,
        specular: 0x000000,
        shininess: 30,
        shading: THREE.SmoothShading
    };
    this.brick = null;
}

Block.prototype.brickGeometry = function brickGeometry() {
    var geometry = new THREE.CubeGeometry(
    blockWidth*this.width - blockGap,
    blockHeight * this.height,
    blockWidth*this.length - blockGap);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
        ((blockWidth * this.width) / 2) + this.location[X_IDX],
        ((blockHeight * this.height) / 2) + this.location[Y_IDX],
        0 - ((blockWidth * this.length) / 2) - this.location[Z_IDX]
    ));
    return geometry;
}

Block.prototype.studGeometry = function studGeometry() {
    var geo = null;
    var obj = new THREE.Object3D();
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.length; j++) {
            geometry = new THREE.CylinderGeometry(studRadius, studRadius,  studHeight, studFaces);
            geometry.applyMatrix( new THREE.Matrix4().makeTranslation(
                (blockWidth / 2) + this.location[X_IDX] + (i * blockWidth),
                (studHeight / 2) + (this.location[Y_IDX] + this.height ) * blockHeight,
                0 - (blockWidth / 2) - this.location[Z_IDX] - (j * blockWidth)
            ));
            if (geo === null) {
                geo = geometry;
            } else {
                THREE.GeometryUtils.merge(geo, geometry);
            }
        }
    }
    return geo;
}

Block.prototype.getMesh = function getMesh() {
    var material = new THREE.MeshPhongMaterial(this.material);
    var geometry = this.brickGeometry();
    if (this.studs) {
        var studGeometry = this.studGeometry();
        THREE.GeometryUtils.merge(geometry, studGeometry);
    }
    this.brick = new THREE.Mesh( geometry, material);
//    var randomRotation = (0.05) * Math.random();
//    console.log(randomRotation);
//    this.brick.rotation.y = randomRotation;
    return this.brick;
}

Block.prototype.tick = function() {
    this.brick.rotation.y += 0.02;
}
*/