'use strict';

import KeyEvents from './key-events';

class CommandState {
  constructor() {
    this.command = '';
  }

  enter(controls) {
    controls.domCommand.input.style.visibility = 'visible';
    controls.domCommand.history.style.visibility = 'visible';
    controls.domCommand.input.focus();
  }
  exit(controls) {
    controls.domCommand.input.style.visibility = 'hidden';
    controls.domCommand.history.style.visibility = 'hidden';
  }

  update(controls, delta) {
    const keyPressed = controls.keyPressed;
    const input = controls.domCommand.input;
    if (keyPressed === '/') {
      const index = input.value.lastIndexOf('/');
      if (index >= 0) {
        input.value = input.value.substring(0, index);
      }
      return null; // Pop state
    } else {
      if (controls.keys[KeyEvents.DOM_VK_ENTER] || controls.keys[KeyEvents.DOM_VK_RETURN]) {
        this.command = input.value.trim();
        input.value = '';
        if (this.command) {
          controls.execute(this.command);
        }
        return null;
      }
    }
  }
}

export default CommandState;
