import { Renderer } from '../renderer.js';
import { Canvas } from '../canvas.js';
import { SpritesCollection } from '../sprite-set.js';
import { Things } from '../thing.js';

export class Screen {
  constructor({
    name = '',
    renderer = {},
    background = {},
    things = {},
    instructions = {},
    defaultSizes = {
      thing: 180,
      trap: 45,
      font: 13,
    }
  } = {}) {
    Object.assign(this, {
      background,
      things,
      instructions,
      defaultSizes
    });

    this.canvas = new Canvas();
    this.renderer = new Renderer({screen: this});
    this.spritesCollection = new SpritesCollection(this.renderer);
    this.things = new Things({name: this.name, screen: this});

    // this.initializeSpriteLoops()
    this.initialize()
  }

  initialize() {
    this.initializeBackground();
    this.initializeThings();

    this.renderer.gameLoop = this.gameLoop
  }

  initializeBackground() {} // Define in subclass.

  initializeThings() {} // Define in subclass.

  familyName() {
    return this.constructor.name.replace(/screen/gi, '').toLowerCase()
  }

  gameLoop() {} // Define in subclass.

  static loopSpeeds() {
    return {
      slow: 250,
      medium: 150,
      fast: 70,
      faster: 50,
      fastest: 35
    }
  }

  // Imports arbitrary Screen modules.
  // Screen modules just need to be created inside /js/screens/screen-module-name/screen-module-name.js
  // Accepts initial attrs object.
  static get(name, attrs = {}) {
    function capitalize(string) {
      return string.replace(/(^\w{1})/g, match => match.toUpperCase())
    }

    let className = `Screen${capitalize(name)}`;

    return new Promise((resolve, reject) => {
      import(`/js/screens/${name}/${name}.js`).then((module) => {
        if (module && module[className]){
          let instance = new module[className](attrs)
          resolve(instance)
        } else reject('Module not found')
      }).catch((e) => reject(e))
    })
  }
}
