'use strict';

import KeyEvents from './key-events';
import BaseState from './base-state';

class CommandState extends BaseState {
  constructor(controls) {
    super(controls);
    this.input = document.getElementById('command');
    this.history = document.getElementById('commandhistory');
    this.command = '';
    //this.isLocked = true;
  }

  enter() {
    this.input.style.visibility = 'visible';
    this.history.style.visibility = 'visible';
    this.input.focus();
  }
  exit() {
    this.input.style.visibility = 'hidden';
    this.history.style.visibility = 'hidden';
  }

  update() {
    const keyPressed = this.keyPressed;
    const keys = this.keys;

    const input = this.input;
    if (keyPressed && keyPressed.key === '/') {
      const index = input.value.lastIndexOf('/');
      if (index >= 0) {
        input.value = input.value.substring(0, index);
      }
      return null; // Pop state
    } else {
      if (keys[KeyEvents.DOM_VK_ENTER] || keys[KeyEvents.DOM_VK_RETURN]) {
        this.command = input.value.trim();
        input.value = '';
        if (this.command) {
          this.game.execute(this.command);
        }
        return null; // Pop state
      }
    }
  }
}

export default CommandState;
