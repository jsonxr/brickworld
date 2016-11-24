import { httpGet } from './http-utils';


let WebGLUtils = {};


function _getShaderType(gl, type) {
  if (type === gl.VERTEX_SHADER) {
    return 'VERTEX_SHADER';
  } else if (type === gl.FRAGMENT_SHADER) {
    return 'FRAGMENT_SHADER';
  } else {
    return type;
  }
};

WebGLUtils.createProgram = function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    let error = gl.getProgramInfoLog(program);
    console.error('Failed to link program: ' + error);
    gl.deleteProgram(program);
  }
  console.log('returning program' + program)
  return program;
};

WebGLUtils.loadShader = function loadShader(gl, type, src) {
  console.log('WebGLRenderer.loadShader(' + _getShaderType(gl, type) + ',' +
      src + ')');
  return new Promise(function (resolve, reject) {
    httpGet(src).then(function (text) {
      try {
        let shader = WebGLUtils.compileShader(gl, type, text);
        resolve(shader);
      } catch(err) {
        console.error(err);
        reject(err);
      }
    }, function (err) {
      console.error(err);
      reject(err);
    });
  });
};

WebGLUtils.compileShader = function compileShader(gl, type, sourceCode) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (! compiled) {
    var error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Failed to compile shader: ' + error);
  }
  console.log('shader!!!!')
  console.log(shader);
  return shader;
};


export default WebGLUtils;
