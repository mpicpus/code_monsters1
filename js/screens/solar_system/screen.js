// Avatars
// Instructions
// Create as many logic classes as needed.

import { Screen } from '../screen.js';
import { InstructionsEngineSolarSystem } from './instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import { Background, BackgroundElement } from '../../background.js';
import * as PlanetMod from './planets.js';
import * as ExplosionMod from './explosions.js'
import { Randomizer } from '/js/tools/randomizer.js';
import { ScoreboardSolarSystem } from './scoreboard.js';
import { SoundSolarSystem } from './sound.js';

window.BackgroundElement = BackgroundElement;

// Note: super() will also call "initializeBackground" and "initializeThings".
// Any object declared "after" super() will NOT be available in the intializers yet.
// beforeInitialize() allows to set any needed attrs before they are called.
export class ScreenSolarSystem extends Screen {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

  // Any operation to be run before parent Screen class initialize() method.
  // thus before "initializeThings" and "initializeBackground".
  beforeInitialize() {
    this.astronomicalMultiplicator = 0.4;
    this.instructions = new InstructionsEngineSolarSystem({screen: this});
    this.randomizer = Randomizer;

    this.globals = {
      canCreateDeathStar: true,
      canCreatePlanets: true,
      canCreateSolarSystem: true,
      canFireBoost: false,
      maxNumOfPlanets: {
        total: null,
        death_star: 1,
        default: 5
      },
      canBeClickCreated: []
    }
  }

  initializeBackground() {
    this.background = new Background({name: 'background-solar-system', screen: this});

    // Base background:
    let baseElement = new BackgroundElement({
      name: 'space01',
      screen: this,
      extension: 'jpg',
      scale: 0.3,
      dimensions: {height: 'cover'},
      move: () => {}
    })

    this.background.add(baseElement);
  }

  initializeThings() {
    let explosionClasses = Object.keys(ExplosionMod);
    this.randomExplosionPicker = new this.randomizer.picker({set: explosionClasses})

    explosionClasses.forEach(exClass => {
      this.things.createAndAdd(ExplosionMod[exClass], {preload: true})
    })

    this.scoreboard = new ScoreboardSolarSystem({screen: this});
    this.sound = new SoundSolarSystem({screen: this});
    // this.instructions.solarSystem();
    
  }

  getRandomExplosion(thing) {
    let explosion = this.getRandomExplosionClass();
    if (!explosion) return;

    this.things.createAndAdd(explosion, {thing})
  }

  getRandomExplosionClass() {
    let explosionClass = this.randomExplosionPicker.pick()
    return PlanetMod[explosionClass]
  }

  addToClickGlobals(name) {
    if (!this.globals.canBeClickCreated.includes(name))
      this.globals.canBeClickCreated.push(name)
  }
}
