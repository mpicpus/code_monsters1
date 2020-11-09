import { Projectile } from '../../projectile.js';
import * as AvatarMod from './avatar.js';

export class Pea extends Projectile {
  constructor(attrs = {}) {
    attrs.states = {
      idle: 1,
      go: 1
    };

    attrs.boundingShape = {
      shape: 'circle'
    }

    attrs.scale = .15;

    super(attrs);

    this.damage = 1;
    this.strength = 1;
    this.damageableTypes = ['bad_guys']
  }

  move() { 
    this.position.x += 10;
    this.setPosition();
  }
}
