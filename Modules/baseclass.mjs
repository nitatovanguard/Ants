/* eslint-disable no-console */
/* eslint-disable import/extensions */
import { V2 } from './v2.mjs';

export class Base {
  constructor(locX, locY, antNo) {
    this.pos = new V2(locX, locY);
    this.antn = antNo;
    this.foodn = 0;
    this.size = 25;
  }

  addFood(n) {
    this.foodn += n;
    console.log(this.foodn);
  }
}
export default {
  Base,
};
