'use strict'

import Clock from './clock';


class Engine {

  constructor() {
    this.isRunning = false;
    this.fs = null;
    this.vs = null;

    fetch('http://localhost:3000/ge/shaders/cube.fs')
    .then( response => {
      response.text().then( text => {
        this.fs = text;
      });
    });

    fetch('http://localhost:3000/ge/shaders/cube.vs')
    .then( response => {
      response.text().then( text => {
        this.vs = text;
      });
    });
  }

  run(options) {
  }

  start() {
    if (this.fs && this.vs) {
      console.log('started.');
      this.drawScene();
    } else {
      console.log('starting...');
      setTimeout(this.start.bind(this), 1000);
    }
  }

  drawScene() {
    twgl.setDefaults({attribPrefix: "a_"});
        var m4 = twgl.m4;
        var gl = twgl.getWebGLContext(document.getElementById("c"));
        var programInfo = twgl.createProgramInfo(gl, [this.vs, this.fs]);

        var arrays = {
          position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
          normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
          texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
          indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
        };
        var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

        var tex = twgl.createTexture(gl, {
          min: gl.NEAREST,
          mag: gl.NEAREST,
          src: [
            255, 255, 255, 255,
            192, 192, 192, 255,
            192, 192, 192, 255,
            255, 255, 255, 255,
          ],
        });

        var uniforms = {
          u_lightWorldPos: [1, 8, -10],
          u_lightColor: [1, 0.8, 0.8, 1],
          u_ambient: [0, 0, 0, 1],
          u_specular: [1, 1, 1, 1],
          u_shininess: 50,
          u_specularFactor: 1,
          u_diffuse: tex,
        };

        function render(time) {
          time *= 0.001;
          twgl.resizeCanvasToDisplaySize(gl.canvas);
          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

          gl.enable(gl.DEPTH_TEST);
          gl.enable(gl.CULL_FACE);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          var projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 10);
          var eye = [1, 4, -6];
          var target = [0, 0, 0];
          var up = [0, 1, 0];

          var camera = m4.lookAt(eye, target, up);
          var view = m4.inverse(camera);
          var viewProjection = m4.multiply(view, projection);
          var world = m4.rotationY(time);

          uniforms.u_viewInverse = camera;
          uniforms.u_world = world;
          uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
          uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);

          gl.useProgram(programInfo.program);
          twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
          twgl.setUniforms(programInfo, uniforms);
          gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

          requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
  }

  start2() {
    const me = this;
    this.isRunning = true;
    function animate() {
      if (me.isRunning) {
        me.update();
        me.render();
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  stop() {
    me.isRunning = false;
  }

  update() {
    // Placeholder for client updates
  }

  render() {
  }

}

export default Engine;
