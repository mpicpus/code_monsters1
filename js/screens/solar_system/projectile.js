import { Projectile } from '../../projectile.js';
import { Explosion02 } from './avatar.js';

export class RedShot extends Projectile {
  constructor(attrs = {}) {
    attrs.states = {
      go: { steps: 1 }
    };

    attrs.defaultState = 'go';
    attrs.boundingShape = {
      shape: 'circle'
    };

    attrs.scale = 0.5 * app.screen.astronomicalMultiplicator;

    super(attrs);

    this.damageableTypes = ['asteroid'];
    this.strength = 1;
    this.damage = 4;

    this.source = attrs.source;
    this.target = attrs.target;
    this.linearSpeed = 0.5;

    this.acquireTarget().then(target => {
      if (target) {
        this.target = target;
        this.setInitialPosition();
        this.setInitialSpeed()
      } else this.destroy();
    });
  }

  acquireTarget() {
    return new Promise((resolve, reject) => {
      let num = this.screen.things.asteroid.length;

      if (num == 0) resolve(null)
      else resolve(this.screen.things.asteroid[num - 1]);
    })
  }

  setInitialPosition() {
    this.position = this.source.getCenterPosition()
  }

  setInitialSpeed() {
    let tp = this.target.getCenterPosition();
    let p = this.getCenterPosition();

    let angle = Math.atan2((tp.x - p.x), (tp.y - p.y));

    this.speed = {
      x: this.linearSpeed * Math.cos(angle),
      y: this.linearSpeed * Math.sin(angle)
    }
  }
}

export class RedBeam extends Projectile {
  constructor(attrs = {}) {

  }
}

class Asteroid extends Projectile {
  constructor(attrs = {}) {
    attrs.defaultState = 'go';
    attrs.boundingShape = { shape: 'circle', draw: false };
    attrs.scale = attrs.scale ? attrs.scale * app.screen.astronomicalMultiplicator / 0.7 : null;

    super(attrs);

    this.damageableTypes = ['planet', 'sun']
  }

  destroy() {
    // this.getRandomExplosion();
    this.remove();
    this.wrapper.createAndAdd(Explosion02, {position: this.getCenterPosition(), scale: this.scale * 2})
  }

  getRandomExplosion() {
    this.screen.getRandomExplosion(this)
  }
}

export class Asteroid01 extends Asteroid {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 77,
        loop: true
      }
    };

    attrs.scale = 0.4;
    attrs.animationSpeed = 'fast';

    // attrs.speed = {x: 0, y: 0};

    super(attrs);

    this.strength = 10;
    this.damage = 5;
  }

  takeDamage() {
    this.destroy()
  }

  onLoad() {
    this.offsetTo('center')
  }
}
