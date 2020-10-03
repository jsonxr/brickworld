import { Object3D } from 'three';
import assert from '../../../shared/assert';
import InitialState from './initial-state';
import KeyEvents from './key-events';

// http://gameprogrammingpatterns.com/state.html

const HALF_PI = Math.PI / 2;

class HeroControl extends Object3D {
  /**
   *
   * @param camera
   */
  constructor(game) {
    super();
    this._game = game;
    this.name = 'PointerLockControl';

    this._pitch = new Object3D();
    this._pitch.add(game.camera); // Camera is child of pitch
    this.add(this._pitch); // Pitch is child of the yaw object

    this._states = [new InitialState(this)];
    this._states[0].enter(this);

    this.keys = [];
    this.mouseButtons = [];
    // // When user clicks the UI, go into fullscreen mode
    // this._ui.addEventListener('click', this.requestFullscreen.bind(this), false);

    // Keyboard Events
    window.addEventListener('keydown', this.doKeyDown.bind(this), false);
    window.addEventListener('keyup', this.doKeyUp.bind(this), false);
    window.addEventListener('keypress', this.doKeyPress.bind(this), false);
    // MouseEvents
    window.addEventListener('mousedown', this.doMouseDown.bind(this), false);
    window.addEventListener('mouseup', this.doMouseUp.bind(this), false);
    window.addEventListener('mousemove', this.doMouseMove.bind(this), false); // was document
    window.addEventListener('click', this.doMouseClick.bind(this), false);
    window.addEventListener('dblclick', this.doMouseDblClick.bind(this), false);

    window.addEventListener('focus', this.doFocus.bind(this), false);
    window.addEventListener('blur', this.doBlur.bind(this), false);

    document.addEventListener('pointerlockchange', this.doPointerLockChange.bind(this), true);

    document.addEventListener('fullscreenchange', this.doFullscreenChange.bind(this), false);
    _fullscreenPolyfill(this.game.ui, this.doFullscreenChange.bind(this));
  }

  doFocus(event) {}
  doBlur(event) {}
  get game() {
    return this._game;
  }

  doKeyDown(event) {
    // Prevent TAB character because it messes with focus
    if (event.keyCode === KeyEvents.DOM_VK_TAB || event.keyCode === [KeyEvents.DOM_VK_SLASH]) {
      event.preventDefault();
    }
    this.keys[event.keyCode] = true;
    this.state.doKeyDown(event);
  }

  doKeyUp(event) {
    if (event.keyCode === KeyEvents.DOM_VK_TAB || event.keyCode === [KeyEvents.DOM_VK_SLASH]) {
      event.preventDefault();
    }
    //event.preventDefault();
    delete this.keys[event.keyCode];
    this.state.doKeyUp(event);
  }

  doKeyPress(event) {
    if (event.keyCode === KeyEvents.DOM_VK_TAB || event.keyCode === [KeyEvents.DOM_VK_SLASH]) {
      event.preventDefault();
    }
    this.state.keyPressed = event;
    this.state.doKeyPress(event);
  }

  doMouseDown(event) {
    event.preventDefault();
    this.mouseButtons[event.button] = true;
    this.state.doMouseDown(event);
  }

  doMouseUp(event) {
    event.preventDefault();
    delete this.mouseButtons[event.button];
    this.state.doMouseUp(event);
  }

  doMouseClick(event) {
    event.preventDefault();
    this.state.mouseClick = event;
    this.state.doMouseClick(event);
  }

  doMouseDblClick(event) {
    event.preventDefault();
    this.state.mouseDblClick = event;
    this.state.doMouseDblClick(event);
  }

  doMouseMove(event) {
    event.preventDefault();
    this.state.mouseMove = event;
    this.state.doMouseMove(event);
  }

  // Pointer Lock API
  get isPointerLocked() {
    return document.pointerLockElement;
  }

  pointerLock() {
    console.log('pointer-lock-requested');
    this.game.ui.requestPointerLock();
  }

  pointerUnlock() {
    document.exitPointerLock();
  }

  doPointerLockChange(event) {
    console.log('doPointerLockChange', this.state, event);
    this.state.doPointerLockChange(event);
  }

  // Fullscreen API
  doFullscreenChange(event) {
    // const element = document.fullscreenElement ||
    //   document.webkitFullscreenElement ||
    //   document.mozFullScreenElement ||
    //   document.msFullscreenElement;
    // this.onWindowResize();
    // if (this.focused && element) {
    //   //document.body.className = 'focused';
    //   element.requestPointerLock();
    //   this.controls.enabled = true;
    //   this._highlight.enabled = true;
    // } else {
    //   //document.body.className = 'blurred';
    //   this.controls.enabled = false;
    //   this._highlight.enabled = false;
    // }
  }

  rotateXY(x, y) {
    this.rotation.y -= x;
    this._pitch.rotation.x -= y;
    this._pitch.rotation.x = Math.max(-HALF_PI, Math.min(HALF_PI, this._pitch.rotation.x));
  }

  get state() {
    return this._states[this._states.length - 1];
  }

  exitState(state) {
    state.exit();
  }

  enterState(state) {
    state.clear();
    state.enter();
    if (state.isLocked) {
      this.pointerLock();
    } else {
      this.pointerUnlock();
    }
  }

  update(delta) {
    const nextState = this.state.update(delta);
    this.state.clear(); // Clear the captured button presses and mouse clicks
    if (nextState === null) {
      this.exitState(this.state); //this.state.exit();
      this._states.pop();
      this.enterState(this.state);
    } else if (nextState && nextState !== this.state) {
      // If returned a state that is not current
      this.exitState(this.state);
      this._states.push(nextState);
      this.enterState(this.state);
    } // else stay on current state
  }

  execute(command) {
    this._game.execute(command);
  }
}

function _fullscreenPolyfill(ui, fn) {
  ui.requestFullscreen =
    ui.requestFullscreen ||
    ui.webkitRequestFullscreen || // Polyfill
    ui.msRequestFullscreen || // Polyfill
    ui.mozRequestFullScreen; // Polyfill
  // Polyfills for fullscreen api. When this is fully supported, these below are not necessary
  document.addEventListener('webkitfullscreenchange', fn);
  document.addEventListener('msfullscreenchange', fn);
  document.addEventListener('mozfullscreenchange', fn);
}

assert.wrap(HeroControl.prototype, 'update', function(delta) {
  assert.isOk(this.state);
});

export default HeroControl;
