/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable import/extensions */
import { createResizing2dCanvas, createFullscreen2dCanvas } from './canvastools.mjs';
import { World } from './world.mjs';
import { Ant } from './antclass.mjs';
import * as dat from './dat.gui.module.mjs';

let world;
const params = {
  ants: 10,
  foodPhDecayRate: 0.997,
  nestPhDecayRate: 0.997,
};
function initWorld(gfxtools) {
  world = new World(gfxtools.getWidth(), gfxtools.getHeight());
  world.initBase(gfxtools.getWidth() / 2, gfxtools.getHeight() / 2, params.ants);
}
function redraw(timeMs, gfxtools) {
  world.update(timeMs);
  world.draw(timeMs, gfxtools);
}
function resize(gfxtools) {
  world.resetTargets();
  world.setSize(gfxtools.getWidth(), gfxtools.getHeight());
}
export function preview(div) {
  const canvas = document.createElement('canvas');
  div.appendChild(canvas);
  // eslint-disable-next-line no-param-reassign
  div.style.backgroundColor = 'moccasin';
  createResizing2dCanvas(canvas, div, initWorld, redraw, resize, true);
}
export function activate(canvas) {

  createFullscreen2dCanvas(canvas, initWorld, redraw, resize, true);
  let isDrawing;
  canvas.addEventListener('keydown', (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.keyCode === 90) {
      world.toggleDestinations();
    }
  });
  canvas.addEventListener('mousedown', () => {
    isDrawing = true;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing === true) {
      world.addFood(e.offsetX, e.offsetY);
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (isDrawing === true) {
      isDrawing = false;
    }
  });

  canvas.onclick = (event) => {
    world.addFood(event.clientX, event.clientY);
  };

  const gui = new dat.GUI({ name: 'My GUI' });
  // const gui = new dat.GUI({name: 'My GUI'});
  gui.addFolder('Flow Field');
  gui.add(params, 'ants', 1, 50, 1).onChange((val) => world.setNumAnts(val));
  gui.add(world, 'ticksPerFrame', 0.0, 1.0,0.01);
  gui.add(params, 'foodPhDecayRate', 0.9, 0.999, 0.001).onChange((value) => world.foodph.decayRate = value);
  gui.add(params, 'nestPhDecayRate', 0.9, 0.999, 0.001).onChange((value) => world.nestph.decayRate = value);
  gui.add(world.protoAnt, 'nestDetectionRange', 1, 500, 1).onChange(() => world.refreshAntParams());
  gui.add(world.protoAnt, 'foodDetectionRange', 1, 500, 1).onChange(() => world.refreshAntParams());
  gui.add(world.protoAnt, 'turnSpeed', 0.001, Math.PI-0.01).onChange(() => world.refreshAntParams());
  gui.add(world.protoAnt, 'viewAngle', 0.001, Math.PI-0.01).onChange(() => world.refreshAntParams());
  gui.add(world.protoAnt, 'antennaLength', 0.001, 100.0).onChange(() => world.refreshAntParams());
  gui.add(world.protoAnt, 'antennaSenseRadius', 0.01, 100.0).onChange(() => world.refreshAntParams());
  gui.add(Ant, 'foodPhDrop', 0.9, 1.0, 0.001); // how quickly the strength of the dropped pheromone drops once the ant leaves the food pile
  gui.add(Ant, 'nestPhDrop', 0.9, 1.0, 0.001); // how quickly the strength of the dropped pheromone drops once the ant leaves the nest
  gui.add(world, 'showDestinations')
  gui.add(world, 'deletePheromones');
  gui.add(world, 'deleteFood');
  gui.add(world, 'reset');
}
