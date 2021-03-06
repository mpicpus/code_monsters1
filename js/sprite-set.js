// SPRITES
export class SpriteSet {
  constructor(family, type, states) {
    this.family = family || 'avatar';
    this.type = this.constructor.avatarSteps(type) ? type : 'stone_robot';
    this.states = states || this.constructor.avatarSteps(this.type);
    this.images = this.loadImages()
  }

  loadImages() {
    let images = {};
    
    for (let state in this.states) {
      images[state] = Array(this.states[state]).fill(0).map((el, index) => {
        let img = new Image();
        img.src = this.getSpriteImage(state, index + 1);
        return img;
      });
    }

    return images;
  }

  getSpriteImage(state, index) {
    return `assets/${this.family}/${this.type}/${state}/${index}.png`
  }

  static avatarSteps(type) {
    return {
      robot: {
        idle: 5,    
        go: 5,
        die: 9,
        build: 7,
        appear: 9
      },
      stone_robot: {
        appear: 15,
        build: 6,
        die: 7,
        go: 6,
        idle: 6
      },
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