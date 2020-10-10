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
    speed = {x: 0, y: 0, default: {x: 5, y: 0}},
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
  }

  onImageLoad() {
    this.setState(this.defaultState);
    this.setPosition();
    this.setScale();
  }

  onSpritesLoaded() {
    this.setState()
  }

  onStateComplete() {
    return {}
  }

  onStateLoop() {
    return {}
  }

  destroy() {
    this.screen.things.remove(this);
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

  setAnimationSpeed(speed) {
    this.sprites.setAnimationSpeed(speed)
  }

  parseInstructions(instructions) {
    console.log(`received "${instructions}"`);
    this.instructionSet.parse(instructions);
  }

  width() {
    return this.currentSprite().width
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
    if (this.strength <= 0) this.onTotalDamage();
  }

  onTotalDamage() {
    this.destroy();
  }
}



// Things collection.
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

    // Configures callable attributes for direct filtering of specific thing types, when present:
    // e.g. "this.robot" will return a collection of all 'robot' class things.
    // Accepts any "underscore" version of class name (StoneRobot => stone_robot).
    //
    // Returns an empty array if no type or method are defined (will throw potential errors in the console).
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

    try {
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
    thing.sprites.destroySprites();

    // Sets the element to 'null' => unreferenced objects will, theoretically, be erased from memory in the next cycle.
    delete(this.collection[this.collection.indexOf(thing)]);

    // Removes 'null' elements from the collection.
    this.collection = this.collection.filter(thing => thing);
  }

  isOutOfTheCanvas(thing) {
    return (thing.speed.x < 0 && thing.position.x < 0) ||
      (thing.speed.x > 0 && thing.position.x > this.screen.canvas.canvasSize.x) ||
      (thing.speed.y < 0 && thing.position.y < 0) ||
      (thing.speed.y > 0 && thing.position.y > this.screen.canvas.canvasSize.y)
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
    this.manageProjectiles()
  }

  removeRogues() {
    this.rogueThings().forEach(thing => this.remove(thing));
  }

  manageProjectiles() {
    let projectiles = this.projectile;

    if (projectiles) {
      projectiles.forEach((projectile) => {
        let thing = projectile.hitThing();
        if (thing) {
          thing.takeDamage(projectile.damage);
          this.remove(projectile);
        }
      })
    }
  }
}

