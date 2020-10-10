// Avatars
// Instructions
// Create as many logic classes as needed.

import { Screen } from '../screen.js';
import { InstructionsEngineInitial } from './instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as BgMod from '../../background.js';

// Note: super() will also call initializeBackground and initializeThings.
// Any object declared "after" super() will NOT be available in the intializers yet.
// beforeInitialize() allows to 
export class ScreenInitial extends Screen {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

  // Any operation to be run before parent Screen class initialize() method.
  // thus before "initializeThings" and "initializeBackground".
  beforeInitialize() {
    this.instructions = new InstructionsEngineInitial({screen: this});
  }

  initializeBackground() {
    this.background = new BgMod.Background({name: 'background-initial', screen: this});

    // Base background:
    let baseElement = new BgMod.BackgroundElement({
      name: 'base',
      screen: this,
      extension: 'jpg',
      dimensions: {height: this.canvas.canvasSize.y},
      move: () => {}
    })

    this.background.add(baseElement);
  }

  initializeThings() {
    let attrs = {
      name: 'matt',
      position: {x: this.canvas.canvasSize.x * 0.01, y: this.canvas.canvasSize.y * 0.75},
      dimensions: {height: 150},
      scale: .5
    };

    this.things.createAndAdd(AvatarMod.PeaCannon, attrs);

    // Zombie apocalypse:
    this.instructions.attack();
  }
}
