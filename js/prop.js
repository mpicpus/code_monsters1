import {ActionQueue} from './action-queue.js'
import {SpriteSet} from './sprite-set.js'
import {Speed} from './speed.js'

let  spriteSets = []

// Minion class
export class Prop {
  constructor(name, speed, canvasSize, updateSpeed, type) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    this.type = type;
    // this.height = height;
    // this.position = {...position, ...{correction: {x: 0, y: 0}}};
    this.actionQueue = new ActionQueue(this);
    this.speed = parseFloat(speed) || 1;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 0;
    this.direction = 'right';
    this.recalculateHeight = false;
    this.updateSpeed = updateSpeed || 'medium';

    this.speedObject = new Speed(this.speed, null);

    this.sprites = this.getSprites();

    if (['idle', 'go'].includes(this.state)) {
      setTimeout(() => {
        this.currentAnimationStep = Math.round(Math.random() * (this.numOfSpritesFor(this.state) - 1));
        console.log(this.currentAnimationStep);
      }, 300)
    }
  }

  // Getters
  width(img) {
    if (!img) debugger;

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

  numOfSpritesFor(state) {
    return this.sprites.images[state] ? this.sprites.images[state].length : null;
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

  setSpeed(speed) {
    this.speedObject.setSpeed(speed);
  }

  setTargetSpeed(speed) {
    this.speedObject.setTarget(speed);
  }

  move() {
    if (this.shouldMove()){
      this.speedObject.update();
      
      this.speed = this.speedObject.currentSpeed;

      if (this.speedObject.isZero()) {
        this.stop();
        this.speedObject.normalizeValues();
      } else
        this.movements()[this.direction]();
    }

    if (this.height == 0)
      this.setNativeHeight();
  }

  breaks() {
    if (this.state = 'go') {
      this.setTargetSpeed(0);
    }
  }

  s() { this.breaks() }

  resume() {
    if (this.state != 'go') {
      this.speedObject.resume();
      this.go();
    }
  }

  g() { this.resume() }

  r() {
    this.resume();
    if (this.speedObject.targetSpeed < 15)
      this.setTargetSpeed(15);
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

  // We assume any sprite has an 'idle' state with at least one image.
  masterSprite() {
    let type = this.sprites.images['idle'] ? 'idle' : 'go';
    return this.sprites ? this.sprites.images[type][0] : null;
  }

  masterWidth() {
    return this.width(this.masterSprite());
  }

  nativeHeight() {
    return this.masterSprite().height;
  }

  setNativeHeight(callback) {
    this.height = this.nativeHeight();

    if (this.height == 0)
      this.recalculateHeight = true;
    else if (callback){
      callback();
    }
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
    super(name, speed, canvasSize, 'fast', 'zeppelin');
    this.height = parseInt(size) || 150;
    this.position = {x: 0 - this.height * 2.5, y: 40, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Train extends Prop {
  constructor(name, size, speed, canvasSize) {
    super(name, speed || 1, canvasSize, 'fast', 'train');
    this.height = parseInt(size) || this.canvasSize.y * 0.09;
    let positionY = this.canvasSize.y * 0.54 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - this.height * 5, y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Horseman extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 3;
    super(name, speed, canvasSize, 'faster', 'horseman');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.60 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 150), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon1 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 3;
    super(name, speed, canvasSize, 'faster', 'dragon1');
    this.height = parseInt(size) || 350;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 350), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon2 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 3;
    super(name, speed, canvasSize, 'faster', 'dragon2');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon3 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 3;
    super(name, speed, canvasSize, 'faster', 'dragon3');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon4 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    size = size || 150;
    super(name, speed, canvasSize, 'fast', 'dragon4');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 500), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon5 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'dragon5');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon6 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'dragon6');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Dragon7 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'dragon7');
    this.height = parseInt(size) || 250;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Cloud extends Prop {
  constructor(canvasSize) {
    let name = 'cloud';
    let speed = 0.2;
    let numOfTypes = 6;
    let type = `cloud${Math.round(Math.random() * (numOfTypes - 1)) + 1}`;
    super(name, speed, canvasSize, 'slow', type);
    this.state = 'go';

    // this.setNativeHeight(this.setPositionY);
    this.height = this.canvasSize.y / 2.5;

    this.positionY = this.canvasSize.y / 6;
    this.position = {x: canvasSize.x, y: 0 - this.height / 3, correction: {x: 0, y: 0}};
    this.direction = 'left';
  }

  setPositionY() {
    if (this.height > 800)
      this.position.y = 0 - this.height / 2;
  }
}

export class Ufo1 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'ufo1');
    this.height = parseInt(size) || 150;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Ufo2 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'ufo2');
    this.height = parseInt(size) || 150;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
  }
}

export class Ufo3 extends Prop {
  constructor(name, size, speed, canvasSize) {
    speed = speed || 2;
    super(name, speed, canvasSize, 'fast', 'ufo3');
    this.height = parseInt(size) || 150;
    let positionY = this.canvasSize.y * 0.01 * Math.pow(1, 0 - this.height);
    this.position = {x: 0 - (this.masterWidth() || 250), y: positionY, correction: {x: 0, y: 0}};
    this.state = 'go';
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
    this.collection.push(prop);
    // this.collection = this.nonClouds().sort((a, b) => a.size - b.size).concat(this.clouds());
  }

  remove(prop) {
    delete(this.collection[this.collection.indexOf(prop)]);
    this.collection = this.collection.filter(prop => prop);
  }

  clouds() {
    return this.collection.filter(prop => prop.type.match(/cloud/));
  }

  nonClouds() {
    return this.collection.filter(prop => !prop.type.match(/cloud/));
  }

  checkZepBoundaries() {
    this.collection.filter(prop => prop.position.x > this.canvasSize.x).forEach((prop) => this.remove(prop));
  }
}
