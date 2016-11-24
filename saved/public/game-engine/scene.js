class Scene {
  constructor() {
    let me = this;
    me.meshList = [];
  }

  add(mesh) {
    let me = this;
    me.meshList.push(mesh);
  }

  get meshes() {
    return this.meshList;
  }
}

export default Scene;
