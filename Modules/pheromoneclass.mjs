/* eslint-disable import/extensions */
import { V2 } from './v2.mjs';

export class Pheromone {
  constructor(pos, strength) {
    this.pos = pos.copy();
    this.strength = strength;
  }
}
export default {
  Pheromone,
};
