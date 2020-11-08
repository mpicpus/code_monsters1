import { Thing } from './thing.js';

export class Projectile extends Thing {
  constructor(attrs) {
    attrs.defaultState = 'go';
    super(attrs)

    this.damageableTypes = [];
  }

  onLoad() {
    setTimeout(() => {
      this.offsetTo('center');
      // this.createBoundingCircle(2.5);
    }, 200)
  }

  damageableThings() {
    return this.damageableTypes.map(type => this.screen.things[type] || []).flat().filter(thing => thing.currentState != 'destroy')
  }

  hitThing() {
    return this.damageableThings().find((thing) => {
      let ts = thing.boundingShape.circle;
      let s = this.boundingShape.circle;

      if (!ts || !s) return;

      return Math.hypot(ts.center().x - s.center().x, ts.center().y - s.center().y) < ts.radius() + s.radius()
    })
  }
}
