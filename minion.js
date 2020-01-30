// Minion class
export class Minion {
  constructor(name, type, height, position, canvasSize) {
    // Configurables
    this.canvasSize = canvasSize;
    this.name = name;
    this.type = type;
    this.height = height;
    this.position = position;

    // Inner properties
    this.state = 'idle';
    this.currentAnimationStep = 1;
    this.direction = 'right';

    this.avatarSteps = avatarSteps;
    this.minionImages = this.loadImages();
  }

  // Getters
  width(img) {
    return img.width / img.height * this.height;
  }

  // Utils
  loadImages() {
    let images = {};

    for (let type in this.avatarSteps) {
      images[type] = {};
      for (let state in this.avatarSteps[type]) {
        images[type][state] = Array(avatarSteps[type][state]).fill(0).map((el, index) => {
          let img = new Image();
          img.src = this.getSpriteImage(type, state, index + 1);
          return img;
        });
      }
    }

    return images;
  }

  getSpriteImage(type, state, index) {
    return `assets/avatars/${type}/${state}/${index}.png`
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
      left: () => { this.position.x-- },
      right: () => { this.position.x++ },
      up: () => { this.position.y-- },
      down: () => { this.position.y++ }
    };
  }

  shouldMove() {
    return this.state == 'go' && !this.isBlocked();
  }

  move() {
    if (this.shouldMove())
      this.movements()[this.direction]();
  }

  stop() {
    this.state = 'idle'
  }

  go() {
    this.state = 'go'
  }

  updatePostion() {
    this.move(this.direction);
  }

  updateSpriteSteps() {
    this.currentAnimationStep ++;
    
    if (this.currentAnimationStep > this.minionImages[this.type][this.state].length - 1)
      this.currentAnimationStep = 1;
  }

  getCurrentSprite() {
    return this.minionImages ? this.minionImages[this.type][this.state][this.currentAnimationStep] : null;
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