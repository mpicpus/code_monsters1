import { Minion, Minions } from './minion.js';
import { Track, TrackSet } from './track.js';
import { Prop, Zeppelin, Train } from './prop.js';

// Input management
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

  train() {
    if (!things.props.collection.find(prop => prop.type == 'train'))
      things.props.add(new Train('train', null, null, things.props.canvasSize))
  }

  z(instruction) {

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
