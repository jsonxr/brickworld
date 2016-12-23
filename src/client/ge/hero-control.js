import { PointerLockControl } from './first-person-controls';
import StandardState from './input-states/standard-state';
import KeyEvents from './input-states/key-events';

// http://gameprogrammingpatterns.com/state.html

const HALF_PI = Math.PI / 2;

class HeroControl extends PointerLockControl {

  /**
   *
   * @param camera
   */
  constructor(game) {
    super(game.camera);
    this._game = game;
    this._states = [new StandardState()];
    this._keys = [];
    this._mouseButtons = [];
    this._keyPresses = '';
    // KeyDown
    this._onKeyDown = this.doKeyDown.bind(this);
    window.addEventListener('keydown', this._onKeyDown, false);
    // KeyUp
    this._onKeyUp = this.doKeyUp.bind(this);
    window.addEventListener('keyup', this._onKeyUp, false);
    // KeyPress
    this._onKeyPress = this.doKeyPress.bind(this);
    window.addEventListener('keypress', this._onKeyPress, false);
    // MouseDown
    this._onMouseDown = this.doMouseDown.bind(this);
    window.addEventListener('mousedown', this._onMouseDown, false);
    // MouseUp
    this._onMouseUp = this.doMouseUp.bind(this);
    window.addEventListener('mouseup', this._onMouseUp, false);
    // MouseMove
    this._onMouseMove = this.doMouseMove2.bind(this);
    window.addEventListener('mousemove', this._onMouseMove, false); // was document.addEventListener...
    this._state = new StandardState();
  }

  doKeyDown(event) {
    // Prevent TAB character because it messes with focus
    if (event.keyCode === KeyEvents.DOM_VK_TAB) {
      event.preventDefault();
    }
    this._keys[event.keyCode] = true;
  }

  doKeyUp(event) {
    //event.preventDefault();
    delete this._keys[event.keyCode];
  }

  doKeyPress(event) {
    // Do nothing
    if (event.key && event.key.length === 1) {
      this._keyPresses += event.key;
    }
  }

  doMouseDown(event) {
    event.preventDefault();
    this._mouseButtons[event.button] = true;
  }

  doMouseUp(event) {
    event.preventDefault();
    delete this._mouseButtons[event.button];
  }

  doMouseMove2(event) {
    event.preventDefault();
    if (this.enabled === false) return;
    this.rotation.y -= event.movementX * 0.002;
    this.pitchObject.rotation.x -= event.movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitchObject.rotation.x));
  }

  get keys() {
    return this._keys;
  }

  get mouseButtons() {
    return this._mouseButtons;
  }

  clearKeyPresses() {
    this._keyPresses = '';
  }

  get keyPresses() {
    return this._keyPresses;
  }

  update(delta) {
    const state = this._states[this._states.length - 1];
    const nextState = state.update(this, delta);
    if (nextState === null) {
      state.exit(this);
      this._states.pop(); // Throw away old state
    } else if (nextState) {
      nextState.enter(this);
      this._states.push(nextState);
    }
  }

  execute(command) {
    this._game.execute(command);
  }
}

export default HeroControl;
