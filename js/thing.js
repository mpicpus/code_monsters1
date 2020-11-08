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
    name = '',
    displayName ='',
    showName = false,
    family = null,
    spriteName = null,
    screen = {},
    wrapper = null,
    dimensions = null,
    scale = 1,
    position = {x: 0, y: 0},
    offset = {x: 0, y: 0},
    speed = {x: 0, y: 0, angular: 0},
    initialSpeed = {x: 0, y: 0, angular: 0},
    acceleration = {x: 0, y: 0, angular: 0},
    direction = 0,
    instructionSet = null, // new InstructionsSet(),
    states = null,
    defaultState = 'idle',
    currentState = 'idle',
    animationSpeed = 'medium',
    extension = 'png',
    level = 1,
    strength = 10,
    damage = 0,
    collides = true,
    preload = false,
    boundingShape = {circle: null, rectangle: null, draw: false},
    boundingRadiusMultiplier,
    dead = false
  } = {}) {
    Object.assign(this, {
      name,
      displayName,
      showName,
      family,
      spriteName,
      screen,
      wrapper,
      dimensions,
      scale,
      position,
      offset,
      speed,
      initialSpeed,
      acceleration,
      direction,
      instructionSet,
      states,
      defaultState,
      currentState,
      animationSpeed,
      extension,
      level,
      strength,
      damage,
      collides,
      preload,
      boundingShape,
      boundingRadiusMultiplier,
      dead
    });

    this.initialize()
  }

  initialize() {
    this.family = this.family || this.getFamily();
    this.sprites = new SpriteSet(this);
  }

  // Basic movement function.
  // Override in subclass if necessary.
  move() {
    // if (this.family.includes('red_shot')) debugger;
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    if (this.rotation && this.speed.angular)
      this.rotation += this.speed.angular;

    this.setPosition();
  }

  getName() {
    return !this.name || this.name == '' ? this.underscore(this.constructor.name) : this.name
  }

  createBoundingShape() {
    let shape = this.boundingShape.shape;

    if (!shape) return;

    shape = shape.split('').map((c, i) => i == 0 ? c.toUpperCase() : c).join('');
    this[`createBounding${shape}`](this.boundingRadiusMultiplier)
  }

  // "radiusMultiplier" applies to a radius with a original size of height/2.
  // 1 will generate a circle raughly the size of the object,
  // 2 will generate a circle double the size...
  // and so on.
  createBoundingCircle(radiusMultiplier) {
    if (this.dead) return;
    radiusMultiplier = radiusMultiplier || 1;
    console.log('circle', this);

    this.boundingShape.circle = {
      center: () => { return this.getCenterPosition() },
      radius: () => { return this.height() / 2 * radiusMultiplier }
    }

    if (this.boundingShape.draw)
      this.drawBoundaries()
  }

  drawBoundaries(color) {
    color = color || "#fffff"
    let circle = this.boundingShape.circle;
    let dimension = circle.radius() / this.scale;
    
    if (circle) {
      let graphics = new this.screen.renderer.Graphics();
      let position = { x: dimension, y: dimension };

      color = this.screen.renderer.utils.string2hex(color);

      graphics.lineStyle(1, color)
        .drawCircle(position.x, position.y, dimension)
        .endFill();

      this.currentSprite().addChild(graphics);
    }
  }

  onImageLoad() {}

  onSpritesLoaded() {
    this.setPosition();
    this.setScale();
    this.setState().then(() => {
      setTimeout(() => { this.createBoundingShape() }, 500);
      this.onLoad()
    });

  }

  onLoad() {}

  onSpriteAdded() {}

  onStateComplete() {
    return {}
  }

  onStateLoop() {
    return {}
  }

  onStateFrame() {
    return {}
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.screen.things.remove(this);
  }

  stateNames() {
    return this.states ? Object.keys(this.states) : [];
  }

  setState(state) {
    return new Promise((resolve, reject) => {
      state = state || this.defaultState;
      this.currentState = state;
      this.sprites.setState(state).then(resolve);
    })
  }

  setPosition(position = null) {
    position = position || this.position;
    this.position = position;
    this.sprites.setPosition(this.offsetPosition())
  }

  offsetTo(positionName) {
    let sprite = this.currentSprite();
    if (!sprite) return;

    let actions = {
      center: () => {
        this.offset = {
          x: - sprite.width / 2,
          y: - sprite.height / 2 
        }
      },
      topCenter: () => {
        this.offset = {
          x: - sprite.width / 2,
          y: 0
        }
      },
      topLeft: () => {
        this.offset = {
          x: 0,
          y: 0
        }
      },
      centerLeft: () => {
        this.offset = {
          x: 0,
          y: - sprite.height / 2
        }
      },
      centerRight: () => {
        this.offset = {
          x: - sprite.width,
          y: - sprite.height / 2
        }
      },
      bottomLeft: () => {
        this.offset = {
          x: 0,
          y: - sprite.height
        }
      },
      bottomRight: () => {
        this.offset = {
          x: - sprite.widht,
          x: - sprite.height
        }
      }
    }

    if (Object.keys(actions).includes(positionName)){
      actions[positionName]();
      this.setPosition()
    }
  }

  offsetPosition() {
    return {
      x: this.position.x + this.offset.x,
      y: this.position.y + this.offset.y
    }
  }

  getCenterPosition() {
    let sprite = this.currentSprite();

    if (!sprite || !sprite.transform) return this.position;
    
    let position = sprite.getGlobalPosition();
    return {
      x: position.x + sprite.width / 2,
      y: position.y + sprite.height / 2
    }
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

  height() {
    return this.currentSprite().height
  }

  currentSprite() {
    return this.sprites.currentSprite()
  }

  baseSprite() {
    return this.sprites.baseSprite()
  }

  getFolder() {
    let folder = `${this.family.join('/')}${this.name != '' && this.states ? '/' + this.name : ''}`;
    folder = this.spriteName ? folder.replace(this.getName(), this.spriteName) : folder;
    return folder
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

  // Position utils
  pivotToCenter() {
    let sprite = this.currentSprite();
    let objectCenter = {
      x: sprite.width / 2,
      y: sprite.height / 2
    };

    this.sprites.setPivot(objectCenter)
  }

  moveTo(parameter) {
    let dimensions = this.screen.canvas.canvasSize;
    let currentSprite = this.baseSprite();

    let actions = {
      center: () => {
        let center = {x: dimensions.x / 2, y: dimensions.y / 2}
        this.setPosition(center)
      }
    };

    try { actions[parameter]() } catch { return null }
  }

  destroyChildren() {
    this.sprites.destroyChildren()
  }

  // Family utils
  underscore(name) {
    return name.replace(/([A-Z]+)/g, '_$1').toLowerCase().replace(/^_/, '')
  }

  getFamily(family, current) {    
    family = family || [];
    current = current || {name: this.getName()};

    while(current.name && current.name !== '') {
      let name = current.name;
      name = this.underscore(name);

      if (!family.includes(name) && name != "thing")
        family.unshift(name);

      if (current.name == this.getName() && name != this.underscore(this.constructor.name))
        family.unshift(this.underscore(this.constructor.name));

      current = Object.getPrototypeOf(current.name == this.getName() ? this.constructor : current)

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
    // Returns an empty array if no type or method are defined.
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
      console.error(e);
      return null
    }

    return this.add(thing);
  }

  add(thingOrThings) {
    if (Array.isArray(thingOrThings)) {
      return thingOrThings.map(thing => this.addThing(thing))
    } else {
      return this.addThing(thingOrThings)
    }
  }

  addThing(thing) {
    thing.wrapper = this;
    thing.screen = this.screen;
    this.collection.push(thing);
    this.families = this.families.concat(thing.family.filter(f => !this.families.includes(f)));
    return thing
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
    thing.dead = true;

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
    this.manageCollisions();
    this.manageProjectiles()
  }

  manageCollisions() {
    
  }

  removeRogues() {
    this.rogueThings().forEach(thing => this.remove(thing));
  }

  manageProjectiles() {
    let projectiles = this.projectile;

    if (projectiles.length > 0) {
      projectiles.forEach((projectile) => {
        if (projectile.currentState == 'destroy') return;
        
        let thing = projectile.hitThing();
        if (thing) {
          thing.takeDamage(projectile.damage);
          projectile.takeDamage(thing.damage || 0);
        }
      })
    }
  }
}
