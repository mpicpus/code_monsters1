import { Thing } from '../../thing.js';
import { Explosion01 } from './explosions.js';
import { RedShot } from './projectiles.js';

export class Sun extends Thing {
  constructor(attrs = {}) {
    attrs.states = {
      idle: {steps: 23, loop: true},
      destroy: {steps: ['explosion_nova', 120], loop: false}
    };
    attrs.scale = 0.2;
    attrs.scale = attrs.scale * attrs.screen.astronomicalMultiplicator * 5;

    attrs.takesDamage = true;
    attrs.damage = 40;
    attrs.strength = 15;
    attrs.maxStrength = 20;
    attrs.boundingShape = {shape: 'circle', draw: false};

    super(attrs);
  }

  onLoad() {
    setTimeout(() => {
      this.offsetTo('center');
      this.moveTo('center');
    }, 200)
  }

  destroy() {
    if (this.scale) this.setScale(12 * this.scale);
    this.setState('destroy');
    this.wrapper.planet.forEach(p => p.destroy())
    this.offsetTo('center');
  }

  onStateComplete() {
    return {
      'destroy': () => {
        this.remove();
        setTimeout(() => {this.screen.renderer.stop()}, 100);
      }
    }
  }
}

class Planet extends Thing {
  constructor(attrs={}) {
    attrs.currentState = attrs.currentState || 'go';
    attrs.defaultState = attrs.defaultState || 'go';
    attrs.speed = attrs.speed || {x: 1, y: 1};
    attrs.boundingShape = {shape: 'circle', draw: false};
    attrs.scale = attrs.scale ? attrs.scale * attrs.screen.astronomicalMultiplicator / 0.7 : null;
    attrs.canWanderOut = true;

    super(attrs);

    this.orbitRadius = attrs.skipOrbitAdjustment ? attrs.orbitRadius : attrs.orbitRadius + 200 * this.screen.astronomicalMultiplicator / 0.7;
    this.centerObject = attrs.centerObject;
    this.angle = attrs.angle;
    this.hasOrbit = attrs.hasOrbit == false ? false : true;
    // this.showName = attrs.showName == false ? false : true;
    this.showName = false;

    this.takesDamage = true;
    this.damage = 20;
    this.moons = [];
    this.boundingRadiusMultiplier = attrs.boundingRadiusMultiplier || 0.8;

    this.explosionSoundPicker = new this.screen.randomizer.picker({ set: ['explosion01', 'explosion02', 'explosion03', 'explosion05'] });

    this.setStartingPosition()
  }

  onLoad() {
    setTimeout(() => {
      this.offsetTo('center');
   
      if (this.hasOrbit)
        this.orbit = new Orbit({thing: this});

      this.afterOnload()
    }, 200)
  }

  afterOnload() {}

  setStartingPosition() {
    this.angle = Math.random() * 360;
    this.speed = {x: this.speed.x / this.orbitRadius * 30, y: this.speed.y / this.orbitRadius *  30}
    this.orbitRadius = this.orbitRadius * this.screen.astronomicalMultiplicator;  
  }

  angularSpeed() {
    return Math.PI / this.speed.x && this.speed.x > 0 ? this.speed.x : 1
  }

  setAngle() {
    this.angle += this.angularSpeed();
    
    if (this.angle > 360)
      this.angle = this.angle - 360
  }

  move() {
    this.setAngle();

    let newPosition = {
      x: this.orbitRadius * Math.sin(Math.PI * 2 * this.angle / 360) + this.centerObject.getCenterPosition().x,
      y: this.orbitRadius * Math.cos(Math.PI * 2 * this.angle / 360) + this.centerObject.getCenterPosition().y
    }

    this.setPosition(newPosition);
    // this.positionBoundingShape();
    
    // if (this.orbit)
      // this.orbit.draw()
  }

  destroyMoons() {
    this.moons.forEach(moon => moon.destroy())
  }

  destroyOrbits() {
    if (this.orbit) this.orbit.destroy();
  }

  onDestroy() {
    // this.destroyMoons();
    this.destroyOrbits();
  }

  destroy() {
    this.sound.play(this.explosionSoundPicker.pick())
    this.getRandomExplosion(this);
    this.remove();
    this.onDestroy()
  }

  getRandomExplosion() {
    // this.screen.getRandomExplosion(this)
    this.screen.things.createAndAdd(Explosion01, {thing: this, scale: this.explosionScale || (this.scale * 10)})
  }

  roundShot() {
    let numOfShots = Math.floor(this.boundingShape.circle.radius / 3);
    let angleSteps = 360 / numOfShots;

    for (let angle = 0; angle <= 360; angle += angleSteps) {
      this.screen.things.createAndAdd(RedShot, {
        source: this,
        autoTarget: false,
        angle: angle
      })
    }
  }
}

