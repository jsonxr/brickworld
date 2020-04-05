// Adapted from https://doc.babylonjs.com/resources/babylonjs_and_reactjs
import React, { ReactNode, useEffect, useContext, useRef, useState, createContext, ReactElement } from 'react';
import {
  Engine,
  Scene,
  Nullable,
  EngineOptions,
  SceneOptions,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  HemisphericLight,
} from '@babylonjs/core';

export type BabylonjsProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady?: (scene: Scene) => void;
  onRender?: (scene: Scene) => void;
  id: string;
  children?: ReactNode;
};

export const useEngine = (): Nullable<Engine> => useContext(SceneContext).engine;
export const useScene = (): Nullable<Scene> => useContext(SceneContext).scene;
export const useCanvas = (): Nullable<HTMLCanvasElement | WebGLRenderingContext> => useContext(SceneContext).canvas;

export type SceneContextType = {
  engine: Nullable<Engine>;
  canvas: Nullable<HTMLCanvasElement | WebGLRenderingContext>;
  scene: Nullable<Scene>;
  sceneReady: boolean;
};

const DEFAULT_CONTEXT: SceneContextType = {
  engine: null,
  canvas: null,
  scene: null,
  sceneReady: false,
};

// TODO: build a fallback mechanism when typeof React.createContext !== 'function'
export const SceneContext = createContext<SceneContextType>(DEFAULT_CONTEXT);

const onDefaultSceneReady = (scene: Scene) => {
  const camera: ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
  const canvas = scene.getEngine().getRenderingCanvas();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  camera.attachControl(canvas!, true);
  new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
  MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
};

export default ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady = onDefaultSceneReady,
  renderChildrenWhenReady,
  children,
  ...rest
}: BabylonjsProps): ReactElement => {
  const reactCanvas = useRef<Nullable<HTMLCanvasElement>>(null);
  const [sceneContext, setSceneContext] = useState<SceneContextType>(DEFAULT_CONTEXT);

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
      const scene = new Scene(engine, sceneOptions);
      const sceneIsReady = scene.isReady();
      if (sceneIsReady) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => {
          onSceneReady(scene);
          setSceneContext(() => ({
            canvas: reactCanvas.current,
            scene,
            engine,
            sceneReady: true,
          }));
        });
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === 'function') {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener('resize', resize);
      }

      setSceneContext(() => ({
        canvas: reactCanvas.current,
        scene,
        engine,
        sceneReady: sceneIsReady,
      }));

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener('resize', resize);
        }
      };
    }
  }, [reactCanvas, adaptToDeviceRatio, antialias, engineOptions, onRender, onSceneReady, sceneOptions]);

  const renderChildren: boolean =
    renderChildrenWhenReady !== true || (renderChildrenWhenReady === true && sceneContext.sceneReady);
  return (
    <>
      <canvas ref={reactCanvas} {...rest} />
      <SceneContext.Provider value={sceneContext}>{renderChildren && children}</SceneContext.Provider>
    </>
  );
};
