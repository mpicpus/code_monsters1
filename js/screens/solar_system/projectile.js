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
        steps: attrs.screen.explosions[1],
        loop: false
      }
    };

    attrs.scale = 0.4;
    attrs.animationSpeed = 'fast';

    // attrs.speed = {x: 0, y: 0};

    attrs.defaultState = 'go';

    super(attrs);

    this.strength = 10;
    this.damage = 5;
    this.damageableTypes = ['planet', 'sun']
  }

  move() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    this.setPosition();
  }

  takeDamage() {
    this.destroy()
  }

  destroy() {
    this.setState('destroy');
    this.setScale(1.5 * this.scale);
    this.offsetTo('center')
  }

  onStateComplete() {
    return {
      'destroy': () => { this.remove() }
    }
  }
}
