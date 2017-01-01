'use strict';

const HALF_PI = Math.PI / 2;
const debug = console;

class PointerLockControl extends THREE.Object3D {

  constructor(camera) {
    super();
    this.name = 'PointerLockControl';
    // Camera is child of pitch
    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.position.y = 10;
    // Pitch is child of the yaw object
    this.add(this.pitchObject);
    this.enabled = false;
    this.onMouseMove = this.doMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  doMouseMove(event) {
    if (this.enabled === false) return;
    this.rotation.y -= event.movementX * 0.002;
    this.pitchObject.rotation.x -= event.movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitchObject.rotation.x));
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove, false);
  }
}

/**
 * Controls while in web browser full screen mode.
 */
class FirstPersonControl extends PointerLockControl {

  /**
   *
   * @memberOf client/ge
   * @param camera
   */
  constructor(camera) {
    super(camera);
    this.name = 'FirstPersonControl';
    this.velocity = new THREE.Vector3();
    this.speed = 293;
    this.jumpSpeed = 350;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    this.mouseLeft = false;
    this.mouseMiddle = false;
    this.mouseRight = false;

    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      switch (event.keyCode) {
      case 9:
        this.tab = true;
        break;
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
      case 33:
        this.moveUp = true;
        break;
      case 34:
        this.moveDown = true;
        break;
      case 32: // space
        if (this.canJump === true) {
          this.velocity.y += this.jumpSpeed;
        }
        this.canJump = false;
        break;
      default:
        break;
      }
    }, false);

    document.addEventListener('keyup', (event) => {
      event.preventDefault();
      switch (event.keyCode) {
      case 9:
        this.tab = false;
        break;
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
      case 33: // pg-up
        this.moveUp = false;
        break;
      case 34: // pg-down
        this.moveDown = false;
        break;
      default:
        break;
      }
    }, false);

    window.addEventListener('mousedown', (event) => {
      event.preventDefault();
      switch (event.button) {
      case 1:
        this.mouseLeft = true;
        break;
      case 2:
        this.mouseMiddle = true;
        break;
      case 3:
        this.mouseRight = true;
        break;
      default:
        debug.log('??? mousedown: ', event);
      }
      return false;
    }, false);

    window.addEventListener('mouseup', (event) => {
      event.preventDefault();
      switch (event.which) {
      case 1:
        this.mouseLeft = false;
        break;
      case 2:
        this.mouseMiddle = false;
        break;
      case 3:
        this.mouseRight = false;
        break;
      default:
        debug.log('??? mouseup: ', event);
      }
      return false;
    }, false);

    this.enabled = false;
  }

  /**
   *
   * @param delta
   */
  update(delta) {
    if (this.enabled) {
      // this.velocity.x -= this.velocity.x * 10.0 * delta;
      // this.velocity.z -= this.velocity.z * 10.0 * delta;

      // Gravity...
      // this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      if (this.moveForward) this.velocity.z = -this.speed;// * delta;
      if (this.moveBackward) this.velocity.z = this.speed;// * delta;
      if (!this.moveForward && !this.moveBackward) this.velocity.z = 0;

      if (this.moveLeft) this.velocity.x = -this.speed;//  * delta;
      if (this.moveRight) this.velocity.x = this.speed;//  * delta;
      if (!this.moveLeft && !this.moveRight) this.velocity.x = 0;

      if (this.moveUp) this.velocity.y = this.speed;
      if (this.moveDown) this.velocity.y = -this.speed;
      if (!this.moveUp && !this.moveDown) this.velocity.y = 0;

      // if (isOnObject === true) {
      //   velocity.y = Math.max(0, velocity.y);
      //
      //   canJump = true;
      // }

      this.translateX(this.velocity.x * delta);
      this.translateY(this.velocity.y * delta);
      this.translateZ(this.velocity.z * delta);

      // if (controls.getObject().position.y < 10) {
      //
      //   velocity.y = 0;
      //   controls.getObject().position.y = 10;
      //
      //   canJump = true;
      //
      // }
    }
  }
}

export default FirstPersonControl;
export {
  PointerLockControl,
  FirstPersonControl
};
