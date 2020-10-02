import { Avatar } from '../../avatar.js';
import * as ProjectileMod from './projectile.js';

export class BadGuys extends Avatar {
  constructor(attrs = {}) {
    attrs.takesDamage = true;
    super(attrs)
  }
}

export class GoodGuys extends Avatar {
  constructor(attrs = {}) {
    super(attrs)
  }
}

// Plants VS Zombies
export class PeaCannon extends GoodGuys {
  constructor(attrs = {}) {
    attrs.states = {
      idle: { steps: 60, loop: true }
    },

    attrs.animationSpeed = 'faster';

    super(attrs);
    this.shotSpan = 800;
    this.throw();
    this.startCannon();
  }

  startCannon() {
    if (this.shotInterval) return;
    
    this.shotInterval = setInterval(() => { this.throw() }, this.shotSpan);
  }

  stopCannon() {
    if (!this.shotInterval) return;

    clearInterval(this.shotInterval);
    this.shotInterval = null;
  }

  setTurboMode() {
    this.stopCannon();
    this.shotSpan = 50;
    this.startCannon();
  }

  removeTurboMode() {
    this.stopCannon();
    this.shotSpan = 800;
    this.startCannon();
  }

  throw() {
    if (!this.sprites.loaded) return;

    let position = {
      x: this.position.x + this.sprites.sprites.idle.getBounds().width * 0.8,
      y: this.position.y + this.sprites.sprites.idle.getBounds().width * 0.1
    };

    this.screen.things.createAndAdd(ProjectileMod.Pea, {position: position, screen: this.screen})

    if (!this.screen.things.bad_guys || this.screen.things.bad_guys.length == 0) this.stopCannon();
  }
}

export class PvzZombie extends BadGuys {
  constructor(attrs = {}) {
    attrs.states = {
      idle: { steps: 20, loop: true },
      go: { steps: 20, loop: true }
    }

    attrs.animationSpeed = 'medium';
    attrs.defaultState = 'go';
    attrs.strength = 5;
    super(attrs);
    this.displaysName = false;
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
  }
}

export class PvzZombie2 extends BadGuys {
  constructor(attrs = {}) {
    attrs.states = {
      idle: { steps: 38, loop: true },
      go: { steps: 38, loop: true }
    }

    attrs.animationSpeed = 'medium';
    attrs.defaultState = 'go';
    attrs.strength = 5;
    super(attrs);
    this.displaysName = false;
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
  }
}

export class Zombie extends BadGuys {
  constructor(attrs) {
    attrs.states = {
      appear: { steps: 11, loop: false },
      build: { steps: 7, loop: false },
      die: { steps: 8, loop: false },
      go: { steps:10 },
      idle: { steps: 6 }
    }

    attrs.animationSpeed = 'medium';
    attrs.defaultState = 'appear';
    attrs.strength = 10;
    super(attrs);
    this.displaysName = false;
  }

  onStateComplete() {
    return {
      appear: () => {
        this.setState('go');
      },
      die: () => {
        this.destroy();
      }
    }
  }

  onTotalDamage() {
    this.die();
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
  }

  die() {
    this.setState('die')
  }
}

export class Dragon1 extends BadGuys {
  constructor(attrs) {
    attrs.states = {
      go: { steps: 40 },
      idle: { steps: 40 }
    }

    attrs.animationSpeed = 'fast';
    attrs.defaultState = 'go';
    attrs.strength = 20;
    super(attrs);
    this.displaysName = false;
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
    console.log(this.position.x);
  }
}

export class Dragon7 extends BadGuys {
  constructor(attrs) {
    attrs.states = {
      go: { steps: 9 },
      idle: { steps: 9 }
    }

    attrs.animationSpeed = 'medium';
    attrs.defaultState = 'go';
    attrs.strength = 20;
    super(attrs);
    this.displaysName = false;
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
    console.log(this.position.x);
  }
}