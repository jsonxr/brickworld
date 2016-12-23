import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Vector3,
  VertexColors
} from 'three';

/**
 * @memberOf client/ge
 */
class Cursor3d extends LineSegments {
  /**
   *
   * @param camera
   * @param {number} distance=100
   */
  constructor(camera, options = {}) {
    const size = options.size || 3;
    const distance = options.distance || 100;

    // Stolen from THREE.AxisHelper so we can customize line width
    const vertices = [
      0, 0, 0,  size, 0, 0,
      0, 0, 0,  0, size, 0,
      0, 0, 0,  0, 0, size
    ];

    const colors = [
      1, 0, 0,  1, 0.6, 0,
      0, 1, 0,  0.6, 1, 0,
      0, 0, 1,  0, 0.6, 1
    ];

    const geometry = new BufferGeometry();
    geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

    const material = new LineBasicMaterial( {
      linewidth: 3,
      vertexColors: VertexColors
    });
    super(geometry, material );

    this.name = 'Cursor3d';
    this._camera = camera;
    this._distance = distance;
  }

  /**
   *
   */
  update() {
    const zCamVec = new Vector3(0, 0, -this._distance); // 100 units away from camera
    const position = this._camera.localToWorld(zCamVec);
    this.position.set(position.x, position.y, position.z);
  }

}

export default Cursor3d;
