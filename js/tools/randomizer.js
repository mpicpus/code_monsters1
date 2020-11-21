// Collection of helper classes (random generators and such).
export const Randomizer = {};

// Will randomly call any of the source's generators, at random intervals.
Randomizer.generator = class {
  constructor({
    actionSource = {},
    generators = [],
    intervalRange = {min: 150, max: 4000},
    maxCount = null,
    boost = null,
    attrs = null,
    onGenerate = () => {}
  } = {}) {
    Object.assign(this, {
      actionSource,
      generators,
      intervalRange,
      maxCount,
      boost,
      attrs,
      onGenerate
    });

    this.picker = new Randomizer.picker({ set: this.generators })

    // this.start()
  }

  start() {
    if (this.state == 'active') return;

    if (this.maxCount) this.count = 0;
    
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
      if (this.maxCount) {
        if (this.count == this.maxCount) {
          this.stop();
          return
        } else
          this.count ++;
      }

      let generator = this.getRandomGenerator();

      this.actionSource[generator](this.attrs);
      this.onGenerate();
      
      if (this.state == 'active')
        this.generate();
    }, randomTimeout)
  }

  generateBoost() {
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
      this.actionSource[generator]()
    }
  }

  getRandomGenerator() {
    return this.picker.pick()
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
    return this.set[randy]
  }
}
