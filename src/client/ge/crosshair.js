/**
 * @memberOf client/ge
 */
class Crosshair extends THREE.AxisHelper {
  /**
   *
   * @param camera
   * @param {number} distance=100
   */
  constructor(camera, distance = 100) {
    super(5);
    this._camera = camera;
    this._distance = distance;
  }

  /**
   *
   */
  update() {
    const zCamVec = new THREE.Vector3(0, 0, -this._distance); // 100 units away from camera
    const position = this._camera.localToWorld(zCamVec);
    this.position.set(position.x, position.y, position.z);
  }

}

export default Crosshair;
