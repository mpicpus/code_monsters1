import { Projectile } from '../../projectile.js';
import { Explosion02, Explosion04 } from './avatar.js';

export class RedShot extends Projectile {
  constructor(attrs = {}) {
    attrs.states = {
      go: { steps: 1 }
    };

    attrs.defaultState = 'go';
    attrs.boundingShape = {
      shape: 'circle'
    };

    attrs.scale = 0.6 * app.screen.astronomicalMultiplicator;

    super(attrs);

    this.damageableTypes = ['asteroid'];
    this.strength = 1;
    this.damage = 2;

    this.source = attrs.source;
    this.target = attrs.target;
    this.linearSpeed = 15;

    this.shotSoundPicker = new this.screen.randomizer.picker({ set: ['shot01', 'shot02', 'shot03'] });

    this.setInitialPosition();

    this.acquireTarget().then(target => {
      if (target) {
        this.target = target;
        this.targetSpeed = this.target.speed;
        setTimeout(() => {
          this.setChasingSpeed();
          // this.fireShot()
        }, 10 )
      } else this.destroy();
    });
  }

  acquireTarget() {
    return new Promise((resolve, reject) => {
      let sun = this.screen.things.sun[0];
      let target = this.screen.things.asteroid
                      .sort((a, b) => a.distanceTo(sun) - b.distanceTo(sun))
                      .filter(a => a.position.x < sun.position.x && a.position.y < sun.position.y )[0];

      resolve(target)
    })
  }

  setInitialPosition() {
    if (!this.source || this.source.dead) {
      this.destroy();
      return
    };

    this.position = this.source.getCenterPosition()
  }

  setChasingSpeed() {
    let tp = this.target.getCenterPosition();
    let p = this.getCenterPosition();

    let angle = Math.atan2((tp.y - p.y), (tp.x - p.x));

    this.speed = {
      x: this.linearSpeed * Math.cos(angle) + this.target.speed.x,
      y: this.linearSpeed * Math.sin(angle) + this.target.speed.y
    }
  }

  fireShot() {
    this.screen.things.createAndAdd(Explosion04, {scale: 0.1, thing: this})
  }

  destroy() {
    this.wrapper.createAndAdd(Explosion04, {thing: this, speed: this.targetSpeed, scale: this.scale * 0.7, animationSpeed: 'crazy'})
    this.remove();
  }

  onSetState() {
    return {
      'go': () => {
        let shotSound = this.shotSoundPicker.pick();
        // let shotSound = 'shot01';
        this.sound.play(shotSound, 0.1)
      }
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

    this.damageableTypes = ['planet', 'sun'];
    this.randomExpSoundPicker = new this.screen.randomizer.picker({ set: ['explosion04'] });
  }

  destroy() {
    // this.getRandomExplosion();
    this.sound.play(this.randomExpSoundPicker.pick())
    this.wrapper.createAndAdd(Explosion02, {thing: this, scale: this.scale * 2, speed: {x: this.speed.x / 3, y: this.speed.y / 3}})
    this.remove();
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

    this.strength = 5;
    this.damage = 5;
  }

  // takeDamage() {
  //   this.destroy()
  // }

  onLoad() {
    this.offsetTo('center')
  }
}
