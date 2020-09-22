/* eslint-disable linebreak-style */
/* eslint-disable no-constant-condition */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import {V2} from './v2.mjs';

const PICKUP_DIST_SQ = 10;
const ANT_VISION_RANGE = 30;
const ANT_FOV = Math.PI / 2.5;
const DEFAULT_ANT_SPEED = 2.0;
const PHEROMONE_REFRESH_RANGE = 5.0;

export class Ant {
  static foodPhDrop = 0.999;
  static nestPhDrop = 0.999;

  constructor(locX, locY, base) {
    this.pos = new V2(locX, locY);
    this.target = this.pos;
    this.carrying = false;
    this.seeking = false;
    this.speed = DEFAULT_ANT_SPEED;
    this.base = base;
    this.nestDetectionRange = 100;
    this.foodDetectionRange = 100;
    this.foodStrength = 0.;
    this.nestStrength = 0;
    this.turnSpeed = 0.1;
    this.viewAngle = ANT_FOV;
    this.antennaLength = 25.0;
    this.antennaSenseRadius = 20.0;
    let angle = Math.random() * Math.PI * 2.0;
    this.dir = new V2(Math.cos(angle), Math.sin(angle));
  }

  copyParams(that) {
    this.speed = that.speed;
    this.nestDetectionRange = that.nestDetectionRange;
    this.foodDetectionRange = that.foodDetectionRange;
    this.turnSpeed = that.turnSpeed;
    this.viewAngle = that.viewAngle;
    this.antennaLength = that.antennaLength;
    this.antennaSenseRadius = that.antennaSenseRadius;
    this.dir = that.dir;
    this.updateAntennae()
  }

  clone(locX, locY, base) {
    let clone = new Ant(locX, locY, base);
    clone.copyParams(this);
    return clone;
  }

  updateAntennae() {
    const vaSin = Math.sin(this.viewAngle*0.5);
    const vaCos = Math.cos(this.viewAngle*0.5);
    this.leftAntenna = this.dir.rottrig(vaSin, vaCos).scale(this.antennaLength);
    this.rightAntenna = this.dir.rottrig(-vaSin, vaCos).scale(this.antennaLength);
  }



  isInsideNest() {
    if (!this.base.pos) {
      console.log('isInsideNest');
    }
    return this.pos.getSqDist(this.base.pos) < this.base.size ** 2;
  }

  avoid(world) {
    const current = this;
    world.ants.findAllInRadius(this.pos, PICKUP_DIST_SQ * 4, (item) => item !== current).forEach((element) => {
      const targetv2 = (this.target.sub(this.pos).normalize());
      const avoidv2 = element.pos.sub(this.pos);
      if (!element.pos) {
        console.log('avoid');
      }
      const oppositev2 = avoidv2.scaled(-1 * (1 / (Math.sqrt(this.pos.getSqDist(element.pos)) + 0.0001)));
      if (this.carrying) {
        oppositev2.scale(0.25);
      }
      this.pos.addTo(targetv2.average(oppositev2));
    });
  }

  lookForNest(world) {
    if (this.pos.sub(this.base.pos).sqLength() < this.nestDetectionRange ** 2) {
      this.setTarget(this.base.pos);
      return true;
    }
    return false
  }

  dropFoodinNest(world) {
    if (this.isInsideNest()) {
      this.carrying = false;
      this.base.addFood(1);
      this.nestStrength = 1.0;
      this.flip(world);
      return true;
    }
    return false;
  }

  setTarget(target) {
    this.target = target;
    this.seeking = false
  }

  seek() {
    this.seeking = true;
  }
  tryPickupFood(world) {
    const foundFood = world.foods.findFirstInRadius(this.pos, PICKUP_DIST_SQ);
    if (foundFood) {
      this.carrying = true;
      world.foods.removeItem(foundFood);
      this.foodStrength = 1.0;
      this.flip(world);
      return true;
    }
    return false;
  }

  findFood(world) {
    const dir = this.target.sub(this.pos);
    const foundFood = world.foods.findNearestInRadius(this.pos, this.foodDetectionRange, item => this.pos.isInView(item.pos, this.leftAntenna, this.rightAntenna));
    if (foundFood) {
      this.setTarget(foundFood.pos);
      foundFood.target = true;
      return true;
    }
    return false;
  }

  flip(world) {
    this.dir.scale(-1.0);
    this.setTarget(this.pos.add(this.dir.scaled(10.0)));
  }

  followPheromone(pheromones, phtype, world) {
    const leftAntennaTip = this.pos.add(this.leftAntenna);
    const rightAntennaTip = this.pos.add(this.rightAntenna);
    let leftAntennaStrength = pheromones.detect(leftAntennaTip, this.antennaSenseRadius);
    let rightAntennaStrength = pheromones.detect(rightAntennaTip, this.antennaSenseRadius);
    if(leftAntennaStrength === 0 && rightAntennaStrength === 0) {
      return false;
    }
    const diff = leftAntennaStrength - rightAntennaStrength;
    this.setTarget(this.pos.add(this.dir.rot(diff)));

    return true;
  }

  updatePosition(world) {

    if (this.seeking && this.pos.getSqDist(this.target) < PICKUP_DIST_SQ) {
      this.setTarget(new V2(Math.random() * world.width, Math.random() * world.height));
    }

    // wiggle
    if (this.seeking && Math.random() < 0.05) {
      let newTarget = this.pos.add(this.dir.rot((Math.random()*2.0-1.0) * this.turnSpeed).scale(Math.random() * 100.0));
      newTarget = newTarget.clip(0, world.width, 0, world.height);
      this.setTarget(newTarget);
    }

    // limit turn
    let newDir = this.target.sub(this.pos).normalize();

    if (this.dir.perpdot(newDir) < 0.0) {
      const rotLimit = this.dir.rot(this.turnSpeed);
      this.dir = newDir.perpdot(rotLimit) > 0.0 ? rotLimit : newDir;
    } else {
      const rotLimit = this.dir.rot(-this.turnSpeed);
      this.dir = newDir.perpdot(rotLimit) < 0.0 ? rotLimit : newDir;
    }

    this.updateAntennae();
    this.pos.addTo(this.dir.scaled(this.speed));
    this.foodStrength *= Ant.foodPhDrop;
    this.nestStrength *= Ant.nestPhDrop;

  }

  update(world) {
    if (this.isInsideNest()) {
      this.nestStrength = 1.0;
    }

    if (this.carrying) {
      // we have food!
      if (this.dropFoodinNest(world)) {
        // dropped food in nest
        this.seek();
      } else if (this.lookForNest(world)) {
        world.foodph.add(this.pos, this.foodStrength);
      } else {
        if (!this.followPheromone(world.nestph, "base", world)) {
          this.seek();
        }
        world.foodph.add(this.pos, this.foodStrength)
      }
    } else {
      if (!this.tryPickupFood(world) && this.findFood(world)) {
        world.nestph.add(this.pos, this.nestStrength)
      } else {
        if (!this.followPheromone(world.foodph, "food", world)) {
          this.seek();
        }
        world.nestph.add(this.pos, this.nestStrength)
      }
    }

    this.updatePosition(world);
  }
}

export default {
  Ant
}