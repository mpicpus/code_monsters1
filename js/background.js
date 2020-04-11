export class Background {
  constructor(images, interact, canvasSize, name) {
    this.images = images || [];
    this.interact = interact || function() {};
    // this.screen = screen;
    this.canvasSize = canvasSize;
    // this.name = this.screen.name;
    this.name = name;
  }

  move() {
    this.images.forEach(image => image.move());
  }

  draw(ctx) {
    this.images.forEach(image => image.draw(ctx));
  }

  addImage(image) {
    this.images.push(image);
  }

  removeImage(image) {
    delete(this.images[this.images.indexOf(image)]);
    this.images = this.images.filter(i => i);
  }
}

export class BackgroundImage {
  constructor(name, level, dimensions, position, background, move, imgType) {
    this.name = name;
    this.level = level || 0;
    this.background = background || {};
    this.move = move || function() {};
    this.position = position || {x: 0, y: 0}
    this.imgType = imgType || 'jpg';
    
    this.dimensions = dimensions || {};

    this.loadImage().then(() => {
      this.setDimensions()
    })


  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  setDimensions() {
    this.width = null;
    this.height = null;

    if (this.dimensions.width) {
      this.width = this.dimensions.width * this.background.canvasSize.x / 100;
    }
    else {
      this.height = (this.dimensions.height || 100) * this.background.canvasSize.y / 100; 
      this.width = this.height / this.image.height * this.image.width;
    }

    if (!this.height)
      if (this.dimensions.height)
        this.height = (this.dimensions.height || 100) * this.background.canvasSize.y / 100;
      else
        this.height = this.width / this.image.width * this.image.height;
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      let src = `assets/backgrounds/${this.background.name}/${this.name}.${this.imgType}`;

      this.image = new Image();
      this.image.src = src;
      this.image.addEventListener('load', e => resolve());
    })
  }
}