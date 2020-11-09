import { Scoreboard } from '../../scoreboard.js';
import * as AvatarMod from './avatar.js';

export class ScoreboardSolarSystem extends Scoreboard {
  constructor(attrs = {}) {
    attrs.figures = {
      counts: {},
      things: {
        sun: {}
      }
    }

    super(attrs)
  }
}