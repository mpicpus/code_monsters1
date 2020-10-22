import { Thing } from './thing.js';

export class Projectile extends Thing {
  constructor(attrs) {
    attrs.defaultState = 'go';
    super(attrs)

    this.damageableTypes = [];
  }

  damageableThings() {
    return this.damageableTypes.map(type => this.screen.things[type] || []).flat().filter(thing => thing.currentState != 'destroy')
  }

  hitThing() {
    return this.damageableThings().find((thing) => this.currentSprite().containsPoint(thing.getCenterPosition()))
  }
}
