class FirstPersonControls {
  constructor(camera) {
    this.velocity = new THREE.Vector3();
    this.speed = 293;
    this.jumpSpeed = 350;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;

    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this.moveForward = true;
          break;
        case 37: // left
        case 65: // a
          this.moveLeft = true;
          break;
        case 40: // down
        case 83: // s
          this.moveBackward = true;
          break;
        case 39: // right
        case 68: // d
          this.moveRight = true;
          break;
        case 33:
          this.moveUp = true;
          break;
        case 34:
          this.moveDown = true;
          break;
        case 32: // space
          if (this.canJump === true) {
            this.velocity.y += this.jumpSpeed;
          }
          this.canJump = false;
          break;
      }
    }, false);

    document.addEventListener('keyup', event => {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this.moveForward = false;
          break;
        case 37: // left
        case 65: // a
          this.moveLeft = false;
          break;
        case 40: // down
        case 83: // s
          this.moveBackward = false;
          break;
        case 39: // right
        case 68: // d
          this.moveRight = false;
          break;
        case 33:
          this.moveUp = false;
          break;
        case 34:
          this.moveDown = false;
          break;
      }
    }, false);

    this.controls = new THREE.PointerLockControls(camera);
    this.controls.enabled = false;
  }

  //----------------
  // position
  //----------------
  get position() {
    return this.controls.getObject().position;
  }

  set position(vec) {
    this.controls.getObject().position.set(vec.x, vec.y, vec.z);
  }

  //----------------
  // enabled
  //----------------
  get enabled() {
    return this.controls.enabled;
  }

  set enabled(value) {
    this.controls.enabled = value;
  }

  getObject() {
    return this.controls.getObject();
  }

  update(delta) {
    if (this.enabled) {

      // this.velocity.x -= this.velocity.x * 10.0 * delta;
      // this.velocity.z -= this.velocity.z * 10.0 * delta;

      // Gravity...
      // this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      if (this.moveForward) this.velocity.z = -this.speed;// * delta;
      if (this.moveBackward) this.velocity.z = this.speed;// * delta;
      if (!this.moveForward && !this.moveBackward) this.velocity.z = 0;

      if (this.moveLeft) this.velocity.x = -this.speed;//  * delta;
      if (this.moveRight) this.velocity.x = this.speed;//  * delta;
      if (!this.moveLeft && !this.moveRight) this.velocity.x = 0;

      if (this.moveUp) this.velocity.y = this.speed / 10;
      if (this.moveDown) this.velocity.y = -this.speed / 10;
      if (!this.moveUp && !this.moveDown) this.velocity.y = 0;

      // if (isOnObject === true) {
      //   velocity.y = Math.max(0, velocity.y);
      //
      //   canJump = true;
      // }

      this.controls.getObject().translateX(this.velocity.x * delta);
      this.controls.getObject().translateY(this.velocity.y * delta);
      this.controls.getObject().translateZ(this.velocity.z * delta);

      // if (controls.getObject().position.y < 10) {
      //
      //   velocity.y = 0;
      //   controls.getObject().position.y = 10;
      //
      //   canJump = true;
      //
      // }
    }
  }
}

export default FirstPersonControls;
