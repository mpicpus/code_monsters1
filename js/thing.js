import {ActionQueue} from './action-queue.js'
import {SpriteSet} from './sprite-set.js'

// Minion class
export class Thing {
  constructor(name, type, height, position, canvasSize) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    this.position = {...position, ...{correction: {x: 0, y: 0}}};
    this.actionQueue = new ActionQueue(this);
    this.speed = 1;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 0;
    this.direction = {x: 0, y: 0};

    this.spriteSets = [];
    this.sprites = this.getSprites();
    this.hotPointsCalculator = this.constructor.getHotPointsCalculator(this.type)
  }
}

export class Things {
  constructor(type, collection) {
    this.collection = collection || [];
  }

  names() {
    return this.collection.map(minion => minion.name);
  }

  taken(name) {
    return this.names().includes(name);
  }

  add(thing) {
    this.collection.push(thing)
  }

  remove(thing) {
    this.collection = this.collection.filter(i => i != thing)
  }
}
