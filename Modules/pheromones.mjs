/* eslint-disable import/prefer-default-export */

import { V2 } from './v2.mjs';
import {Pheromone} from "./pheromoneclass.mjs";
import { SpatialDB } from './spatialdbclass.mjs';

export class Pheromones {
  constructor() {
    this.sdb = new SpatialDB();
    this.vanishLevel = 0.001;
    this.dropGrid = 7;
    this.decayRate = 0.997;
  }

  add(pos,strength) {
    let p = this.sdb.findNearestInRadius(pos, this.dropGrid);
    if (p) {
      p.strength += strength;
    } else {
      this.sdb.add(new Pheromone(pos.copy(), strength))
    }
  }

  detect(pos, scanRadius) {
    const items = this.sdb.findAllInRadius(pos, scanRadius);
    return items.reduce((s,p) => s += p.strength / (p.pos.sub(pos).sqLength()+1.0) , 0);
  }

  update() {
    this.sdb.forEach(p => p.strength *= this.decayRate);
    this.sdb.removeAllMatching(p => p.strength < this.vanishLevel);
  }

  clear() {
    this.sdb.removeAllMatching(() => true);
  }

  forEach(action) {
    this.sdb.forEach(action);
  }
}