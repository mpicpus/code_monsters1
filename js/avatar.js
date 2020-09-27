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
      idle: { steps: 5, loop: true },
      go: { steps: 5, loop: true },
      die: { steps: 9, loop: true },
      build: { steps: 7, loop: true },
      appear: { steps: 9, loop: true }
    };

    super(attrs);
  }
}

export class StoneRobot extends Avatar {
  constructor(attrs = {}) {
    attrs.states = {
      appear: { steps: 15, loop: true },
      build: { steps: 6, loop: true },
      die: { steps: 7, loop: true },
      go: { steps: 6, loop: true },
      idle: { steps: 6, loop: true }
    },
    
    super(attrs);
  }
}
