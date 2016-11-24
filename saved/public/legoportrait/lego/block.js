var legoScale = 3.2;// 5/16" = 1'
var personHeight = (1 + 9/16.0) * legoScale;
var eyeHeight = (1 + 3/8.0) * legoScale;
var blockHeight = (1/8.0) * legoScale;
var blockWidth = (5/16.0) * legoScale;
var studHeight = (1/16.0) * legoScale;
var studWidth = (3/16.0) * legoScale;
var studRadius = (studWidth ) / 2.0;
var studFaces = 12;
var blockGap = (1/512) * legoScale;

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
    var geometry = new THREE.CubeGeometry(blockWidth*this.width - blockGap, blockHeight * this.height, blockWidth*this.length - blockGap);
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
