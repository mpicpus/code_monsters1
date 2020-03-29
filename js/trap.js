import {ActionQueue} from './action-queue.js'
import {SpriteSet} from './sprite-set.js'

let  spriteSets = []

// Minion class
export class Trap {
  constructor(name, type, height, position, canvasSize) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    this.type = type;
    this.height = height;
    this.position = {...position, ...{correction: {x: 0, y: 0}}};
    this.actionQueue = new ActionQueue(this);
    this.speed = 0.25;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 0;
    this.direction = 'right';

    this.sprites = this.getSprites();
    this.hotPointsCalculator = this.constructor.getHotPointsCalculator(this.type)
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
      sprites = new SpriteSet('traps', this.type);
      spriteSets.push(sprites);
    }

    return sprites
  }

  getHotPoints() {
    return this.hotPointsCalculator.map((point) => {
      return {x: this.position.x + this.masterWidth() * point[0], y: this.position.y + this.height * point[1]}
    })
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
    return this.state == 'go' && !this.isBlocked();
  }

  shouldStop() {
    return this.state == 'go' && this.isBlocked();
  }

  move() {
    if (this.shouldMove())
      this.movements()[this.direction]();
    else if (this.shouldStop())
      this.stop();
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
    this.size = 2 * this.size;
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

  // We assume any sprite has an 'idle' state with at least one image.
  masterSprite() {
    return this.sprites ? this.sprites.images['idle'][0] : null;
  }

  masterWidth() {
    return this.width(this.masterSprite());
  }

  methodNames() {
    return this.constructor.methodNames();
  }

  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => !['constructor'].includes(n));
  }

  static getHotPointsCalculator(type) {
    return {
      mine: [
        [0.5, 0.5],
        [0.25, 0.75],
        [0, 1],
        [0.75, 0.75],
        [1, 1],
        [0.5, 1]
      ],
    }[type] || [];
  }
}

export class Traps {
  constructor(type, collection) {
    this.collection = collection || [];
  }

  names() {
    return this.collection.map(traps => trap.name);
  }

  taken(name) {
    return this.names().includes(name);
  }

  add(trap) {
    this.collection.push(trap)
  }

  remove(trap) {
    delete(this.collection[this.collection.indexOf(trap)])
  }
}
