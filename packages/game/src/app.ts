import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';

import meaning from '@app/shared';

console.log('meaning: ', meaning);

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    // const canvas = document.createElement('canvas');
    // canvas.style.width = '100%';
    // canvas.style.height = '100%';
    // canvas.id = 'gameCanvas';
    // document.body.appendChild(canvas);
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    // initialize babylon scene and engine
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera: ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
    MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);

    // hide/show the Inspector
    window.addEventListener('keydown', (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}
new App();
