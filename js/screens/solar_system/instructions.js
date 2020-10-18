import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import { Randomizer } from '/js/tools/randomizer.js';

export class InstructionsEngineSolarSystem extends InstructionsEngine {
  sun() {
    this.screen.things.createAndAdd(AvatarMod.Sun)
  }

  mercury() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Mercury, {centerObject: sun})
  }

  venus() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Venus, {centerObject: sun})
  }

  earth() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Earth, {centerObject: sun})
  }

  mars() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Mars, {centerObject: sun})
  }

  jupiter() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Jupiter, {centerObject: sun})
  }

  saturn() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Saturn, {centerObject: sun})
  }

  uranus() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Uranus, {centerObject: sun})
  }

  neptune() {
    let sun = this.screen.things.sun[0];
    this.screen.things.createAndAdd(AvatarMod.Neptune, {centerObject: sun})
  }

}