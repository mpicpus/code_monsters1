import { Thing } from '../../thing.js';
import { Avatar } from '../../avatar.js';

export class Sun extends Thing {
  constructor(attrs = {}) {
    attrs.states = {idle: {steps: 23, loop: true}};
    attrs.scale = 0.3;

    super(attrs);
  }

  onLoad() {
    setTimeout(() => {
      this.moveTo('center');
      this.pivotToCenter()
    }, 200)
  }
}

class Planet extends Thing {
  constructor(attrs={
    orbitRadius: 100,
    centerObject: {
      position: {x: 0, y: 0}
    },
    angle: 0
  }) {

    attrs.currentState = attrs.currentState || 'go';
    attrs.defaultState = attrs.defaultState || 'go';
    attrs.speed = attrs.speed || {x: 1, y: 1};

    super(attrs);

    this.orbitRadius = attrs.orbitRadius;
    this.centerObject = attrs.centerObject;
    this.angle = 0;
  }

  onLoad() {
    setTimeout(() => {
      this.pivotToCenter();
      this.setStartingPosition()
    }, 200)
  }

  setStartingPosition() {
    this.angle = Math.random() * 360;
    this.speed = {x: this.speed.x / this.orbitRadius * 30, y: this.speed.y / this.orbitRadius * 30}
    this.orbitRadius = this.orbitRadius / 1.5;  
  }

  angularSpeed() {
    return Math.PI / this.speed.x && this.speed.x > 0 ? this.speed.x : 1
  }

  setAngle() {
    this.angle += this.angularSpeed();
    
    if (this.angle > 360)
      this.angle = this.angle - 360
  }

  move() {
    this.setAngle();

    let newPosition = {
      x: this.orbitRadius * Math.sin(Math.PI * 2 * this.angle / 360) + this.centerObject.position.x,
      y: this.orbitRadius * Math.cos(Math.PI * 2 * this.angle / 360) + this.centerObject.position.y
    }

    this.setPosition(newPosition)
  }
}

export class Mercury extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 100;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Venus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 200;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Earth extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 300;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.2;
    super(attrs)
  }
}

export class Mars extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 400;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}


export class Jupiter extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 500;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.15;
    super(attrs)
  }
}

export class Saturn extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 600;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Uranus extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 700;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}

export class Neptune extends Planet {
  constructor(attrs = {}) {
    attrs.states = {
      go: {
        steps: 90,
        loop: true
      },
    };

    attrs.orbitRadius = 800;
    attrs.animationSpeed = 'fast';
    attrs.scale = 0.1;
    super(attrs)
  }
}



window.Saturn = Saturn