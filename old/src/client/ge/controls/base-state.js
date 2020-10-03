import assert from '../../../shared/assert';

class BaseState {
  constructor(controls) {
    assert(() => {
      assert.isOk(controls);
      assert.isOk(controls.game);
    });
    this._controls = controls;
    this._game = controls.game;
    this.keyPressed = null;
    this.mouseClick = null;
    this.mouseDblClick = null;
    this.mouseMove = null;
    this.isLocked = false;
  }
  get controls() {
    return this._controls;
  }
  get game() {
    return this._game;
  }

  get keys() {
    return this.controls.keys;
  }

  get mouseButtons() {
    return this.controls.mouseButtons;
  }

  clear() {
    // Always clear the events
    this.keyPressed = null;
    this.mouseClick = null;
    this.mouseDblClick = null;
    this.mouseMove = null;
  }

  // Empty methods so we can simply call them without checking
  enter() {}
  exit() {}
  doKeyDown() {}
  doKeyUp() {}
  doKeyPress() {}
  doMouseDown() {}
  doMouseUp() {}
  doMouseClick() {}
  doMouseDblClick() {}
  doMouseMove() {}
  doPointerLockChange() {}
  toJSON() {
    return {
      class: this.constructor.name,
      keyPressed: this.keyPressed,
      mouseClick: this.mouseClick,
      mouseDblClick: this.mouseDblClick,
      mouseMove: this.mouseMove,
    };
  }
}

export default BaseState;
