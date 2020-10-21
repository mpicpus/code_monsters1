import { Projectile } from '../../projectile.js';

class Asteroid extends Projectile {

}

export class Asteroid01 extends Projectile {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 77,
        loop: true
      },
      destroy: {
        steps: ['explosion01', 74],
        loop: false
      }
    };

    attrs.scale = 0.5;
    attrs.animationSpeed = 'fast';

    // attrs.speed = {x: 0, y: 0};

    attrs.defaultState = 'go';

    super(attrs);

    this.strength = 10;
    this.damage = 5;
    this.damageableTypes = ['planet']
  }

  move() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    this.setPosition();
  }

  destroy() {
    this.setScale = 1;
    this.setState('destroy');
  }

  onStateComplete() {
    return {
      'destroy': () => { this.remove() }
    }
  }
}
