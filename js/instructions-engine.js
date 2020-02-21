import { Minion, Minions } from './minion.js';

// Input management
export class InstructionsEngine {
  constructor(minions, inputBlock, initialize) {
    this.minions = minions;
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
  rename(minion, newName) { if (!this.minions.taken(newName)) minion.name = newName }

  make(minion, name, size) {
    if (!this.minions.taken(name) && name != '' && name != null) {
      this.build(minion);
      minion.actionBuffer.set(5, this.buildMinion, [this.minions, minion, name, size]);
    }
  }

  buildMinion(minions, minion, name, size) {
    minion.stop();
    size = parseInt(size) || parseInt(minion.height);
    minions.add(new Minion(name, minion.type, size, {x: minion.position.x - size - 10, y: minion.position.y + minion.height - size}, minion.canvasSize));
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
