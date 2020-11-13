import { Scoreboard } from '../../scoreboard.js';
import * as AvatarMod from './avatar.js';

export class ScoreboardSolarSystem extends Scoreboard {
  constructor(attrs = {}) {
    attrs.figures = {
      keys: {
        counts: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'death_star'],
        things: ['sun']
      },
      counts: {},
      things: {
        sun: {}
      }
    }

    super(attrs);
    this.setInitialFigures();

    this.createComponents()
  }

  setInitialFigures() {
    this.figures.keys.counts.forEach(key => {
      this.figures.counts[key] = null;
    })

    this.figures.keys.things.forEach(key => {
      this.figures.things[key] = null;
    })

    this.updateFigures()
  }

  // Quick hack before switching to real HTML components.
  createComponents() {
     this.components = {};
    this.createAndRenderWrapper();
    // initializeContainer();
    // initalizePanels();
    // render()
  }

  createAndRenderWrapper() {
    let wrapper = document.createElement("div");
    wrapper.classList.add('scoreboard-wrapper');

    var style = document.createElement("style");
    style.innerHTML = `
    .scoreboard-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: 70px;
      width: 100%;
      background-color: rgba(0,0,0,0.4);
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }`;

    wrapper.appendChild(style);
    document.querySelector('#work-place').appendChild(wrapper);

    this.components.wrapper = wrapper;
  }

  createContainer() {
    this.components.container = new this.screen.renderer.Container()
  }

  createPanels() {
    this.components.panels = {things: {}, counts: {}};
    this.figures.keys.things.forEach(key => {
      this.components.panels.things[key] = this.createThingPanel(key)
    });

    this.figures.keys.counts.forEach(key => {
      let count = this.figures.counts[key];
      this.components.panels.counts[key] = this.createCountPanel(count)
    })
  }

  createThingPanel(key) {
    let figures = this.figures.keys.things[key];

    let image = {}
    // return thingPanel
  }
}
