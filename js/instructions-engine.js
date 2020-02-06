// Input management
export class InstructionsEngine {
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
    if (!taken(name) && name != '' && name != null) {
      this.build(minion);
      minion.actionBuffer.set(5, this.buildMinion, [minion, name, size]);
    }
  }

  buildMinion(minion, name, size) {
    minion.stop();
    size = parseInt(size) || parseInt(minion.height);
    minions.push(new Minion(name, minion.type, size, {x: minion.position.x - size - 10, y: minion.position.y + minion.height - size}, minion.canvasSize));
  }

  reset() { app(); this.clear(); }
  clear() { setTimeout(() => { inputBlock.value = '' }, 10) }

  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => !['constructor', 'methodNames'].includes(n));
  }
}
