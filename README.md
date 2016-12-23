brickworld
==============

This is an attempt to make a world composed of building bricks, playable in a browser. Users can share their creations easily.  Users can share objects like furnature, vehicles, etc through instruction books. Users can share sections of their world that other users can then import into their own world.


Desired Features:

* Runs in the browser for zero friction playing
* Plugins written in javascript, assets bundled as a zip file
* Plugins run in a sandbox so 3rd party content can't hose your world
* Seemlessly move between 3rd party servers.  Similar to following a link in a browser.
* Ability to connect worlds to larger worlds.
* Safe experience for kids to play.

Technical:

* WebGL - Render in browsers
* javacript es6 - modern javascript!
* node 7.2 - modern javascript on server
* Cassandra - Distributed fault tolerant database

Technologies not implemented in all browsers:

# Required Browser Features
| Feature           |                                                  |
| ----------------- |:-------------------------------------------------|
| es2015            | Use only modern javascript                       |
| Fullscreen API    | Used for desktop support of games                |
| Pointer Lock      | Lock the mouse so can support looking            |

# Desired Browser Features
| Feature           |                                                  |
| ----------------- |:-------------------------------------------------|
| SharedBufferArray | Used to share memory between workers and UI      |
| Atomics           | Needed to lock writes to shared memory           |
| IndexedDB         | Use to cache models and chunks                   |
| SIMD              | Speed up vector operations                       |
| Webgl2            | http://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html#Vertex-Array-Objects |
| WebRTC            |                                                  |
| WebSocket         |                                                  |
| WebAssembly       |                                                  |
| XHR2              | Download binary objects                          |

# Browser Support
| Feature           | Chrome   | Firefox  | Edge     | Safari   |
| ----------------- |:--------:|:--------:|:--------:|:--------:|
| es2015            | Y        | Y        | ?        | ?        |
| Atomics           | flag     | flag     | N        | N        |
| Fullscreen API    | Y        | Y        | ?        | ?        |
| IndexedDB         | 24       | 37       |          | 10       |
| Pointer Lock      | Y        | Y        | ?        | ?        |
| SharedBufferArray | flag     | flag     | N        | N        |
| SIMD              | N        | Nightly  | Nightly  | ?        |
| Webgl2            | flag     | 51       | ?        | ?        |
| WebRTC            | Y        | Y        | ?        | ?        |
| WebSocket         | Y        | Y        | ?        | ?        |
| WebAssembly       | ?        | ?        | ?        | ?        |
| XHR2              |          |          |          |          |

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
* https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
* https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
* https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
* http://webassembly.org/
* https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
* https://www.npmjs.com/package/datachannel.io - signaling server for webrtc
* http://peerjs.com/docs/#start - peerjs for webrtc
* https://www.amazon.com/WebRTC-RTCWEB-Protocols-HTML5-Real-Time-ebook/dp/B00IZNUP22 - book webrtc
* https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API#Browser_compatibility - IndexedDB
* https://www.html5rocks.com/en/tutorials/file/xhr2/

Chrome:

    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --js-flags=--harmony-sharedarraybuffer --enable-blink-feature=SharedArrayBuffer --enable-unsafe-es3-apis

Resources:

* Three.js examples - http://stemkoski.github.io/Three.js/
* three.js game extensions - http://www.threejsgames.com/extensions/
* Static Memory Javascript - http://www.html5rocks.com/en/tutorials/speed/static-mem-pools/
* Comparing colors - http://stackoverflow.com/questions/4057475/rounding-colour-values-to-the-nearest-of-a-small-set-of-colours
  https://github.com/dtao/nearest-color
  https://github.com/markusn/color-diff <- This one is probably best!
* https://twgljs.org/
* SIMD - Make matrix operations much faster.
    https://hacks.mozilla.org/2014/10/introducing-simd-js/
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD
    * Firefox: Nightly
    * Chrome: Intent to implement
    * Microsoft: In development
    * Safari: ?
* Shared Array Buffers - Ability to share memory between main thread and workers. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
* Benchmark for js matrix libraries - http://stepheneb.github.io/webgl-matrix-benchmarks/matrix_benchmark.html

* https://medium.com/javascript-and-opinions/state-of-the-art-javascript-in-2016-ab67fc68eb0b#.59xwjq5b4
* https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
* https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/Building_up_a_basic_demo_with_PlayCanvas/engine

* http://forums.ldraw.org/archive/index.php?thread-15870.html - json ldraw file format discussion
* http://forums.ldraw.org/showthread.php?tid=14432&pid=14432#pid14432 - new ldraw file format discussion
* http://webglstats.com/

* BufferAttributes memory layout - https://github.com/mrdoob/three.js/issues/6877 arrays interleved or not. dynamic or not.
* Cylinder UV - http://stackoverflow.com/questions/8315546/texturing-a-cylinder-in-three-js

* Imposters, skyboxes rendering node side... https://github.com/mrdoob/three.js/issues/7085

# running


Supported Browsers: Chrome, FireFox

As of this writing, Safari is not supported as it has poor support of es6. Could be supported if we enabled es6->es5 transpiling. If this ever gets completed, I would be surprised if Safari didn't support es6 as it has been ratified for a while now.

    npm start


# npm libraries


  * "express": "^4.14.0" - Node web server framework
  * "gl-matrix": "^2.3.2" - Enables matrix, vector math on client
  * "ldraw": "^0.1.1", - Parses ldraw libraries for converting
  * "yargs": "^4.7.1" - Command line parser
  * "twgl.js": "^1.7.1" - Thin wrapper around webgl




# Future

* Webpack 2: native es6 modules, tree shaking for unused code
* Only modern browsers supported. Removed the es6 polyfill...  "babel-polyfill": "^6.9.1",

# Production

https://github.com/systemjs/systemjs/blob/master/docs/production-workflows.md - There is a different way to load bundled source?  Also there is an ability to load several things at once. Delayed images, etc.


# Browser Requirements

## performance.now()
http://caniuse.com/#search=performance.now

Feature Detection:
if (timestamp < 1e12) {
  // .. high resolution timer
} else {
  // integer milliseconds since unix epoch
}


## XMLHttpRequest Level 2 (all browsers)
http://caniuse.com/#search=xhr2

https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
 Blob?

var verts = [];
var floatBuffer = new Float32Array(verts.length * 7);
var byteBuffer = new Uint8Array(floatBuffer); // view float buffer as bytes
for (i = 0; i < verts.length; i++) {
  floatBuffer[i*4 + 0] = verts.x;
  floatBuffer[i*4 + 1] = verts.y;
  floatBuffer[i*4 + 2] = verts.z;

  // RGBA values expected as 0-255
  byteBuffer[i*16 + 12] = verts.r;
  byteBuffer[i*16 + 13] = verts.g;
  byteBuffer[i*16 + 14] = verts.b;
  byteBuffer[i*16 + 15] = verts.a;
}

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, floatBuffer, gl.STATIC_DRAW);


// To render later
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(attributes.aPosition, 3, gl.FLOAT, false, 16, 0);
gl.vertexAttribPointer(attributes.aColor, 4, gl.UNSIGNED_BYTE, false, 16, 12);

//Shader code:
attribute vec3 aPosition;
atribute vec4 aColor;
