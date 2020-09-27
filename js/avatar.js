import { Thing } from './thing.js';
import { InstructionSet } from './instructions.js'
import * as ProjectileMod from './projectile.js';


export class Avatar extends Thing {
  constructor(attrs) {
    attrs.displaysName = true;
    super(attrs)
  }
}


// Some avatars shared across different screens.
export class Robot extends Avatar {
  constructor(attrs = {}) {
    attrs.states = {
        idle: 5,
        go: 5,
        die: 9,
        build: 7,
        appear: 9
      };

    super(attrs);
  }
}

export class StoneRobot extends Avatar {
  constructor(attrs = {}) {
    attrs.states = {
      appear: 15,
      build: 6,
      die: 7,
      go: 6,
      idle: 6
    },
    
    super(attrs);
  }
}
