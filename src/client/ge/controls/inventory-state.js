import ReactDom from 'react-dom';
import BaseState from './base-state';
import Inventory from '../../ui/inventory';
//import Clock from '../../ui/clock';


class InventoryState extends BaseState {
  constructor(controls) {
    super(controls);
    this.isLocked = false;
    this.inventory = document.getElementById('inventory');
    //Clock();
    //Inventory();
    ReactDom.render(
      <Inventory/>, this.inventory
    );
    //InventoryUi(document.getElementById('inventory'));
    // this.history = document.getElementById('commandhistory');
  }

  enter() {
    // this.input.style.visibility = 'visible';
    // this.history.style.visibility = 'visible';
    // this.input.focus();
    this._savedPointerLock = this.controls.isPointerLocked;
    if (this._savedPointerLock) {
      this.controls.pointerUnlock();
    }
    this.inventory.style.visibility = 'visible';
  }
  exit() {
    if (this._savedPointerLock) {
      this.controls.pointerLock();
    }
    this.inventory.style.visibility = 'hidden';
    // this.input.style.visibility = 'hidden';
    // this.history.style.visibility = 'hidden';
  }

  update() {
    const keyPressed = this.keyPressed;
    if (keyPressed && keyPressed.key === 'e') {
      return null; // Pop state
    }
  }
}

export default InventoryState;
