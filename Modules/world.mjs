/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import { Ant } from './antclass.mjs';
import { Base } from './baseclass.mjs';
import { Food } from './foodclass.mjs';
import { Pheromones } from './pheromones.mjs';
import { SpatialDB } from './spatialdbclass.mjs';

const MS_PER_TICK = 10;
const ANT_FOV = Math.PI / 2.0;

const sqrange = 5000;
export class World {
  constructor(width, height) {
    this.protoAnt = new Ant(0,0, null);
    this.ants = new SpatialDB();
    this.foods = new SpatialDB();

    this.base = null;
    this.setSize(width, height);
    this.foodph = new Pheromones();
    this.nestph = new Pheromones();
    this.showDestinations = true;
    this.foodPheromoneDecayRate = 0.997;
    this.nestPheromoneDecayRate = 0.997;
    this.tick = 0;
    this.ticksPerFrame = 0;
    this.ticksAcc = 0.0;
    this.maxFoodPheromoneStrength = 0.0;
    this.maxNestPheromoneStrength = 0.0;

  }

  removeFood(food) {
    this.foods.removeItem(food);
  }

  initBase(x, y, antNo) {
    this.base = new Base(x, y, antNo);
    this.setNumAnts(antNo);
  }

  reset() {
    const numAnts = this.ants.size();
    this.setNumAnts(0);
    this.deletePheromones();
    this.setNumAnts(numAnts);
    this.maxFoodPheromoneStrength = 0.0;
    this.maxNestPheromoneStrength = 0.0;

  }

  refreshAntParams() {
    this.ants.items.forEach((ant) => {
     ant.copyParams(this.protoAnt);
    });
  }

  setNumAnts(num_ants) {
    while (this.ants.size() > num_ants) {
      this.ants.removeByIndex(Math.floor(Math.random() * this.ants.length));
    }
    while (this.ants.size() < num_ants) {
      const ant = this.protoAnt.clone(this.base.pos.x, this.base.pos.y, this.base);
      this.ants.add(ant);
    }
  }

  deletePheromones() {
    this.foodph.clear();
    this.nestph.clear();
  }

  deleteFood() {
    this.foods.removeAllMatching((item) => true);
  }

  addFood(x, y) {
    const food = new Food(x, y);
    this.foods.add(food);
  }

  resetTargets() {
    this.ants.items.forEach((ant) => {
      ant.tx = Math.random() * this.width;
      ant.ty = Math.random() * this.height;
    });
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
  }

  doTick() {
    this.tick += 1;
    this.timeTotal += this.msPerTick;
    this.nestph.update();
    this.foodph.update();

    this.ants.items.forEach((ant) => {
      ant.update(this);
    });
  }


  update(timeMs) {
    if(this.ticksPerFrame > 0.0) {
      this.ticksAcc += this.ticksPerFrame;
      while(this.ticksAcc > 1.0) {
        this.ticksAcc -= 1.0;
        this.doTick();
      }
    } else {
      while (this.tick * MS_PER_TICK < timeMs) {
        this.doTick();
      }
    }
  }

  imgdata = null;

  draw(timeMs, gfxtools) {
    gfxtools.clear();

    const ctx = gfxtools.getContext();

    gfxtools.setPen('brown', 1, 1);
    gfxtools.fillCircle(this.base.pos, 30);

    ctx.globalCompositeOperation = 'lighter';

    this.foodph.forEach((element) => {
      gfxtools.setPen('limegreen', 1,  0.1 );
      gfxtools.fillCircle(element.pos, Math.max(0.2, Math.min(20.0,element.strength*100.0)));
    });

    this.nestph.forEach((element) => {
       gfxtools.setPen('cadetblue', 1,  0.1);
      gfxtools.fillCircle(element.pos, Math.max(0.5, Math.min(20.0,element.strength*10.0)));
    });

    this.foods.items.forEach((element) => {
      gfxtools.setPen('chocolate', 1, 1);
      gfxtools.drawDot(element.pos, 5);
    });

    ctx.globalCompositeOperation = 'source-over';

    this.ants.items.forEach((element) => {
      if (this.showDestinations) {
        gfxtools.setPen('orange', 1, 1);
        gfxtools.drawLineStrip([element.pos, element.target]);
        const leftAntennaTip = element.pos.add(element.leftAntenna);
        const rightAntennaTip = element.pos.add(element.rightAntenna);
        gfxtools.drawLineStrip([element.pos, leftAntennaTip]);
        gfxtools.drawLineStrip([element.pos, rightAntennaTip]);
        gfxtools.drawCircle(leftAntennaTip, element.antennaSenseRadius);
        gfxtools.drawCircle(rightAntennaTip, element.antennaSenseRadius);
      }
      gfxtools.setPen(element.carrying ? 'red' : 'blue', 1, 1);
      gfxtools.drawCircle(element.pos, 10);

      gfxtools.setPen('black', 1, 1);

      gfxtools.drawDot(element.pos, 5);


  });
  }
}
export default {
  World,
};
