import { Minion, Minions } from './minion.js';
import { Track, TrackSet } from './track.js';
import { Prop, Zeppelin, Train, Cloud, Horseman, Dragon1, Dragon2, Dragon3, Dragon4, Dragon5, Dragon6, Dragon7, Ufo1, Ufo2, Ufo3 } from './prop.js';

export class InstructionSet {
  constructor() {

  }
}

export class InstructionsEngine {
  constructor(things, inputBlock, initialize) {
    this.things = things;
    this.inputBlock = inputBlock;
    this.initialize = initialize;
  }

  go(minion, direction) {
    if (Object.keys(minion.movements()).includes(direction)) {
      minion.direction = direction;
      minion.go();
    } else
      minion.stop();
  }

  speed(minion, direction) {
    if (Object.keys(minion.changeSpeed()).includes(direction))
      minion.changeSpeed()[direction]();
  }

  build(minion) { minion.build() }
  stop(minion) { minion.stop() }
  rename(minion, newName) { if (!this.things.minions.taken(newName)) minion.name = newName }

  blow(minion) {
    minion.die();
    minion.actionQueue.set(1, this.destroy, [this.things.minions, minion]);
  }

  blowTrap(trap) {
    trap.die();
    trap.actionQueue.set(1, this.destroy, [this.things.traps, trap]);
  }

  destroy(minions, minion) {
    minions.remove(minion)
  }

  make(minion, name, size, type) {
    type = this.parseType(type);
    if (!this.things.minions.taken(name) && name != '' && name != null) {
      this.build(minion);
      minion.actionQueue.set(3, this.buildMinion, [this.things.minions, minion, name, size, type]);
    }
  }

  parseType(type) {
    let parsedType = {
      'r': 'robot',
      'sr': 'stone_robot',
      'z': 'zombie',
      's': 'skeleton'
    }[type] || type;

    return parsedType
  }

  buildMinion(minions, minion, name, size, type) {
    minion.stop();
    size = parseInt(size) || parseInt(minion.height);
    let newMinion = new Minion(name, type || minion.type, size, {x: minion.position.x - size - 10, y: minion.position.y + minion.height - size}, minion.canvasSize);
    minions.add(newMinion);
    newMinion.appear();
  }

  cloud() {
    things.props.add(new Cloud(things.props.canvasSize));
  }

  zep(size, speed, number) {
    if (number) {
      size = parseInt(size) || 150;
      speed = parseInt(speed) || 5;
      let num = parseInt(number) > 50 ? 50 : parseInt(number);
      Array.from({length: parseInt(num)}, () => {
        let name = '';
        let randSize = Math.random() * (size - size / 10) + size / 10;
        let randSpeed = Math.random() * (speed - speed / 5) + speed / 5;
        things.props.add(new Zeppelin(name, randSize, randSpeed, things.props.canvasSize))
      });
    } else
      things.props.add(new Zeppelin('', size, speed, things.props.canvasSize));
  }

  train(size, speed, number) {
    if (number) {  
      size = size ? parseInt(size) : null;
      speed = speed ? parseInt(speed) : null;
      let num = parseInt(number) > 50 ? 50 : parseInt(number);
      Array.from({length: parseInt(num)}, () => {
        let name = '';
        let randSize = Math.random() * (size - size / 10) + size / 10;
        let randSpeed = Math.random() * (speed - speed / 5) + speed / 5;
        things.props.add(new Train(name, randSize, randSpeed, things.props.canvasSize))
      });
    } else
      things.props.add(new Train('train', size, speed, things.props.canvasSize))
  }

  z(instruction) {
    things.props.collection.filter(prop => prop.type == 'zeppelin').forEach((zeppelin) => {zeppelin[instruction]()});
  }

  t(instruction) {
    things.props.collection.filter(prop => prop.type == 'train').forEach((train) => {train[instruction]()});
  }

