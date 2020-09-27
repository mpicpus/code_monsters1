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

  zombie() {
    let attrs = {
      name: 'zom1',
      position: {x: this.screen.canvas.canvasSize.x * 0.8, y: this.screen.canvas.canvasSize.y * 0.70},
      dimensions: {height: 150},
      scale: 1
    };

    this.screen.things.createAndAdd(AvatarMod.PvzZombie, attrs);
  }
}
