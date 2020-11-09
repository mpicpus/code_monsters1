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
      return this.distanceTo(thing) < 0;
    })
  }
}
