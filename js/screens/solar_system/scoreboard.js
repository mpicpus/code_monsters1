import { Scoreboard, ScoreboardElement } from '../../scoreboard.js';
import * as PlanetMod from './planets.js';

class Panel extends ScoreboardElement {
  constructor(attrs = {}) {
    super(attrs);

    this.displayName = attrs.displayName;

    this.bindingFunctions = {
      displayName: () => { return this.displayName },
      imageUrl: () => { return this.getImage() }
    }
  }

  getImage() {
    if (!this.thingName) return;

    let thing = new PlanetMod[this.toClassName(this.thingName)]({screen: this.scoreboard.screen, preload: true});
    if (!thing) return;

    let imageUrl = `assets/screens/${thing.getFolder()}/${thing.stateNames()[0]}/1.png`
    return imageUrl;
  }

  toClassName(name) {
    if (!name || !typeof(name) == 'string') return
    return name
            .split('_')
            .map(i => i.replace(/(^\w{1})/g, match => match.toUpperCase()))
            .join('');
  }
}

class CountPanel extends Panel {
  constructor(attrs = {}) {
    super(attrs);

    this.thingName = attrs.thingName;

    this.locals = this.locals || { count: 0, visible: false };

    this.bindingFunctions.count = () => { return this.getCount() }
    this.bindingFunctions.panelCssClasses = () => { return this.getPanelCssClasses() }
  }

  getCount() {
    this.locals.count = this.scoreboard.screen.things[this.thingName].length;
    return this.locals.count
  }

  getPanelCssClasses() {
    let classAction = {
      add: this.locals.count <= 0 ? ['disabled'] : [],
      remove: this.locals.count > 0 ? ['disabled'] : []
    }

    if (this.locals.count > 0)
      classAction.add.push('visible');

    return classAction
  }

  afterConnectedCallback() {
    this.setListener();
  }

  setListener() {
    this.addEventListener('click', () => {
      let instruction = this.thingName.split('_')[0];
      let attr = this.thingName.split('_')[1];

      if (this.scoreboard.screen.globals.canBeClickCreated.includes(this.thingName))
        this.scoreboard.screen.instructions[instruction]([attr]);
    })
  }
}

class ThingPanel extends Panel {
  constructor(attrs = {}) {
    super(attrs)

    this.thingName = attrs.thingName;
    this.thing = attrs.thing;

    this.locals = { visible: true, strength: 0 };

    this.bindingFunctions.strength = () => { return this.getStrength() };
    this.bindingFunctions.strengthStyle = () => { return this.getStrengthStyle() };
    this.bindingFunctions.panelCssClasses = () => { return this.getPanelCssClasses() }
  }

  getStrength() {
    if (!this.getThing())
      this.locals.strength = 0;
    else
      this.locals.strength = this.getThing().strength || 0;

    return this.locals.strength
  }

  getStrengthStyle() {
    if (this.bindingFunctions.strength() == 0 || !this.getThing())
        return 'width: 0';

    return `width: ${this.getThing().strength / this.getThing().maxStrength * 100}%`
  }

  getPanelCssClasses() {
    return {
      add: this.locals.strength <= 0 ? ['disabled'] : [],
      remove: this.locals.strength > 0 ? ['disabled'] : []
    }
  }

  getThing() {
    return this.thing || this.scoreboard.screen.things[this.thingName][0];
  }

  setStrengthBar() {
    let strength = this.thing.strength;
    let value = strength / this.thing.maxStrength * 100;

    this.updateContent('.strength', 'style', `${value}%`);
    this.updateContent('.strength', null, strength);
  }
}

class FireballPanel extends Panel {
  constructor(attrs = {}) {
    super(attrs);

    this.resetLocals();

    this.bindingFunctions.panelCssClasses = () => { return this.getPanelCssClasses() };
    this.bindingFunctions.imageUrl = () => { return this.locals.imageUrl }

    this.setListener()
  }

  getPanelCssClasses() {
    return {
      add: this.locals.active ? ['visible'] : ['disabled'],
      remove: this.locals.active ? ['disabled'] : ['visible']
    };
  }

  setListener() {
    this.addEventListener('click', () => {
      this.uponClick()
    })
  }

  uponClick() {
    if (!this.locals.active) return;

    this.scoreboard.screen.instructions['fire_boost']({maxCount: this.locals.maxCount})
    
    this.resetLocals();
    this.resetActivationCounter();
  }

  resetLocals() {
    this.locals.active = false,
    this.locals.maxCount = 0
  }

  resetActivationCounter() {
    this.scoreboard.screen.globals.canFireBoost = true;

    if (this.activationCounter)
      clearInterval(this.activationCounter);

    this.activationCounter = setInterval(() => {
      this.locals.maxCount ++;

      if (this.locals.maxCount > 5)
        this.activate()

      this.update();
    }, 2000)
  }

  activate() {
    this.locals.active = true;
    this.scoreboard.screen.globals.canFireBoost = true;
  }

  onUpdate() {
    if (this.scoreboard.screen.globals.canBeClickCreated.length > 9 && !this.activationCounter)
      this.resetActivationCounter()
  }
}


// Element definitions:
customElements.define('scoreboard-element', ScoreboardElement);
// customElements.define('scoreboard-wrapper', Wrapper);
customElements.define('base-panel', Panel);
customElements.define('count-panel', CountPanel);
customElements.define('thing-panel', ThingPanel);
customElements.define('fireball-panel', FireballPanel);



export class ScoreboardSolarSystem extends Scoreboard {
  constructor(attrs = {}) {
    attrs.keys = {
      counts: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'death_star'],
      things: ['sun'],
      tools: ['fire', 'planet_boost']
    };

    attrs.components = {
      wrappers: {},
      panels: []
    };

    super(attrs);

    this.loadStyles();
    this.createComponents();
  }

  createComponents() {
    this.createWrappers().then(() => this.createPanels());
  }

  createWrappers() {
    return new Promise((resolve, reject) => {
      const promiseBottom = new Promise((resolve, reject) => {
        this.components.wrappers.bottom = new ScoreboardElement({
          parent: document.querySelector('#work-place'),
          scoreboard: this,
          additionalCssClasses: 'bottom',
          templateId: 'scoreboard-wrapper',
          uponLoad: () => { resolve() }
        })
      });

      const promiseRight = new Promise((resolve, reject) => {
        this.components.wrappers.right = new ScoreboardElement({
          parent: document.querySelector('#work-place'),
          scoreboard: this,
          additionalCssClasses: 'right',
          templateId: 'scoreboard-wrapper',
          uponLoad: () => { resolve() }
        })
      });

      Promise.all([promiseBottom, promiseRight]).then(() => { resolve() })
    })
  }

  createPanels() {
    this.keys.things.forEach(name => {
      let thing = this.screen.things[name][0];
      this.components.panels.push(new ThingPanel({
        thing: thing,
        parent: this.components.wrappers.bottom,
        scoreboard: this,
        thingName: name,
        displayName: name,
        templateId: 'thing-panel-bottom'
      }))
    })

    this.keys.counts.forEach(name => {
      this.components.panels.push(new CountPanel({
        parent: this.components.wrappers.bottom,
        scoreboard: this,
        thingName: name,
        displayName: name,
        templateId: 'count-panel-bottom'
      }))
    })

    this.components.panels.push(new FireballPanel({
      parent: this.components.wrappers.right,
      scoreboard: this,
      displayName: 'Fireball',
      templateId: 'tool-panel-right',
      locals: {
        imageUrl: `${this.screen.getAssetsFolder()}scoreboard/yellow-projectile-panel.png`
      }
    }))
  }
}