  hm(size, speed, number) {
    if (number) {  
      size = size ? parseInt(size) : null;
      speed = speed ? parseInt(speed) : null;
      let num = parseInt(number) > 50 ? 50 : parseInt(number);
      Array.from({length: parseInt(num)}, () => {
        let name = 'horseman';
        let randSize = Math.random() * (size - size / 10) + size / 10;
        let randSpeed = Math.random() * (speed - speed / 5) + speed / 5;
        things.props.add(new Horseman(name, randSize, randSpeed, things.props.canvasSize))
      });
    } else
      things.props.add(new Horseman('horseman', size, speed, things.props.canvasSize));
  }

  dr(size, speed, number) {
    let numOfClasses = 7
    let type = Math.round(Math.random() * (numOfClasses - 1)) + 1;
    let name = `dragon${type}`;
    let dragonClass;
    try {
      dragonClass = eval(`Dragon${type}`);
    } catch {
      console.log(`Dragon class (Dragon${type}) not recognized. Please contact daddy for support.`);
      return;
    }

    if (number) {
      size = size ? parseInt(size) : null;
      speed = speed ? parseInt(speed) : null;
      let num = parseInt(number) > 50 ? 50 : parseInt(number);
      Array.from({length: parseInt(num)}, () => {
        type = Math.round(Math.random() * (numOfClasses - 1)) + 1;
        name = `dragon${type}`;
        try {
          dragonClass = eval(`Dragon${type}`);
        } catch {
          console.log(`Dragon class (Dragon${type}) not recognized. Please contact daddy for support.`);
          return;
        }
        let randSize = Math.random() * (size - size / 10) + size / 10;
        let randSpeed = Math.random() * (speed - speed / 5) + speed / 5;
        things.props.add(new dragonClass(name, randSize, randSpeed, things.props.canvasSize))
      });
    } else
      things.props.add(new dragonClass(name, size, speed, things.props.canvasSize));
  }

  ufo(size, speed, number) {
    let numOfClasses = 3;
    let type = Math.round(Math.random() * (numOfClasses - 1)) + 1;
    let name = `ufo${type}`;
    let ufoClass;
    try {
      ufoClass = eval(`Ufo${type}`);
    } catch {
      console.log(`"Ufo${type}" class not recognized. Please contact daddy for support.`);
      return;
    }

    if (number) {
      size = size ? parseInt(size) : null;
      speed = speed ? parseInt(speed) : null;
      let num = parseInt(number) > 50 ? 50 : parseInt(number);
      Array.from({length: parseInt(num)}, () => {
        type = Math.round(Math.random() * (numOfClasses - 1)) + 1;
        name = `ufo${type}`;
        try {
          ufoClass = eval(`Ufo${type}`);
        } catch {
          console.log('Ufo number not recognized. Please contact daddy for support.');
          return;
        }

        let randSize = Math.random() * (size - size / 10) + size / 10;
        let randSpeed = Math.random() * (speed - speed / 5) + speed / 5;
        things.props.add(new ufoClass(name, randSize, randSpeed, things.props.canvasSize))
      });
    } else
      things.props.add(new ufoClass(name, size, speed, things.props.canvasSize));
  }

  travel_to(planet) {
    if (window.mode != 'space') return;

    let planetClass = `${capitalize(planet)}`
  }

  track(minion, track) {
    minion.build();
    minion.actionQueue.set(5, this.buildTrack, [minion, track]);
  }

  buildTrack(minion, track) {
    minion.stop();
    things.trackPath.add(track, minion.position);
    minion.position = things.trackPath.lastTrack().attachmentPoint();
  }

  previewTrack(minion, track) {
    things.trackPath.setPreview(track, minion ? minion.position : null)
  }

  bombs() {
    things.traps.show = !things.traps.show;
    console.log(things.traps.show);
  }

  reset() { this.initialize(); this.clear(); }
  clear() { setTimeout(() => { this.inputBlock.value = '' }, 10) }

  static parseInstructions(instructions) {
    return instructions.split(' ').map((i) => { return i.replace(' ', '') }).filter((i) => i != '');
  }

  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => !['constructor'].includes(n));
  }

  static singleMethodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter((name) => this.prototype[name].length == 0)
  }
}
