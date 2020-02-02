// SPRITES
export class SpriteSet {
  constructor(type, states) {
    this.type = type || 'robot';
    this.states = states || {
                              idle: 5,    
                              go: 5,
                              die: 9,
                              build: 7
                            };
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
    return `assets/avatars/${this.type}/${state}/${index}.png`
  }
}

let avatarSteps = {
  robot: {
    idle: 5,    
    go: 5,
    die: 9,
    build: 7
  }
}