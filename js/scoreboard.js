// Scoreboard encapsulates the logic
// for any real-time figures subscription.

export class Scoreboard {
  constructor({
    screen = null,
    figures = {counts: {}, things: {}}
  } = {}) {
    this.screen = screen;
    this.figures = figures;

    this.panels = []
  }

  updateFigures() {
    updateCounts();
    updateThings();
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
      strength: thing.strength
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