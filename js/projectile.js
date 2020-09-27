import { Thing } from './thing.js';

export class Projectile extends Thing {
  constructor(attrs) {
    super(attrs)

    this.damageable = [];
  }

  damageableThings() {
    return this.damageableTypes.map(type => this.screen.things[type] || []).flat()
  }

  hitThing() {
    return this.damageableThings().find((thing) => thing.currentSprite().containsPoint(this.position))
  }
}
