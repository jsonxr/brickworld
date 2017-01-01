'use strict';

import KeyEvents from './key-events';
import CommandState from './command-state';

class StandardState {
  constructor() {
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
  }

  enter() { }
  exit() { }

  update(controls, delta) {
    const keyPressed = controls.keyPressed;
    if (keyPressed === '/') {
      return new CommandState();
    }
    this.moveForward = (controls.keys[KeyEvents.DOM_VK_W] || controls.keys[KeyEvents.DOM_VK_UP]);
    this.moveLeft = (controls.keys[KeyEvents.DOM_VK_LEFT] || controls.keys[KeyEvents.DOM_VK_A]);
    this.moveBackward = (controls.keys[KeyEvents.DOM_VK_DOWN] || controls.keys[KeyEvents.DOM_VK_S]);
    this.moveRight = (controls.keys[KeyEvents.DOM_VK_RIGHT] || controls.keys[KeyEvents.DOM_VK_D]);
    this.moveUp = (controls.keys[KeyEvents.DOM_VK_PAGE_UP] || controls.keys[KeyEvents.DOM_VK_Q]);
    this.moveDown = (controls.keys[KeyEvents.DOM_VK_PAGE_DOWN] || controls.keys[KeyEvents.DOM_VK_Z]);
    controls.mouseLeft = (controls.mouseButtons[0]);
    controls.mouseMiddle = (controls.mouseButtons[1]);
    controls.mouseRight = (controls.mouseButtons[2]);

    if (this.moveForward) this.velocity.z = -this.speed;// * delta;
    if (this.moveBackward) this.velocity.z = this.speed;// * delta;
    if (!this.moveForward && !this.moveBackward) this.velocity.z = 0;

    if (this.moveLeft) this.velocity.x = -this.speed;//  * delta;
    if (this.moveRight) this.velocity.x = this.speed;//  * delta;
    if (!this.moveLeft && !this.moveRight) this.velocity.x = 0;

    if (this.moveUp) this.velocity.y = this.speed;
    if (this.moveDown) this.velocity.y = -this.speed;
    if (!this.moveUp && !this.moveDown) this.velocity.y = 0;

    controls.translateX(this.velocity.x * delta);
    controls.translateY(this.velocity.y * delta);
    controls.translateZ(this.velocity.z * delta);
  }
}

export default StandardState;
