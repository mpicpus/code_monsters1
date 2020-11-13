// Scoreboard encapsulates the logic
// for any real-time figures subscription.

export class Scoreboard {
  constructor({
    screen = null,
    figures = {
      keys: {
        counts: [],
        things: []
      },
      counts: {},
      things: {}
    }
  } = {}) {
    this.screen = screen;
    this.figures = figures;

    this.panels = []
  }

  allKeys() {
    let keys = [];

    Object.keys(this.figures.keys).forEach(key => keys.concat(this.figures.keys[key]));
    
    return keys
  }

  updateFigures() {
    this.updateCounts();
    this.updateThings();
  }

  // Update counts of specific groups of objects.
  updateCounts() {
    let keys = Object.keys(this.figures.counts)

    keys.forEach(key => {
      this.figures.counts[key] = this.screen.things[key].length
    })
  }

  // Update info for specific objects.
  updateThings() {
    let keys = Object.keys(this.figures.things);

    keys.forEach(key => {
      this.figures.things[key] = this.getThingInfo(this.screen.things[key][0])
    })
  }

  getThingInfo(thing) {
    return {
      strength: thing ? thing.strength : null
    }
  }

  updateBoard() {}
}

class Panel {
  constructor({
    thing = null,
    family = null
  } = {}) {

  }
}