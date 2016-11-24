import WebGLUtils from './webgl-utils';
import settings from './settings';

class Material {
  constructor() {
    this.program = null;
  }

  load() {
    let me = this;
    WebGLUtils.createProgram({
      vertex: settings.LIBRARY_PATH + '/shaders/vertex.c',
      fragment: settings.LIBRARY_PATH + '/shaders/fragment.c'
    }).then(function (program) {
        me.program = program;
    });
  }

  isReady() {
    let me = this;
    return (me.program !== null);
  }
}

export default Material;
