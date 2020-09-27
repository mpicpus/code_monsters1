import { Asset } from './asset.js';
import { ActionQueue } from './action-queue.js';
import { SpriteSet } from './sprite-set.js';
import { InstructionSet } from './instructions.js'

// Base Item class.
//
// Using a destructured object as single parameter, because:
//    - it clarifies the code in the constructor;
//    - it clarifies the code upon instanciation (named-parameters-like behaviour);
//    - easier and more readable child classes constructor => new Thing({position: {x: 20, y: 20}}) vs new Thing(null, null, null, {x: 20, y: 20})
//
// This structure also allows declaration of default values.
// Last bit in the constructor call (={}) allows for new Thing() instanciation without parameter,
// otherwise an empty object would be required (ugly!).
export class Thing {
  constructor({
    name = 'unnamed',
    displaysName = false,
    family = null,
    screen = {},
    wrapper = null,
    dimensions = {width: 100, height: 100},
    scale = 1,
    position = {x: 0, y: 0},
    speed = {default: 5},
    direction = 0,
    instructionSet = null, // new InstructionsSet(),
    states = null,
    defaultState = 'idle',
    currentState = 'idle',
    animationSpeed = 'medium',
    extension = 'png',
    level = 1,
    strength = 10
  } = {}) {
    Object.assign(this, {
      name,
      displaysName,
      family,
      screen,
      wrapper,
      dimensions,
      scale,
      position,
      speed,
      direction,
      instructionSet,
      states,
      defaultState,
      currentState,
      animationSpeed,
      extension,
      level,
      strength
    });

    this.initialize()
  }

  move() {}

  initialize() {
    this.family = this.family || this.getFamily();
    this.sprites = new SpriteSet(this);
    this.instructionSet = this.instructionSet || new InstructionSet({thing: this, addBasicSet: true})
  }

  onImageLoad() {
    this.setState(this.defaultState);
    this.setPosition();
    this.setScale();
  }

  onSpritesLoaded() {
    this.setState()
  }

  stateNames() {
    return this.states ? Object.keys(this.states) : [];
  }

  setState(state) {
    state = state || this.defaultState;
    this.currentState = state;
    this.sprites.setState(state)
  }

  setPosition(position = null) {
    position = position || this.position;
    this.position = position;
    this.sprites.setPosition(position)
  }

  setScale(scale = null) {
    scale = scale || this.scale;
    this.scale = scale;
    this.sprites.setScale(scale)
  }

  parseInstructions(instructions) {
    console.log(`received "${instructions}"`);
    this.instructionSet.parse(instructions);
  }

  width() {
    return this.sprites.sprite.width / img.height * this.dimensions.height;
  }

  currentSprite() {
    return this.sprites.currentSprite()
  }

  getFolder() {
    return `${this.family.join('/')}`;
  }

  getFileExtension() {
    return this.extension ? this.extension : 'png';
  }

  getAssetPaths() {
    if(this.states) {
      imagePaths = Object.keys(this.states).map(state => {
        let array = Array(this.states[state]).fill(null);
        return array.map((el, index) => this.getSpriteImage(state, index + 1))
      })
    } else {
      imagePaths = [this.getSpriteImage()];
    }
  }

  getSpriteImage(state, index) {
    return `assets/screens/${this.getFolder()}/${state ? state + '/' + index : this.name}.${this.getFileExtension()}`
  }

  // Family utils
  getFamily(family, current) {
    function underscore(name) {
      return name.replace(/([A-Z]+)/g, '_$1').toLowerCase().replace(/^_/, '')
    }
    
    family = family || [];
    current = current || this;

    while(current.name !== '') {
      let name = current == this ? current.constructor.name : current.name;
      name = underscore(name);

      if (!family.includes(name) && name != "thing")
        family.unshift(underscore(name));
      
      current = Object.getPrototypeOf(current == this ? current.constructor : current)

      this.getFamily(family, current)
    }

    if (!family.includes(this.screen.familyName()))
      family.unshift(this.screen.familyName());
    
    return family
  }

  // Damage functions.
  takeDamage(damage) {
    damage = damage || 0;
    
    this.strength -= damage;
    console.log(this.strength)
    if (this.strength <= 0) this.onTotalDamage();
  }

  onTotalDamage() {
    this.screen.things.remove(this);
  }
}

export class Things {
  constructor({
    screen = {},
    name = 'unnamed',
    collection = []
  } = {}) {
    Object.assign(this, {
      screen,
      name,
      collection
    });

    this.families = [];

    this.spriteInterval = setInterval(() => {this.updateSpriteSteps()}, 150);

    // Poses as callable attributes for the filtering of specific thing types, when present:
    // e.g. "this.things.robots" will return the collection of all 'robot' type things.
    const filteringProxy = new Proxy(this, {
      get: function(things, prop, value) {
        if (things.families.includes(prop))
          return things.collection.filter(thing => thing.family.includes(prop));
        else
          return things[prop] || [];
      }
    })

    return filteringProxy
  }

  names() {
    return this.collection.map(thing => thing.name);
  }

  nameTaken(name) {
    return this.names().includes(name);
  }

  createAndAdd(thingClass, attrs) {
    attrs = attrs || {};
    let thing;

    attrs.wrapper = this;
    attrs.screen = this.screen;

    try{
      thing = new thingClass(attrs);
    } catch(e) {
      console.log(e);
      return
    }

    this.add(thing);
  }

  add(thingOrThings) {
    if (Array.isArray(thingOrThings)) {
      thingOrThings.forEach(thing => this.addThing(thing))
    } else {
      this.addThing(thingOrThings)
    }
  }

  addThing(thing) {
    thing.wrapper = this;
    thing.screen = this.screen;
    this.collection.push(thing);
    this.families = this.families.concat(thing.family.filter(f => !this.families.includes(f)));
  }

  remove(thingOrThings) {
    if (Array.isArray(thingOrThings)) {
      thingOrThings.forEach(thing => this.removeThing(thing))
    } else {
      this.removeThing(thingOrThings)
    }
  }

  // Memory efficient:
  removeThing(thing) {
    // sets the element to 'null' => unreferenced objects will, theoretically, be erased from memory in the next cycle.
    thing.sprites.destroySprites();
    delete(this.collection[this.collection.indexOf(thing)]);
    // removes 'null' elements from the collection.
    this.collection = this.collection.filter(thing => thing);
  }

  updateSpriteSteps(animationSpeed) {
    this.collection.filter((thing) => thing.animationSpeed == animationSpeed).forEach((thing) => thing.updateSpriteSteps());
  }

  draw() {
    this.collection.forEach((thing) => {thing.draw()})
  }

  isOutOfTheCanvas(thing) {
    return thing.position.x < 0 ||
      thing.position.x > this.screen.canvas.canvasSize.x ||
      thing.position.y < 0 ||
      thing.position.y > this.screen.canvas.canvasSize.y
  }

  takeDamage() {
    return this.collection.filter(thing => thing.takesDamage)
  }

  rogueThings() {
    let rogueAvatars = this.avatar.filter(thing => this.isOutOfTheCanvas(thing));
    let rogueProjectiles = this.projectile.filter(thing => this.isOutOfTheCanvas(thing));

    return rogueAvatars.concat(rogueProjectiles);
  }

  movingThings() {
    return this.collection.filter(thing => thing.currentState == 'go')
  }

  move() {
    this.movingThings().forEach(thing => thing.move());
    this.removeRogues();
  }

  removeRogues() {
    this.rogueThings().forEach(thing => this.remove(thing));
  }
}

