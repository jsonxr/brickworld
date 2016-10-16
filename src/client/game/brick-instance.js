import Bricks from './bricks';


/**
 * Brick loads it's information from a part number.
 */
class BrickInstance {
  constructor(options) {
    this.part = options.part;
    this.template = Bricks[options.part];
    this.position = options.position;
    this.color = new THREE.Color(options.color);
  }

  getBufferGeometry() {
    const _geometry = this.template.geometry.clone();

    const colors = _geometry.attributes.color.array;
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = this.color.r;
      colors[i + 1] = this.color.g;
      colors[i + 2] = this.color.b;
    }

//    _geometry.translate(this.position.x, this.position.y, this.position.z);
    return _geometry;
  }

  // get vertexCount() {
  //   return this.template.geometry.attributes.position.array.length / 3;
  // }

  getStudGeometry() {
    const _studs = this.template.studs.clone();

    const colors = _studs.attributes.color.array;
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = this.color.r;
      colors[i + 1] = this.color.g;
      colors[i + 2] = this.color.b;
    }

//    _studs.translate(this.position.x, this.position.y, this.position.z);
    return _studs;
  }

  getSelectable() {
    return this.getBufferGeometry();
  }

  get geometry() {
    if (!this._geometry) {
      this._geometry = this.getBufferGeometry();
    }
    return this._geometry;
  }

  get outline() {
    if (!this._outline) {
      this._outline = new THREE.EdgesGeometry(this.geometry, 0.1);
    }
    return this._outline;
  }

}

export {
  BrickInstance as default,
}
