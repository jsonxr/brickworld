'use strict';

import BaseState from './base-state';
import MovementState from './movement-state';


class InitialState extends BaseState {
  constructor(controls) {
    super(controls);
    this.isLocked = false;
    this.click = null;
    this.movementState = new MovementState(controls);
  }

  enter() {
    console.log('InitialState.enter');
    this._onClick = this.doClickUi.bind(this);
    this.game.ui.addEventListener('click', this._onClick, false);
  }
  exit() {
    console.log('InitialState.exit');
    this.game.ui.removeEventListener('click', this._onClick);
  }
  doClickUi(event) {
    console.log('InitialState.doClickUi', event);
    this.click = event;
    // Need to do this here since initial pointerLock must be triggered by an event
    this.controls.pointerLock();
  }

  clear() {
    super.clear();
    this.click = false;
  }

  update() {
    if (this.click) {
      console.log('switching to movement state');
      return this.movementState;
    }
  }
}

export default InitialState;
