import { InstructionsEngine } from '../../instructions.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import { Randomizer } from '/js/tools/randomizer.js';

export class InstructionsEngineInitial extends InstructionsEngine {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

  attack() {
    if (!this.enemyGenerator)
      this.enemyGenerator = new Randomizer.generator({
        source: this,
        generators: ['zombie', 'zombiepvz', 'zombiepvz2', 'dragon1', 'dragon7'],
        intervalRange: {min: 100, max: 4000}
      })

    this.enemyGenerator.start();
  }

  truce() {
    if (!this.enemyGenerator || this.enemyGenerator.state != 'active') return;

    this.enemyGenerator.stop();
  }

  zombiepvz() {
    let attrs = {
      displayName: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.65},
      dimensions: {height: 150},
      scale: 1
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].attack()
  }

  zombiepvz2() {
    let attrs = {
      displayName: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.45},
      dimensions: {height: 150},
      scale: 1.8
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie2, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].attack()
  }

  zombie() {
    let attrs = {
      displayName: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.65},
      dimensions: {height: 150},
      scale: .85
    };

    this.screen.things.createAndAdd(AvatarMod.Zombie, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].attack()
  }

  dragon1() {
    let attrs = {
      displayName: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 1.5, y: this.screen.canvas.canvasSize.y * 0.40},
      dimensions: {height: 150},
      scale: [-1, 1]
    };

    this.screen.things.createAndAdd(AvatarMod.Dragon1, attrs);
    // this.setPosition({x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.50})
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].attack()
  }

    dragon7() {
    let attrs = {
      displayName: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 1.1, y: this.screen.canvas.canvasSize.y * 0.40},
      dimensions: {height: 150},
      scale: [-1, 1]
    };

    this.screen.things.createAndAdd(AvatarMod.Dragon7, attrs);
    // this.setPosition({x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.50})
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].attack()
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
