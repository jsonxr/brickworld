import Engine from './game-engine/engine';
// Required for all apps
import Material from './game-engine/material';
import Mesh from './game-engine/mesh';
// Geometry
import BrickGeometry from './game-engine/brick-geometry';

let game = new Engine('canvas');

// Scene
var brickGeometry = new BrickGeometry();
var material = new Material();
var mesh = new Mesh(brickGeometry, material);
game.scene.add(mesh);

game.ontick = function (delta) {
};

game.start();
