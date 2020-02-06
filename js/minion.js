import {ActionBuffer} from './action-buffer.js'
import {SpriteSet} from './sprite-set.js'

let  spriteSets = []

// Minion class
export class Minion {
  constructor(name, type, height, position, canvasSize) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    this.type = type;
    this.height = height;
    this.position = {...position, ...{correction: {x: 0, y: 0}}};
    this.actionBuffer = new ActionBuffer(this);
    this.speed = 0.25;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 1;
    this.direction = 'right';

    this.sprites = this.getSprites();
  }

  // Getters
  width(img) {
    return img.width / img.height * this.height;
  }

  // Utils
  getSprites() {
    let sprites = spriteSets.filter(set => set.type == this.type)[0];
    if (!sprites) {
      sprites = new SpriteSet(this.type);
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
    this.state = 'idle'
  }

  go() {
    this.reset();
    this.state = 'go'
  }

  build() {
    this.stop();
    this.currentAnimationStep = 0;
    this.state = 'build';
    this.setCorrection()
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
    console.log('correction: ', this.position.correction)
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
      this.currentAnimationStep = 1;

    this.actionBuffer.advance();
  }

  getCurrentSprite() {
    return this.sprites ? this.sprites.images[this.state][this.currentAnimationStep] : null;
  }
}

export class Minions {
  constructor(collection) {
    this.collection = collection || [];
  }

  names() {
    return this.collection.map(minion => minion.name);
  }

  taken(name) {
    return this.names().includes(name);
  }

  add(minion) {
    this.collection.push(minion)
  }

  remove(minion) {
    this.collection = this.collection.filter(m => m != minion)
  }
}
