import { Thing } from '../../thing.js';

// Explosions.
// A group of things which are just wrappers for explosions.
class Explosion extends Thing {
  constructor(attrs = {}) {
    attrs.defaultState = attrs.defaultState || 'destroy';
    attrs.collides = false;
    attrs.scale = attrs.scale ? attrs.scale * app.screen.astronomicalMultiplicator / 0.7 : null;
    
    super(attrs)

    this.thing = attrs.thing;
    this.setStartingPosition()
  }

  setStartingPosition() {
    if (!this.thing) return;

    this.setPosition(this.thing.position)
  }

  onStateComplete() {
    return {
      'go': () => {
        this.remove()
      }
    }
  }
}

export class Explosion01 extends Explosion {
  constructor(attrs = {}) {
    attrs.states = {
      destroy: {steps: 74, loop: false}
    };

    super(attrs)
  }

  onLoad() {
    this.offsetTo('center');
  }
}

export class Explosion02 extends Explosion {
  constructor(attrs = {}) {
    attrs.defaultState = 'go';
    attrs.states = {
      go: {steps: 20, loop: false}
    };
    attrs.animationSpeed = 'fast';

    super(attrs)
  }

  onLoad() {
    this.offsetTo('center');
  }
}

export class Explosion03 extends Explosion {
  constructor(attrs = {}) {
    attrs.states = {
      destroy: {steps: 24, loop: false}
    }

    super(attrs)
  }

  onLoad() {
    this.offsetTo('center');
  }
}

export class Explosion04 extends Explosion {
  constructor(attrs = {}) {
    attrs.defaultState = 'go';
    attrs.states = {
      go: {steps: 10, loop: false}
    };
    attrs.animationSpeed = attrs.animationSpeed || 'medium'
    super(attrs)
  }

  onLoad() {
    this.offsetTo('center');
  }
}
