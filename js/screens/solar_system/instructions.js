import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as ProjectileMod from './projectile.js';
import { Randomizer } from '/js/tools/randomizer.js';

window.asteroid = ProjectileMod.Asteroid01;

export class InstructionsEngineSolarSystem extends InstructionsEngine {
  attack() {
    this.asteroidGenerator = this.asteroidGenerator || new Randomizer.generator({
      source: this,
      generators: ['asteroid01'],
      intervalRange: {min: 100, max: 4000}
    })

    this.asteroidGenerator.start()
  }

  truce() {
    if(!this.asteroidGenerator) return;

    this.asteroidGenerator.stop();
  }

  asteroid01() {
    this.screen.things.createAndAdd(ProjectileMod.Asteroid01, {speed: {x: 3, y: Math.random() * 2}})
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

}