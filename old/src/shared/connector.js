class Connector {
  constructor(options) {
    this.id = options.id || 'stud';
    this.orientation = options.orientation || null;
    this.positions = options.positions || [];
  }

  toJSON() {
    const json = {
      type: this.type,
      positions: this.positions,
    };
    if (this.orientation) {
      json.orientation = this.orientation;
    }
  }
}

export default Connector;
