import { Thing } from '../../thing.js';
import { Avatar } from '../../avatar.js';

export class Sun extends Thing {
  constructor(attrs = {}) {
    attrs.states = {
      idle: {steps: 23, loop: true},
      destroy: {steps: ['explosion_nova', 120], loop: false}
    };
    attrs.scale = 0.2;

    attrs.takesDamage = true;
    attrs.damage = 40;
    attrs.strength = 40;

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

    super(attrs);

    this.orbitRadius = attrs.orbitRadius;
    this.centerObject = attrs.centerObject;
    this.angle = attrs.angle;
    this.hasOrbit = attrs.hasOrbit == false ? false : true;
    this.showName = attrs.showName == false ? false : true;

    this.takesDamage = true;
    this.damage = 20;
    this.moons = [];

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
  }

  destroyMoons() {
    this.moons.forEach(moon => moon.destroy())
  }

  destroyOrbits() {
    if (this.orbit) this.orbit.destroy();
  }

  onDestroy() {
    this.destroyMoons();
    this.destroyOrbits();
  }

  destroy() {
    if (!this.currentSprite() || !this.currentSprite().transform) return;

    this.onDestroy();
    this.setScale(8 * this.scale);
    this.setState('destroy')
    this.offsetTo('center');
    this.destroyChildren();
  }

  onStateComplete() {
    return {
      'destroy': () => {
        this.remove()
      }
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

    this.graphics = this.thing.screen.renderer.graphics;
    this.addOrbit()
  }

  addOrbit() {
    let attrs = {
      x: this.thing.centerObject.getCenterPosition().x,
      y: this.thing.centerObject.getCenterPosition().y,
      radius: this.thing.orbitRadius
    }

    this.graphics.lineStyle(this.thickness, this.color);
    this.graphics.drawCircle(attrs.x, attrs.y, attrs.radius);
    this.graphics.endFill();

    this.thing.screen.renderer.stage.addChild(this.graphics)
  }

  destroy() {
    // this.graphics.clear();
  }
}

export class Mercury extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
      }
    };

    // attrs.orbitRadius = 0.4;
    attrs.orbitRadius = 100;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Venus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
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
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
      }
    };

    // attrs.orbitRadius = 1;
    attrs.orbitRadius = 300;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    super(attrs);
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
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
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
    super(attrs)
  }
}

export class Mars extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
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
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
      }
    };

    // attrs.orbitRadius = 5.2;
    attrs.orbitRadius = 500;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    super(attrs)
  }
}

export class Saturn extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
      }
    };

    // attrs.orbitRadius = 9.5;
    attrs.orbitRadius = 600;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Uranus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
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
      },
      destroy: {
        steps: attrs.screen.getRandomExplosion(),
        loop: false
      }
    };

    // attrs.orbitRadius = 30.1;
    attrs.orbitRadius = 800;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}



window.Saturn = Saturn