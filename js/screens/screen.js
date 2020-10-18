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

    this.beforeInitialize();
    this.initialize();
    this.afterInitialize()
  }

  initialize() {
    this.initializeBackground();
    this.initializeThings();

    this.renderer.gameLoop = this.gameLoop
  }

  familyName() {
    return this.constructor.name.replace('Screen', '').replace(/([A-Z]+)/g, '_$1').toLowerCase().replace(/^_/, '')
  }

  // Main game loop, called for each graphic render.
  // Redefine in subclass if needed.
  gameLoop() {
    this.things.move();
  }

  beforeInitialize() {} // Define in subclass.
  afterInitialize() {} // Define in subclass.
  initializeBackground() {} // Define in subclass.
  initializeThings() {} // Define in subclass.


  // Imports arbitrary Screen modules.
  // Screen modules just need to be created inside /js/screens/screen-module-name/screen-module-name.js
  // Accepts initial attrs object.
  static get(name, attrs = {}) {
    function toClassName(string) {
      return string
              .split('_')
              .map(i => i.replace(/(^\w{1})/g, match => match.toUpperCase()))
              .join('');
    }

    let className = `Screen${toClassName(name)}`;

    return new Promise((resolve, reject) => {
      let url = `/js/screens/${name}/${name}.js`;
      import(url).then((module) => {
        if (module && module[className]){
          let instance = new module[className](attrs)
          resolve(instance)
        } else reject('Module not found')
      }).catch((e) => reject(e))
    })
  }
}

window.screen = Screen;
