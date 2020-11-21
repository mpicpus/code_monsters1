import { Projectile } from './projectile.js';

export class ParticleEmitter extends Projectile {
  constructor(attrs = {}) {
    attrs.sharedSprite = 'particle_emitter.png';
    attrs.defaultState = 'go';
    super(attrs);

    this.particleProperties = attrs.particleProperties;
    this.particleFileName = attrs.particleFileName;
  }

  onLoad() {
    if (!this.dead)
      this.createEmitter();
  }

  createEmitter() {
    let texture = this.screen.renderer.Texture.from(this.getParticleFile(this.particleFileName));
    this.emitter = new PIXI.particles.Emitter(
      this.currentSprite().parent,
      [texture],
      this.particleProperties
    )

    this.elapsed = new Date();
    // this.update()
  }

  onMove() {
    // this.updateId = requestAnimationFrame(() => this.update);
    let now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    let position = this.getCenterPosition();
    this.emitter.spawnPos.set(position.x, position.y);
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;

    this.afterOnMove();
  }

  afterOnMove() {}

  getParticleFile() {
    return `${this.screen.getAssetsFolder()}particles/${this.particleFileName}${this.particleFileName.includes('.png') ? '' : '.png'}`
  }
  
  beforeRemove() {
    if (this.emitter) { 
      this.emitter.emit = false;
      this.emitter.destroy();
    }
  }
}