class Orbit {
  constructor({
    thing = {},
    color = "#444444",
    thickness = 1
  }) {
    Object.assign(this, {
      thing, color, thickness
    });

    this.color = this.thing.screen.renderer.utils.string2hex(this.color)

    this.addOrbit()
  }

  addOrbit() {
    this.graphics = new this.thing.screen.renderer.Graphics();
    
    let attrs = {
      x: this.thing.centerObject.getCenterPosition().x,
      y: this.thing.centerObject.getCenterPosition().y,
      radius: this.thing.orbitRadius
    }

    this.graphics.lineStyle(this.thickness, this.color)
      .drawCircle(attrs.x, attrs.y, attrs.radius)
      .endFill();

    this.thing.screen.renderer.stage.addChild(this.graphics);
  }

  draw() {
    let attrs = {
      x: this.thing.centerObject.getCenterPosition().x,
      y: this.thing.centerObject.getCenterPosition().y,
      radius: this.thing.orbitRadius
    }

    this.graphics.lineStyle(this.thickness, this.color)
      .drawCircle(attrs.x, attrs.y, attrs.radius)
      .endFill();
  }

  destroy() {
    this.graphics.clear();
  }
}

export class Mercury extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 0.4;
    attrs.orbitRadius = 100;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    attrs.boundingRadiusMultiplier = 0.7;
    super(attrs)
  }
}

export class Venus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 0.7;
    attrs.orbitRadius = 200;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Earth extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 1;
    attrs.orbitRadius = 300;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    attrs.boundingRadiusMultiplier = 1;
    super(attrs);

    this.explosionScale = 1;
  }

  afterOnload() {
    this.createMoon();
  }

  createMoon() {
    this.moons.push(this.screen.things.createAndAdd(Moon, {centerObject: this}));
  }
}

export class Moon extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    }

    attrs.speed = {x: 3, y: 3};

    // attrs.orbitRadius = 0.1;
    attrs.orbitRadius = 60;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.03;
    attrs.showName = false;
    attrs.hasOrbit = false;
    attrs.spriteName = 'mercury';
    attrs.skipOrbitAdjustment = true;

    super(attrs)
  }
}

export class Mars extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 1.5;
    attrs.orbitRadius = 400;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}


export class Jupiter extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 5.2;
    attrs.orbitRadius = 500;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    super(attrs)

    this.explosionScale = 1.5
  }
}

export class Saturn extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 9.5;
    attrs.orbitRadius = 600;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    super(attrs)
  }
}

export class Uranus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 19.2;
    attrs.orbitRadius = 700;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Neptune extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      }
    };

    // attrs.orbitRadius = 30.1;
    attrs.orbitRadius = 800;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class DeathStar extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 30,
        loop: true
      }
    };

    attrs.orbitRadius = 30;
    attrs.hasOrbit = false;
    attrs.animationSpeed = 'medium';
    attrs.scale = 0.3;

    attrs.strength = 5;

    super(attrs)

    this.explosionScale = 1;
    this.setupShooters();
    this.resetFireTimer();
  }

  afterOnload() {
    this.attack()
  }

  resetFireTimer() {
    this.fireTimer = this.fireTimer || setTimeout(() => {
      this.screen.globals.canFireBoost = true;
      this.screen.scoreboard.update();
    }, 60000)
  }

  setupShooters() {
    this.shooters = {
      red: new this.screen.randomizer.generator({
        actionSource: this.screen.instructions,
        generators: ['red_shot'],
        attrs: { source: this },
        intervalRange: {min: 100, max: 200}
      }),

      fire: new this.screen.randomizer.generator({
        actionSource: this.screen.instructions,
        generators: ['fire_shot'],
        attrs: { source: this },
        intervalRange: {min: 100, max: 300}
      })
    }
  }

  attack() {
    this.startShooter('red')
  }

  fireBoost(attrs) {
    this.stopAllShooters()
    this.startShooter('fire', attrs);
    this.screen.globals.canFireBoost = false;

    setTimeout(() => {
      this.stopAllShooters();
      this.startShooter('red');
      this.resetFireTimer()
    }, 5000)
  }

  startShooter(shooterName, attrs) {
    if (!this.shooters[shooterName]) return;

    if (attrs)
      Object.assign(this.shooters[shooterName], attrs);
    
    this.shooters[shooterName].start();
  }

  stopShooter(shooterName) {
    if (!this.shooters[shooterName]) return;
    this.shooters[shooterName].stop();
  }

  stopAllShooters() {
    Object.keys(this.shooters).forEach(name => this.shooters[name].stop())
  }

  destroyShooters() {
    if (!this.shooter) return;

    this.rest();
    this.shooter = null;
  }

  onDestroy() {
    this.screen.globals.canCreateDeathStar = true;
    this.destroyShooters();
    this.destroyOrbits();
  }
}