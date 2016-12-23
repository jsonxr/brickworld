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
    let enter = false;
    if (controls.keys[KeyEvents.DOM_VK_ENTER] || controls.keys[KeyEvents.DOM_VK_RETURN]) {
      enter = true;
      //this.command = controls.keyPresses;
      this.command = controls.domCommand.input.value.trim();
      controls.domCommand.input.value = '';
      controls.clearKeyPresses();
    } else {
      //controls.domCommand.value = controls.keyPresses;
    }

    if (enter) {
      if (this.command) {
        controls.execute(this.command);
      }
      return null;
    }
  }
}

export default CommandState;
