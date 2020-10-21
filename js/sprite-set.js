// SPRITES
export class SpriteSet {
  // 'callbackName' to be called upon loadImages.
  constructor(thing) {
    this.thing = thing;
    this.loaded = false;
    this.renderer = thing.screen.renderer;
    this.sprites = null;
    this.state = null;

    this.loadImages().then(() => {
      this.loaded = true;
      this.thing.onSpritesLoaded();
    });
  }

  loadImages() {
    return new Promise((resolve, reject) => {
      let result, imagePaths;

      if (this.thing.states) {
        result = Object.keys(this.thing.states).map(state => {
          let stateObject = this.thing.states[state];
          let isShared = typeof(stateObject.steps) == 'object';
          let array = Array(isShared ? stateObject.steps[1] : stateObject.steps).fill(null)
          
          if (isShared)
            return array.map((el, index) => (this.getSharedSpriteImage(stateObject.steps[0], index + 1)))

          return array.map((el, index) => this.getSpriteImage(state, index + 1))
        }).flat()
      } else {
        result = [this.getSpriteImage()];
      }

      imagePaths = this.thing.screen.spritesCollection.contains(this) ? [] : result;
      
      this.thing.screen.spritesCollection.add(this, imagePaths).then((textures) => {
        if (textures.length > 1) {
          this.sprites = {};

          for (let state in this.thing.states) {
            let stateObject = this.thing.states[state];
            let isShared = typeof(stateObject.steps) == 'object';      
            let keyword = isShared ? stateObject.steps[0] : state

            let stateTextures = textures.filter(t => t.textureCacheIds[0].includes(keyword));
            let sprite = new this.renderer.AnimatedSprite(stateTextures);
            sprite.loop = stateObject.loop === false ? false : true;
            sprite.onComplete = this.thing.onStateComplete()[state];
            sprite.onLoop = () => this.onLoop();
            sprite.onFrameChange = (frameNum) => { this.onFrameChange(frameNum) }
            sprite.added = () => this.thing.onSpriteAdded();
            sprite.animationSpeed = this.getAnimationSpeed();

            this.sprites[state] = sprite;

            if (this.thing.showName)
              this.setNameText(this.sprites[state]);
            
            this.renderer.stage.addChild(this.sprites[state]);
          }
        } else {
          this.sprite = new this.renderer.Sprite(textures[0])
          this.renderer.stage.addChild(this.sprite);
        }

        this.thing.onImageLoad();

        resolve(result)
      });
    })
  }

  getSpriteImage(state, index) {
    return `assets/screens/${this.thing.getFolder()}${state ? '/' + state + '/' + index : ''}.${this.getFileExtension()}`
  }

  getSharedSpriteImage(name, index) {
    return `assets/screens/${this.thing.screen.familyName()}/shared/${name}/${index}.${this.getFileExtension()}`
  }

  currentSprite() {
    return this.state ? this.sprites[this.state] : null
  }

  baseSprite() {
    return this.sprites['idle']
  }

  onLoop() {
    this.thing.frameEventTriggered = false;
    this.thing.onStateLoop()[this.state]
  }

  onFrameChange(frameNum) {
    // if (this.thing.name == 'matt' && this.thing.frameEventTriggered == true) debugger;
    if (this.thing.frameEventTriggered) return;

    let stateActions = this.thing.onStateFrame()[this.state];
    let keys = stateActions && Object.keys(stateActions);

    if (!keys) return;

    let key = keys.find(k => Math.abs(k - frameNum) < 5);

    if (key) {
      this.thing.frameEventTriggered = true;
      stateActions[key]();
    }
  }

  setState(newState) {
    return new Promise((resolve, reject) => {
      if (this.sprites) {
        for(let state in this.sprites) {
          this.sprites[state].visible = false;
        }

        this.state = newState;
        this.sprites[this.state].visible = true;
        this.sprites[this.state].play();
        resolve(this.state);
      }
    })
  }

  setPosition(position) {
    for(let state in this.sprites) {
      this.sprites[state].position.set(position.x, position.y)
    }
  }

  setPivot(position) {
    for(let state in this.sprites) {
      this.sprites[state].pivot.set(position.x, position.y)
    }
  }

