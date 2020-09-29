// Collection of randomizer classes.
export const Randomizer = {};

// Will randomly call any of the source's generators, at random intervals.
Randomizer.generator = class {
  constructor({
    source = {},
    generators = [],
    intervalRange = {min: 150, max: 4000},
  } = {}) {
    Object.assign(this, {
      source,
      generators,
      intervalRange
    });

    this.start()
  }

  start() {
    if (this.state == 'active') return;
    
    this.state = 'active';
    this.generate()
  }

  stop() {
    this.state = 'stopped';
  }

  generate() {
    let randomTimeout = Math.floor(Math.random() * this.intervalRange.max + this.intervalRange.min);
    setTimeout(() => {
      let generator = this.generators[Math.floor(Math.random() * this.generators.length)];

      this.source[generator]();
      
      if (this.state == 'active')
        this.generate();
    }, randomTimeout)
  }
}
