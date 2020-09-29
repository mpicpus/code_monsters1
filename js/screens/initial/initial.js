import { Screen } from '../screen.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as BgMod from '../../background.js';
import * as InstructMod from '../../instructions.js';
import { Randomizer } from '/js/tools/randomizer.js';

// Note: super() calls initializeBackground and initializeThings.
// Any object declared "after" super will NOT be available in the intializers yet.
export class ScreenInitial extends Screen {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

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
    // Initialize things
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

class InstructionsEngineInitial extends InstructMod.InstructionsEngine {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

  attack() {
    if (!this.enemyGenerator)
      this.enemyGenerator = new Randomizer.generator({
        source: this,
        generators: ['zombie', 'zombiepvz', 'zombiepvz2'],
        intervalRange: {min: 150, max: 4000}
      })

    this.enemyGenerator.start();
  }

  truce() {
    if (!this.enemyGenerator || this.enemyGenerator.state != 'active') return;

    this.enemyGenerator.stop();
  }

  zombiepvz() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.65},
      dimensions: {height: 150},
      scale: 1
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].startCannon()
  }

  zombiepvz2() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.45},
      dimensions: {height: 150},
      scale: 1.8
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie2, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].startCannon()
  }

  zombie() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.65},
      dimensions: {height: 150},
      scale: .85
    };

    this.screen.things.createAndAdd(AvatarMod.Zombie, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].startCannon()
  }

  dragon1() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 1, y: this.screen.canvas.canvasSize.y * 0.50},
      dimensions: {height: 150},
      scale: [-1, 1]
    };

    this.screen.things.createAndAdd(AvatarMod.Dragon1, attrs);
    // this.setPosition({x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.50})
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].startCannon()
  }

  peacannon() {

  }

  turbo() {
    if (window.turboMode || window.turboResting) return;
    window.turboMode = true;

    this.screen.things.good_guys.forEach((thing) => { if(thing.setTurboMode) thing.setTurboMode() })
    setTimeout(() => {
      this.screen.things.good_guys.forEach((thing) => { if(thing.removeTurboMode) thing.removeTurboMode() });
      window.turboMode = false;
      window.turboResting = true;

      setTimeout(() => { window.turboResting = false }, 5000)
    }, 2000)
  }
}
