import { Minion, Minions } from './minion.js';

// Input management
export class InstructionsEngine {
  constructor(minions) {
    this.minions = minions;
  }

  move(minion, direction) {
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
  rename(minion, newName) { if (!taken(name)) minion.name = name }

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

  reset() { app(); this.clear(); }
  clear() { setTimeout(() => { inputBlock.value = '' }, 10) }

  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => !['constructor', 'methodNames'].includes(n));
  }
}
