// A few tools to play with sound.

export class SoundEngine {
  constructor({
    screen = null,
    soundPairs = null
  } = {}) {
    this.screen = screen;
    this.resources = {};

    if (soundPairs)
      this.loadMultiple(soundPairs);
  }

  loadMultiple(pairs) {
    this.addMultiple(pairs);
    this.load()
  }

  addMultiple(pairs) {
    pairs.forEach(pair => {
      if (typeof(pair) == 'string')
        pair = [pair];

      let name = pair[0];
      let fileName = pair[1] || pair[0];

      this.add(name, fileName)
    })
  }

  add(name, fileName) {
    let url = `${this.getFolder()}${fileName}${fileName.includes('.mp3') ? '' : '.mp3'}`
    PIXI.Loader.shared.add(name, url)
  }

  load() {
    PIXI.Loader.shared.load((loader, resources) => {
      this.resources = resources;
    })
  }

  play(name, volume) {
    volume = volume || 1;

    if (this.resources[name]) {
      this.resources[name].sound.volume = volume;
      this.resources[name].sound.play();
    }
  }

  getFolder() {
    return `./assets/screens/${this.screen.familyName()}/sounds/`
  }
}