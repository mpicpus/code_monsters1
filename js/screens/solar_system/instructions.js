import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as PlanetMod from './planets.js';
import * as ProjectileMod from './projectiles.js';

export class InstructionsEngineSolarSystem extends InstructionsEngine {
  attack() {
    this.asteroidGenerator = this.asteroidGenerator || new this.screen.randomizer.generator({
      actionSource: this,
      generators: ['asteroid01'],
      intervalRange: {min: 100, max: 500},
      boost: {
        interval: 30000,
        quantityRange: [28, 45]
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
      speed: {x: Math.random() * 3 + 2, y: Math.random() * 3 + 2},
      scale: 0.4
    })
  }

  sun() {
    if (this.screen.things.sun.length > 0) return;
    this.screen.things.createAndAdd(PlanetMod.Sun)
    this.screen.addToClickGlobals('sun')
  }

  mercury() {
    if (this.screen.things.mercury.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Mercury, {centerObject: sun})
    this.screen.addToClickGlobals('mercury')
  }

  venus() {
    if (this.screen.things.venus.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Venus, {centerObject: sun})
    this.screen.addToClickGlobals('venus')
  }

  earth() {
    if (this.screen.things.earth.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Earth, {centerObject: sun})
    this.screen.addToClickGlobals('earth')
  }

  mars() {
    if (this.screen.things.mars.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Mars, {centerObject: sun})
    this.screen.addToClickGlobals('mars')
  }

  jupiter() {
    if (this.screen.things.jupiter.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Jupiter, {centerObject: sun})
    this.screen.addToClickGlobals('jupiter')
  }

  saturn() {
    if (this.screen.things.saturn.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Saturn, {centerObject: sun})
    this.screen.addToClickGlobals('saturn')
  }

  uranus() {
    if (this.screen.things.uranus.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Uranus, {centerObject: sun})
    this.screen.addToClickGlobals('uranus')
  }

  neptune() {
    if (this.screen.things.neptune.length > this.screen.globals.maxNumOfPlanets.default) return;
    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.Neptune, {centerObject: sun})
    this.screen.addToClickGlobals('neptune')
  }

  death(attrs) {
    if (attrs[0] != 'star') return;
    if (this.screen.things.death_star.length == this.screen.globals.maxNumOfPlanets.death_star) return;

    let sun = this.screen.things.sun[0];
    if (!sun) return;
    this.screen.things.createAndAdd(PlanetMod.DeathStar, {centerObject: sun})
    this.screen.addToClickGlobals('death_star')
  }

  red_shot(attrs) {
    if (!attrs || !attrs.source || attrs.source.dead) return;
    if (!this.screen.things.asteroid[0]) return;

    this.screen.things.createAndAdd(ProjectileMod.RedShot, {
      source: attrs.source
    })
  }

  fire_shot(attrs) {
    if (!attrs || !attrs.source || attrs.source.dead) return;
    if (!this.screen.things.asteroid[0]) return;

    this.screen.things.createAndAdd(ProjectileMod.FireShot, {
      source: attrs.source
    })
  }

  fire_boost(attrs) {
    if (!this.screen.globals.canFireBoost) return;

    let planet = attrs.planet || this.screen.things.death_star[0];
    if (!planet) return;
    
    planet.fireBoost(attrs);
  }

  s() {this.solar(['system', true])}

  solar(attrs) {
    if (attrs[0] != 'system') return;
    if (!attrs[1]) return;
    if (!this.screen.globals.canCreateSolarSystem) return;

    let bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']

    bodies.forEach((body, index) => {
      if (body == 'sun' && this.screen.things.sun[0]) return;
      setTimeout(() => { this[body]() }, 1000 * index + 1)
    })

    this.screen.globals.canCreateSolarSystem = false;
  }
}