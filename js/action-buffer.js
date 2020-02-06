// Action buffer -> it allows a basic form of timed concatenation.
export class ActionBuffer {
  constructor(minion, minions) {
    this.minion = minion;
    this.minions = minions;
    this.currentCounter = 0;
    this.maxCounter = 0;
    this.callback = null;
    this.args = [];
  }

  set(numOfCycles, callback, args) {
    this.maxCounter = numOfCycles * 5;
    this.currentCounter = 0;
    this.callback = callback;
    this.args = args;
  }

  isActive() {
    return this.callback && this.currentCounter < this.maxCounter
  }

  reset() {
    this.currentCounter = 0;
    this.maxCounter = 0;
    this.callback = null;
    this.args = [];
  }

  advance() {
    if (!this.isActive()) return;

    this.currentCounter ++;
    if (this.currentCounter == this.maxCounter)
      this.perform()
  }

  perform() {
    this.callback(...this.args);
    this.reset();
  }
}
