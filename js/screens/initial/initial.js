import { Screen } from '../screen.js';
import * as AvatarBasicMod from '../../avatar.js';
import * as AvatarMod from './avatar.js';
import * as BgMod from '../../background.js';
import * as InstructMod from '../../instructions.js';

export class ScreenInitial extends Screen {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
    
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

    // let times = new Array(1).fill(null)
    // times.forEach((t) => this.things.add(new AvatarMod.PeaCannon(firstThingAttrs)))
    this.things.createAndAdd(AvatarMod.PeaCannon, attrs);

    attrs = {
      name: 'zom1',
      position: {x: this.canvas.canvasSize.x * 0.8, y: this.canvas.canvasSize.y * 0.70},
      dimensions: {height: 150},
      scale: 1
    };

    this.things.createAndAdd(AvatarMod.PvzZombie, attrs);

    // Zombie apocalypse:
    this.generateRandomZombie();
  }

  generateRandomZombie() {
    let zombieTypes = {
      1: 'zombie',
      2: 'zombiepvz'
    }

    let randomWait = Math.random() * 3000 + 50;
    setTimeout(() => {
      let selectedZombieType = zombieTypes[Math.floor(Math.random() * 2 + 1)];
      console.log(selectedZombieType);
      this.instructions[selectedZombieType]();
      this.generateRandomZombie();
    }, randomWait)
  }

  // Main game loop, called for each graphic render.
  gameLoop() {
    this.things.move();
    this.manageProjectiles()
  }

  manageProjectiles() {
    let projectiles = this.things.projectile;

    if (projectiles) {
      projectiles.forEach((projectile) => {
        let thing = projectile.hitThing();
        if (thing) {
          thing.takeDamage(projectile.damage);
          this.things.remove(projectile);
        }
      })
    }
  }
}

export class InstructionsEngineInitial extends InstructMod.InstructionsEngine {
  constructor(attrs) {
    attrs = attrs || {};
    super(attrs);
  }

  zombiepvz() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.70},
      dimensions: {height: 150},
      scale: 1
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie, attrs);
    if (this.screen.things.pea_cannon && this.screen.things.pea_cannon.length > 0)
      this.screen.things.pea_cannon[0].startCannon()
  }

  zombie() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.70},
      dimensions: {height: 150},
      scale: .85
    };

    this.screen.things.createAndAdd(AvatarMod.Zombie, attrs);
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
