import { ParticleEmitter } from '../../particles.js';
import { Projectile } from '../../projectile.js';
import { Explosion02, Explosion04 } from './explosions.js';
import { ThingModule } from '../../thing.js';

class ShotUtils extends ThingModule {
  setTarget() {
    this.acquireTarget().then(target => {
      if (target) {
        this.screen.things.targets = this.screen.things.targets || [];
        this.screen.things.targets.push(target);
        this.target = target;
        this.targetSpeed = this.target.speed;
        setTimeout(() => {
          this.setChasingSpeed();
        }, 10 )
      } else this.remove();
    });
  }

  acquireTarget() {
    let numOfShots = this.numOfShots || 100;

    return new Promise((resolve, reject) => {
      let sun = this.screen.things.sun[0];
      let target = this.screen.things.asteroid.filter(a => this.wrapper.targets.filter(t => t == a).length < numOfShots)
                      .sort((a, b) => a.distanceTo(sun) - b.distanceTo(sun))
                      .filter(a => a.position.x < sun.position.x && a.position.y < sun.position.y )[0];

      resolve(target)
    })
  }

  setInitialPosition() {
    if (!this.source || this.source.dead) {
      this.remove();
      return
    };

    this.position = this.source.getCenterPosition()
  }

  setChasingSpeed() {
    let tp = this.target.getCenterPosition();
    let p = this.getCenterPosition();

    let angle = Math.atan2((tp.y - p.y), (tp.x - p.x));

    this.setSpeedFromAngle(angle)
  }

  setSpeedFromAngle(angle) {
    this.speed = {
      x: this.linearSpeed * Math.cos(angle) + (this.target ? this.target.speed.x : 0),
      y: this.linearSpeed * Math.sin(angle) + (this.target ? this.target.speed.y : 0)
    }

    console.log(angle, this.speed)
  }

  fireShot() {
    this.screen.things.createAndAdd(Explosion04, {scale: 0.1, thing: this})
  }

  onDestroy() {
    this.wrapper.createAndAdd(Explosion04, {thing: this, speed: this.targetSpeed, scale: this.scale * 0.7, animationSpeed: 'crazy'})
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


export class RedShot extends Projectile {
  constructor(attrs = {}) {
    attrs.defaultState = 'go';
    attrs.boundingShape = {
      shape: 'circle'
    };
    attrs.states = {
      go: { steps: 1 }
    };

    attrs.scale = 0.6 * app.screen.astronomicalMultiplicator;

    super(attrs);

    this.addModule(ShotUtils);

    this.damageableTypes = ['asteroid01'];
    this.source = attrs.source;
    this.angle = attrs.angle;
    this.autoTarget = attrs.autoTarget == undefined ? true: attrs.autoTarget;
    this.target = attrs.target;
    this.strength = 1;
    this.damage = 2;
    this.linearSpeed = 15;
    this.numOfShots = 3;

    this.shotSoundPicker = new this.screen.randomizer.picker({ set: ['shot01', 'shot02', 'shot03'] });

    this.setInitialPosition();
    
    if (this.autoTarget)
      this.setTarget();
    else if (this.angle)
      this.setSpeedFromAngle(this.angle * Math.PI / 180)
  }
}

export class FireShot extends ParticleEmitter {
  constructor(attrs = {}) {
    attrs.particleProperties = {
      "alpha": {
        "start": 1,
        "end": 0
      },
      "scale": {
        "start": 0.3,
        "end": 0.06,
        "minimumScaleMultiplier": 0.68
      },
      "color": {
        "start": "#ffe100",
        "end": "#ff3700"
      },
      "speed": {
        "start": 0,
        "end": 0,
        "minimumSpeedMultiplier": 0.001
      },
      "acceleration": {
        "x": 0,
        "y": 1
      },
      "maxSpeed": 0,
      "startRotation": {
        "min": 0,
        "max": 0
      },
      "noRotation": true,
      "rotationSpeed": {
        "min": 0,
        "max": 0
      },
      "lifetime": {
        "min": 0.131,
        "max": 0.121
      },
      "blendMode": "screen",
      "frequency": 0.001,
      "emitterLifetime": -1,
      "maxParticles": 500,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": false,
      "spawnType": "circle",
      "spawnCircle": {
        "x": 0,
        "y": 0,
        "r": 4
      }
    };

    attrs.particleFileName = 'particle01';
    attrs.scale = 1;

    super(attrs);

    this.addModule(ShotUtils);
    this.source = attrs.source;
    this.target = attrs.target;
    this.strength = 30;
    this.damage = 20;
    this.linearSpeed = 15;
    this.damageableTypes = ['asteroid01'];
    this.numOfShots = 1;

    this.shotSoundPicker = new this.screen.randomizer.picker({ set: ['shot01', 'shot02', 'shot03'] });

    this.setInitialPosition();
    this.setTarget();
  }

  afterOnMove() {
    if (!this.target || this.target.dead)
      this.setTarget()
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

    attrs.animationSpeed = 'fast';

    super(attrs);

    this.strength = 5;
    this.damage = 5;
  }

  onLoad() {
    this.offsetTo('center')
  }
}
