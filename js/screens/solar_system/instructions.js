import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as ProjectileMod from './projectile.js';

window.asteroid = ProjectileMod.Asteroid01;

export class InstructionsEngineSolarSystem extends InstructionsEngine {
  attack() {
    this.asteroidGenerator = this.asteroidGenerator || new this.screen.randomizer.generator({
      source: this,
      generators: ['asteroid01'],
      intervalRange: {min: 100, max: 2000},
      boost: {
        interval: 120000,
        quantityRange: [8, 25]
      }
    })

    this.asteroidGenerator.start()
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
      speed: {x: Math.random() * 5 + 2, y: Math.random() * 5 + 2}})
  }

  sun() {
    this.screen.things.createAndAdd(AvatarMod.Sun)
  }

  mercury() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Mercury, {centerObject: sun})
  }

  venus() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Venus, {centerObject: sun})
  }

  earth() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Earth, {centerObject: sun})
  }

  mars() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Mars, {centerObject: sun})
  }

  jupiter() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Jupiter, {centerObject: sun})
  }

  saturn() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Saturn, {centerObject: sun})
  }

  uranus() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Uranus, {centerObject: sun})
  }

  neptune() {
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(AvatarMod.Neptune, {centerObject: sun})
  }

  solarSystem() {
    let bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']

    bodies.forEach((body, index) => {
      if (body == 'sun' && this.screen.things.sun[0]) return;
      setTimeout(() => { this[body]() }, 800 * index)
    })
  }

}