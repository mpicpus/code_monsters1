import {ActionQueue} from './action-queue.js'
import {SpriteSet} from './sprite-set.js'

let  spriteSets = []

// Minion class
export class Prop {
  constructor(name, speed, canvasSize) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    // this.type = type;
    // this.height = height;
    // this.position = {...position, ...{correction: {x: 0, y: 0}}};
    this.actionQueue = new ActionQueue(this);
    this.speed = parseFloat(speed) || 1;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 0;
    this.direction = 'right';
  }

  // Getters
  width(img) {
    return img.width / img.height * this.height;
  }

  setState(state) {
    let newState = this.sprites.states[state] ? state : 'idle';
    this.state = newState
  }

  // Utils
  getSprites() {
    let sprites = spriteSets.filter(set => set.type == this.type)[0];
    if (!sprites) {
      sprites = new SpriteSet('props', this.type);
      spriteSets.push(sprites);
    }

    return sprites
  }

  movementLimit(direction) {
    return {
      left: () => {return {x: 0, y: null}},
      right: () => {return {x: this.canvasSize.x - this.height, y: null}},
      up: () => {return {x: null, y: 0}},
      down: () => {return {x: null, y: this.canvasSize.y - this.height}}
    }[direction]()
  }

  isBlocked() {
    return (this.movementLimit(this.direction).x == null && this.movementLimit(this.direction).y == this.position.y) ||
    (this.movementLimit(this.direction).y == null && this.movementLimit(this.direction).x == this.position.x)
  }

  movements() {
    return {
      left: () => { this.position.x -= this.speed },
      right: () => { this.position.x += this.speed },
      up: () => { this.position.y -= this.speed },
      down: () => { this.position.y += this.speed }
    };
  }

  shouldMove() {
    return this.state == 'go' // && !this.isBlocked();
  }

  shouldStop() {
    return this.state == 'go' // && this.isBlocked();
  }

  move() {
    if (this.shouldMove())
      this.movements()[this.direction]();
  }

  stop() {
    this.reset();
    this.setState('idle')
  }

  go() {
    this.reset();
    this.setState('go')
  }

  build() {
    this.stop();
    this.currentAnimationStep = 0;
    this.setState('build');
    this.setCorrection()
  }

  appear() {
    this.reset();
    this.setState('appear');
    if (this.state == 'appear') {
      this.actionQueue.set(1, 'stop');
    }
  }

  die() {
    this.reset();
    this.setState('die');
  }

  changeSpeed() {
    return {
      up: () => this.speed += 0.25,
      down: () => this.speed -= 0.25
    }
  }

  setCorrection() {
    this.position.correction = {
      x: Math.floor(this.height - this.width(this.getCurrentSprite())),
      y: 0
    }
  }

  reset() {
    this.resetCorrection();
    this.currentAnimationStep = 0;
  }

  resetCorrection() {
    this.position.correction = {x: 0, y: 0}
  }

  updatePostion() {
    this.move(this.direction);
  }

  finalPosition() {
    return {
      x: this.position.x + this.position.correction.x,
      y: this.position.y + this.position.correction.y
    }
  }

  updateSpriteSteps() {
    this.currentAnimationStep ++;
    
    if (this.currentAnimationStep > this.sprites.images[this.state].length - 1)
      this.currentAnimationStep = 0;

    this.actionQueue.advance();
  }

  getCurrentSprite() {
    return this.sprites ? this.sprites.images[this.state][this.currentAnimationStep] : null;
  }

  methodNames() {
    return this.constructor.methodNames();
  }

  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => !['constructor'].includes(n));
  }
}

export class Zeppelin extends Prop {
  constructor(name, size, speed, canvasSize) {
    super(name, speed, canvasSize);
    this.type = 'zeppelin';
    this.height = parseInt(size) || 150;
    this.position = {x: 0 - this.height * 2.5, y: 40, correction: {x: 0, y: 0}};
    this.state = 'go';

    this.sprites = this.getSprites();
  }
}

export class Props {
  constructor(collection, canvasSize) {
    this.collection = collection || [];
    this.canvasSize = canvasSize;
  }

  names() {
    return this.collection.map(props => prop.name);
  }

  taken(name) {
    return this.names().includes(name);
  }

  add(prop) {
    this.collection.push(prop)
  }

  remove(prop) {
    delete(this.collection[this.collection.indexOf(prop)])
  }

  checkZepBoundaries() {
    this.collection.filter(prop => prop.position.x > this.canvasSize.x).forEach((prop) => this.remove(prop));
    this.collection = this.collection.filter((prop) => prop)
  }
}
