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
      idle: 60
    },

    attrs.animationSpeed = 'faster';

    super(attrs);
    this.throw();
    this.startCannon();
  }

  startCannon() {
    if (this.shotInterval) return;
    
    this.shotInterval = setInterval(() => { this.throw() }, 800);
  }

  stopCannon() {
    if (!this.shotInterval) return;

    clearInterval(this.shotInterval);
    this.shotInterval = null;
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
      idle: 20,
      go: 20
    }

    attrs.animationSpeed = 'medium';
    attrs.defaultState = 'go';
    super(attrs);
  }

  move() {
    this.position.x -= 0.5;
    this.setPosition();
  }
}
