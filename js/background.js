export class Background {
  constructor(images, move, interact, canvasSize) {
    this.images = images || [];
    this.move = move || function() {};
    this.interact = interact || function() {};
  }

  addImage(image) {
    this.images.push(image)
  }

  removeImage(image) {
    delete(this.images[this.images.indexOf(image)]);
    this.images = this.images.filter(i => i);
  }
}

export class BackgroundImage {
  constructor(name, level, background, move, position, folder) {
    this.position = position || {x: 0, y: 0}
    this.background = background || {};
    this.name = name;
    this.folder = folder || '';
    this.folder = folder;
    this.level = level || 0;
    this.move = move || function() {};
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  getImage() {

  }
}