/* eslint-disable import/extensions */
import { V2 } from './v2.mjs';

export class Food {
  constructor(locX, locY) {
    this.pos = new V2(locX, locY);
    this.target = false;
  }
}
export default {
  Food,
};
