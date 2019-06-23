import KeyEvents from './key-events';
import BaseState from './base-state';
import CommandState from './command-state';
import InventoryState from './inventory-state';
import { Vector3 } from 'three';

class MovementState extends BaseState {
  constructor(controls) {
    super(controls);
    this.isLocked = true;

    this.velocity = new Vector3();
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

  enter() {
    console.log('movement-state.enter()');
    //this.controls.pointerLock();
    this._captureInput = true;
    this.game.highlight.enabled = true;
  }
  exit() {
    console.log('movement-state.exit()');
    this.game.highlight.enabled = false;
    this._captureInput = false;
    //this.controls.pointerUnlock();
  }

  doMouseMove(event) {
    this.controls.rotateXY(event.movementX * 0.002, event.movementY * 0.002);
  }

  doPointerLockChange(event) {
    console.log('movement-state: pointerChange: ', this.controls.isPointerLocked);
    if (this.controls.isPointerLocked) {
      this._captureInput = true;
    } else {
      this._captureInput = false;
    }
  }

  update(delta) {
    if (!this._captureInput) {
      console.log('not capturing input!\n\n\n');
      return null; // Go back since we are no longer capturing input...
    }

    const controls = this.controls;
    const keyPressed = this.keyPressed;
    const keys = this.keys;

    if (keyPressed) {
      if (keyPressed.key === '/') {
        return new CommandState(this);
      } else if (keyPressed.key.toLowerCase() === 'e') {
        return new InventoryState(this.controls);

        // if (this.controls.isPointerLocked) {
        //   this.controls.pointerUnlock();
        // } else {
        //   console.log('lock pointer!!!!');
        //   this.controls.pointerLock();
        // }
      }
    }

    this.moveForward = keys[KeyEvents.DOM_VK_W] || keys[KeyEvents.DOM_VK_UP];
    this.moveLeft = keys[KeyEvents.DOM_VK_LEFT] || keys[KeyEvents.DOM_VK_A];
    this.moveBackward = keys[KeyEvents.DOM_VK_DOWN] || keys[KeyEvents.DOM_VK_S];
    this.moveRight = keys[KeyEvents.DOM_VK_RIGHT] || keys[KeyEvents.DOM_VK_D];
    this.moveUp = keys[KeyEvents.DOM_VK_PAGE_UP] || keys[KeyEvents.DOM_VK_Q];
    this.moveDown = keys[KeyEvents.DOM_VK_PAGE_DOWN] || keys[KeyEvents.DOM_VK_Z];
    controls.mouseLeft = controls.mouseButtons[0];
    controls.mouseMiddle = controls.mouseButtons[1];
    controls.mouseRight = controls.mouseButtons[2];

    if (this.moveForward) this.velocity.z = -this.speed; // * delta;
    if (this.moveBackward) this.velocity.z = this.speed; // * delta;
    if (!this.moveForward && !this.moveBackward) this.velocity.z = 0;

    if (this.moveLeft) this.velocity.x = -this.speed; //  * delta;
    if (this.moveRight) this.velocity.x = this.speed; //  * delta;
    if (!this.moveLeft && !this.moveRight) this.velocity.x = 0;

    if (this.moveUp) this.velocity.y = this.speed;
    if (this.moveDown) this.velocity.y = -this.speed;
    if (!this.moveUp && !this.moveDown) this.velocity.y = 0;

    controls.translateX(this.velocity.x * delta);
    controls.translateY(this.velocity.y * delta);
    controls.translateZ(this.velocity.z * delta);
  }
}

export default MovementState;
