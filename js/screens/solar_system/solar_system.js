// Avatars
// Instructions
// Create as many logic classes as needed.

import { Screen } from '../screen.js';
import { InstructionsEngineSolarSystem } from './instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as BgMod from '../../background.js';
import { Randomizer } from '/js/tools/randomizer.js';

// Note: super() will also call initializeBackground and initializeThings.
// Any object declared "after" super() will NOT be available in the intializers yet.
// beforeInitialize() allows to 
export class ScreenSolarSystem extends Screen {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);

    this.astronomicalMultiplicator = 0.7;

    this.explosions = [
      ['explosion01', 74],
      ['explosion02', 20],
      ['explosion03', 24],
    ];

    this.randomizer = Randomizer;
    this.randomExplosionPicker = new this.randomizer.picker({set: this.explosions})
  }

  // Any operation to be run before parent Screen class initialize() method.
  // thus before "initializeThings" and "initializeBackground".
  beforeInitialize() {
    this.instructions = new InstructionsEngineSolarSystem({screen: this});
  }

  initializeBackground() {
    this.background = new BgMod.Background({name: 'background-solar-system', screen: this});

    // Base background:
    let baseElement = new BgMod.BackgroundElement({
      name: 'base-2',
      screen: this,
      extension: 'jpg',
      scale: 0.3,
      dimensions: {height: 'cover'},
      move: () => {}
    })

    this.background.add(baseElement);
  }

  initializeThings() {
    // let sun = this.things.createAndAdd(AvatarMod.Sun);
    // this.things.createAndAdd(AvatarMod.Mercury, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Venus, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Earth, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Mars, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Jupiter, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Saturn, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Uranus, {centerObject: sun});
    // this.things.createAndAdd(AvatarMod.Neptune, {centerObject: sun});
  }

  getRandomExplosion() {
    // return this.randomExplosionPicker.pick()
    return this.explosions[0]
  }
}
