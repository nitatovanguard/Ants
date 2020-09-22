/* eslint-disable linebreak-style */
const epsilon = 5e-100;

export class V2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new V2(this.x, this.y);
  }

  add(that) {
    return new V2(this.x + that.x, this.y + that.y);
  }

  clip(minX, maxX, minY, maxY) {
    return new V2(Math.min(maxX,Math.max(minX, this.x)), Math.min(maxY,Math.max(minY, this.y)));
  }

  addTo(that) {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  average(that) {
    return new V2((this.x + that.x) / 2, (this.y + that.y) / 2);
  }

  sub(that) {
    return new V2(this.x - that.x, this.y - that.y);
  }

  subFrom(that) {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  scaled(s) {
    return new V2(this.x * s, this.y * s);
  }

  dot(that) {
    return this.x * that.x + this.y * that.y;
  }

  sqLength() {
    return this.dot(this);
  }

  length() {
    return Math.sqrt(this.sqLength());
  }

  getSqDist(that) {
    const d = that.sub(this);
    return d.dot(d);
  }

  normalize() {
    const l = this.length();
    if (l > epsilon) {
      this.scale(1.0 / l);
    }
    return this;
  }

  rot(angle) {
    return this.rottrig(Math.sin(angle), Math.cos(angle));
  }

  rottrig(s,c) {
    return new V2(c * this.x - s * this.y, s * this.x + c * this.y);
  }

  perpdot(vec) {
    return -vec.y * this.x + vec.x * this.y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }

  isInView(checkPoint, leftLimitVec, rightLimitVec) {
    const dir = checkPoint.sub(this);
    return dir.perpdot(leftLimitVec) <= 0.0 && dir.perpdot(rightLimitVec) >= 0.0;
  }
}
export default {
  V2,
};
