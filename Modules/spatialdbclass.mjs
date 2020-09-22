/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { V2 } from './v2.mjs';
export class SpatialDB {
  constructor() {
    this.items = [];
  }

  forEach(handler) {
    this.items.forEach(handler);
  }

  size() {
    return this.items.length;
  }

  add(item) {
    this.items.push(item);
  }

  removeItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  removeByIndex(index) {
    this.items.splice(index, 1);
  }

  removeAllMatching(predicate) {
    this.items = this.items.filter((item) => !predicate(item));
  }

  findFirstInRadius(pos, radius, extraCriterion = (() => true)) {
    return this.items.find((item) => (item.pos.getSqDist(pos) < radius ** 2) && extraCriterion(item));
  }

  findAllInRadius(pos, radius, extraCriterion = (() => true)) {
    return this.items.filter((item) => (item.pos.getSqDist(pos) < radius ** 2) && extraCriterion(item));
  }

  indexOf(item) {
    return this.items.indexOf(item);
  }

  findMaximumInRadius(pos, radius, comparator, extraCriterion = (() => true) ) {
    let all = this.findAllInRadius(pos, radius, extraCriterion);
    if(!all.length) return null;
    return all.reduce((acc,cur) =>  comparator(acc,cur) > 0 ? acc : cur)
  }

  findNearestInRadius(pos, radius, extraCriterion = (() => true)) {
    return this.findMaximumInRadius(pos, radius, (a,b)=> b.pos.sub(pos).sqLength() - a.pos.sub(pos).sqLength(), extraCriterion);
  }

  filter(criterion) {
    return this.items.filter(criterion());
  }
}
export default {
  SpatialDB,
};