  setScale(scale) {
    for(let state in this.sprites) {
      if (Array.isArray(scale))
        this.sprites[state].scale.set(...scale);
      else
        this.sprites[state].scale.set(scale);
    }
  }

  setAnimationSpeed(speed) {
    for(let state in this.sprites) {
      this.sprites[state].animationSpeed = this.getAnimationSpeed(speed)
    }
  }

  setNameText(sprite) {
    let style = {
      fontFamily : 'Arial',
      fontSize: 15,
      fill : 0xffffff,
      align : 'center'
    };

    let nameText = new this.renderer.Text(this.thing.displayName || this.thing.getName(), style);

    nameText.scale.set(1 / this.thing.scale);
    
    setTimeout(() => {
      nameText.position.set(sprite.width, -40 + 2 * this.thing.offset.y)
      sprite.addChild(nameText);
    }, 300)
  }

  getCurrentSprite() {
    if (this.thing.states) {
      let [state, index] = [this.thing.state, this.thing.currentAnimationStep];
      return this.images[state][index]
    } else {
      return this.image
    }
  }

  setCurrentSprite() {
    if (false && this.thing.states) {
      let [state, index] = [this.thing.state, this.thing.currentAnimationStep]
      this.sprite.texture = this.renderer.textureCache[this.getSpriteImage(state, index)]
    }
  }

  getFileExtension() {
    return this.thing.extension ? this.thing.extension : 'png';
  }

  getAnimationSpeed(speed) {
    return {
      turboCrazy: 20,
      turbo: 5,
      crazy: 2.5,
      fastest: 1.5,
      faster: 1,
      fast: 0.5,
      medium: 0.2,
      slow: 0.1
    }[speed || this.thing.animationSpeed]
  }

  destroySprites() {
    this.thing.stateNames().forEach((state) => {
      this.sprites[state].destroy(false);
    })
  }

  static avatarSteps(type) {
    return {
      zombie: {
        appear: 11,
        build: 7,
        die: 8,
        go: 10,
        idle: 6
      },
      skeleton: {
        appear: 10,
        build: 8,
        die: 8,
        go: 8,
        idle: 6
      },
      mine: {
        blow: 7,
        die: 7,
        idle: 2
      },
      zeppelin: {
        go: 5,
        idle: 5
      },
      train: {
        idle: 8,
        go: 8
      },
      cloud1: {
        go: 1
      },
      cloud2: {
        go: 1
      },
      cloud3: {
        go: 1
      },
      cloud4: {
        go: 1
      },
      cloud5: {
        go: 1
      },
      cloud6: {
        go: 1
      },
      horseman: {
        go: 14
      },
      dragon1: {
        go: 40,
        idle: 40
      },
      dragon2: {
        go: 48,
        idle: 48
      },
      dragon3: {
        go: 40,
        idle: 40
      },
      dragon4: {
        go: 10,
        idle: 10
      },
      dragon5: {
        go: 10,
        idle: 10
      },
      dragon6: {
        go: 40,
        idle: 40
      },
      dragon7: {
        go: 9,
        idle: 9
      },
      ufo1: {
        go: 19,
        idle: 19
      },
      ufo2: {
        go: 28,
        idle: 28
      },
      ufo3: {
        go: 16,
        idle: 16
      },

    }[type]
  }
}

export class SpritesCollection {
  constructor(renderer) {
    this.renderer = renderer;
    this.names = [];
    this.textureSets = {};
  }

  add(set, imagePaths) {
    return new Promise((resolve, reject) => {
      let pathName = set.thing.getFolder();
      
      if (this.contains(set)){
        resolve(this.textureSets[pathName])
      } else {
        this.names.push(pathName);
        this.addTextures(pathName, imagePaths).then(() => resolve(this.textureSets[pathName]))
      }
    })
  }

  addTextures(pathName, imagePaths) {
    return new Promise((resolve,reject) => {
      this.textureSets[pathName] = [];

      imagePaths.forEach((path) => {
        let texture = this.renderer.Texture.from(path);
        this.textureSets[pathName].push(texture)
      })

      resolve()
    })
  }

  contains(set) {
    return this.names.includes(set.thing.getFolder())
  }
}