import { InstructionsEngine } from './instructions-engine.js';
import { Background } from './background.js';
import { Documentation } from './documentation.js';
import { Minion, Minions } from './minion.js';
import { Trap, Traps } from './trap.js';
import { Prop, Props, Zeppelin, Train } from './prop.js';
import { Track, TrackSet, TrackPath } from './track.js';

export class Screen {
  constructor(background, things, instructions) {
    this.background = background;
    this.things = things;
    this.instructions = instructions;

    this.defaultSizes = {
      minion: 180,
      trap: 45,
      track: 70,
      font: 13,
    };
  }
}
