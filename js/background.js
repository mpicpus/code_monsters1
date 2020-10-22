import { Thing, Things } from './thing.js'

export class Background extends Things {
  constructor(attrs = {}) {
    super(attrs);

    this.move = () => {};
    this.interact = () => {};
  }
}

export class BackgroundElement extends Thing {
  constructor(attrs = {}) {
    super(attrs);

    this.level = 0;
  }

  onSpritesLoaded() {
    if (!this.dimensions) return;

    let dimension = Object.keys(this.dimensions)[0];

    if (typeof(this.dimensions[dimension]) == 'number')
      this.setScaleFromNumeric(this.dimensions[dimension]);
    else
      this.setScaleFromKeyword(this.dimensions[dimension]);
  }

  setScaleFromKeyword(keyword) {
    let actions = {
      cover: () => {
        // let sprite = this.currentSprite();
        // if (!sprite) {
        //   setTimeout(() => {
        //     this.setScaleFromKeyword(keyword);
        //   }, 500);

        //   return
        // }
        // let scale = Math.max(...[sprite.width / this.screen.canvas.canvasSize.x, sprite.height / this.screen.canvas.canvasSize.y])
        // console.log(scale);
        // this.setScale(scale)
      }
    }

    if (Object.keys(actions).includes(keyword))
      actions[keyword]()
  }

  setScaleFromNumeric() {}
}