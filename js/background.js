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
}