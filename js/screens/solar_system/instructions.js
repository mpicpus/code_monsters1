import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as ProjectileMod from './projectile.js';

export class InstructionsEngineSolarSystem extends InstructionsEngine {
  attack() {
    this.asteroidGenerator = this.asteroidGenerator || new this.screen.randomizer.generator({
      source: this,
      generators: ['asteroid01'],
      intervalRange: {min: 100, max: 1000},
      boost: {
        interval: 120000,
        quantityRange: [8, 25]
      }
    })

    this.asteroidGenerator.start();
    this.available = true;
  }

  truce() {
    if(!this.asteroidGenerator) return;

    this.asteroidGenerator.stop();
  }

  boost() {
    this.asteroidGenerator.launchBoost()
  }

  asteroid01() {
    this.screen.things.createAndAdd(ProjectileMod.Asteroid01, {
      position: {x: -200, y: -200},
      speed: {x: Math.random() * 3 + 2, y: Math.random() * 3 + 2}})
  }

  red_shot(attrs) {
    if (!attrs || !attrs.source || attrs.source.dead) return;
    if (!this.screen.things.asteroid[0]) return;

    this.screen.things.createAndAdd(ProjectileMod.RedShot, {
      source: attrs.source
    })
  }

  r() {
    this.red_shot()
  }

  sun() {
    if (this.screen.things.sun.length > 0) return;
    this.screen.things.createAndAdd(AvatarMod.Sun)
  }

  mercury() {
    if (this.screen.things.mercury.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Mercury, {centerObject: sun})
  }

  venus() {
    if (this.screen.things.venus.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Venus, {centerObject: sun})
  }

  earth() {
    if (this.screen.things.earth.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Earth, {centerObject: sun})
  }

  mars() {
    if (this.screen.things.mars.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Mars, {centerObject: sun})
  }

  jupiter() {
    if (this.screen.things.jupiter.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Jupiter, {centerObject: sun})
  }

  saturn() {
    if (this.screen.things.saturn.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Saturn, {centerObject: sun})
  }

  uranus() {
    if (this.screen.things.uranus.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Uranus, {centerObject: sun})
  }

  neptune() {
    if (this.screen.things.neptune.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Neptune, {centerObject: sun})
  }

  death(attrs) {
    if (attrs[0] != 'star') return;
    if (this.screen.things.death_star.length == this.screen.globals.maxNumOfPlanets.death_star) return;

    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.DeathStar, {centerObject: sun})
  }

  s() {this.solar(['system'])}

  solar(attrs) {
    if (attrs[0] != 'system') return;
    if (!this.screen.globals.canCreateSolarSystem) return;

    let bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']

    bodies.forEach((body, index) => {
      if (body == 'sun' && this.screen.things.sun[0]) return;
      setTimeout(() => { this[body]() }, 1000 * index + 1)
    })

    this.screen.globals.canCreateSolarSystem = false;
  }
}