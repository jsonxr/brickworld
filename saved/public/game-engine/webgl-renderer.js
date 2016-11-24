import WebGLUtils from './webgl-utils';
import settings from './settings';

class WebGLRenderer {

  constructor(options) {
    let me = this;
    me.canvas = options.canvas;
    me.debug = options.debug !== undefined ? options.debug : false;
    me.shaders = [];
    me.programs = [];
  }

  init() {
    console.log('WebGLRenderer.init()')

    let me = this;
    let gl = me.gl = me.canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    function loadShader(name, type, src) {
      return new Promise(function (resolve) {
        WebGLUtils.loadShader(gl, type, src)
          .then(function (shader) {
            console.log(name + ' shader: ' + shader)
            me.shaders[name] = shader;
            resolve()
          })
      });
    }

    return new Promise(function (resolve, reject) {
      return Promise.all([
        loadShader('v', gl.VERTEX_SHADER, settings.LIBRARY_PATH + '/shaders/vertex.c'),
        loadShader('f', gl.FRAGMENT_SHADER, settings.LIBRARY_PATH + '/shaders/fragment.c')
      ]).then(function () {
        console.log('program...');
        me.programs.points = WebGLUtils.createProgram(gl, me.shaders['v'], me.shaders['f']);
        resolve();
      });
    });

  }

}

export default WebGLRenderer;
