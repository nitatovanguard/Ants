import assert from 'assert';
import { V2 } from '../modules/v2.mjs';

describe('v2', () => {
  describe('.add', () => {
    it('should return the sum of two vectors', () => {
      const v1 = new V2(1, 2);
      const v2 = new V2(3, 4);
      const vSum = v1.add(v2);
      assert.equal(vSum.x, 4);
      assert.equal(vSum.y, 6);
    });
  });
  describe('.addTo', () => {
    it('should add another vector to self(this) and return self', () => {
      const v1 = new V2(1, 2);
      const v2 = new V2(3, 4);
      const vSum = v1.addTo(v2);
      assert.equal(v1.x, 4);
      assert.equal(v1.y, 6);
      assert.equal(v1, vSum);
    });
  });
  describe('.sub', () => {
    it('should return the difference of two vectors', () => {
      const v1 = new V2(1, 2);
      const v2 = new V2(3, 5);
      const vDiff = v1.sub(v2);
      assert.equal(vDiff.x, -2);
      assert.equal(vDiff.y, -3);
    });
  });
  describe('.subFrom', () => {
    it('should sub another vector from self and return self', () => {
      const v1 = new V2(1, 2);
      const v2 = new V2(3, 5);
      const vDiff = v1.subFrom(v2);
      assert.equal(v1.x, -2);
      assert.equal(v1.y, -3);
      assert.equal(v1, vDiff);
    });
  });
  describe('.scaled', () => {
    it('should return a scaled copy of the vector', () => {
      const v1 = new V2(1, 2);
      const vScaled = v1.scaled(2);
      assert.equal(vScaled.x, 2);
      assert.equal(vScaled.y, 4);
    });
  });
  describe('.scale', () => {
    it('should scale vector in place and return a reference to it', () => {
      const v1 = new V2(1, 2);
      const vScaled = v1.scale(2);
      assert.equal(v1.x, 2);
      assert.equal(v1.y, 4);
      assert.equal(v1, vScaled);
    });
  });
});
