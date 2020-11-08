export class Renderer {
  constructor({
    screen = null
  }) {
    this.screen = screen;
    this.canvas = this.screen.canvas;

    this.loadingBatch = [];
    this.pendingBatch = [];
    this.pendingPromises = [];

    this.initialize();
  }

  initialize() {
    this.renderer = new PIXI.Application({
      width: this.canvas.canvasSize.x,
      height: this.canvas.canvasSize.y,
      transparent: true,
      antialias: true,
      autoDensity: true,
      resolution: 1
    })

    this.canvas.canvasWrapper.appendChild(this.renderer.view);

    this.stage = this.renderer.stage;
    this.textureCache = PIXI.utils.TextureCache;
    this.loader = PIXI.Loader.shared;
    this.Sprite = PIXI.Sprite;
    this.AnimatedSprite = PIXI.AnimatedSprite;
    this.Texture = PIXI.Texture;
    this.Graphics = PIXI.Graphics;
    this.Text = PIXI.Text;
    this.utils = PIXI.utils;
    this.Circle = PIXI.Circle;
    this.Rectangle = PIXI.Rectangle;

    this.graphics = new PIXI.Graphics();

    // Adds game loop function to the main loop.
    this.renderer.ticker.add(delta => this.screen.gameLoop());

    // The below line would disable the ticker to avoid cpu consumption during testing.
    // this.renderer.ticker.stop();

    // Loader custom event.
    // Helps resolve pending promises on loaded resources.
    this.loadCompleteEvent = new CustomEvent("loadComplete", {detail : "Load Complete!"})
  }

  loadImages(images) {
    return new Promise((resolve, reject) => {
      this.enqueue(images).then(resolve)
    })
  }

  enqueue(images) {
    this.pendingBatch = this.pendingBatch.concat(images);
    
    return new Promise((resolve, reject) => {
      if (this.pendingBatch.length > 0) {
        this.loadBatch();
      }

      window.addEventListener('loadComplete', resolve)
    });
  }

  loadBatch() {
    if (this.pendingBatch.length == 0 && this.loadingBatch.length == 0) {
      window.dispatchEvent(this.loadCompleteEvent);
    }

    if (!this.loader.loading) {
      let cacheKeys = Object.keys(this.textureCache);
            
      this.loadingBatch = this.pendingBatch.filter(path => !cacheKeys.includes(path));
      this.pendingBatch = [];

      this.loader
        .add(this.loadingBatch)
        .load(() => {
          if (this.pendingBatch.length > 0)
            this.loadBatch()
          else
            window.dispatchEvent(this.loadCompleteEvent);
        })
    }
  }

  addSprite(sprite) {
    this.stage.addChild(sprite)
  }

  removeSprite(sprite) {
    this.stage.removeChild(sprite)
  }

  stop() {
    this.renderer.ticker.stop();
  }

  go() {
    this.renderer.ticker.start();
  }
}