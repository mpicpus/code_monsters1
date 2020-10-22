// Collection of randomizer classes.
export const Randomizer = {};

// Will randomly call any of the source's generators, at random intervals.
Randomizer.generator = class {
  constructor({
    source = {},
    generators = [],
    intervalRange = {min: 150, max: 4000},
    boost = null
  } = {}) {
    Object.assign(this, {
      source,
      generators,
      intervalRange,
      boost
    });

    this.start()
  }

  start() {
    if (this.state == 'active') return;
    
    this.state = 'active';
    this.generate();
    this.generateBoost();
  }

  stop() {
    this.state = 'stopped';
  }

  generate() {
    let randomTimeout = Math.floor(Math.random() * this.intervalRange.max + this.intervalRange.min);
    setTimeout(() => {
      let generator = this.getRandomGenerator();

      this.source[generator]();
      
      if (this.state == 'active')
        this.generate();
    }, randomTimeout)
  }

  generateBoost() {
    console.log(this.boost)
    if (!this.boost) return;

    this.boostInterval = window.setInterval(() => {
      if (this.state == 'stopped')
        window.clearInterval(this.boostInterval)

      this.launchBoost()
    }, this.boost.interval)
  }

  launchBoost() {
    let numOfObjects = Math.floor(Math.random() * this.boost.quantityRange[1] + this.boost.quantityRange[0]);
    let generator = this.getRandomGenerator();

    for(let time = 0; time < numOfObjects; time++){
      this.source[generator]()
    }
  }

  getRandomGenerator() {
    return this.generators[Math.floor(Math.random() * this.generators.length)]
  }
};

Randomizer.picker = class {
  constructor({
    set = []
  } = {}) {
    this.set = set;
  }

  pick() {
    let randy = Math.floor(Math.random() * this.set.length);
    console.log(randy)
    return this.set[randy]
  }
}
