// Action buffer -> it allows a basic form of timed concatenation.
export class ActionQueue {
  constructor(minion, minions) {
    this.minion = minion;
    this.minions = minions;
    this.currentCounter = 0;
    this.maxCounter = 0;
    this.callback = null;
    this.args = [];
    this.callbackIsExternal = false;
  }

  set(numOfCycles, callback, args) {
    this.maxCounter = numOfCycles * (this.minion.sprites.states[this.minion.state] || 5);
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
    // debugger;
    // this.minion.stop();
    if (typeof(this.callback) == 'function')
      this.callback(...this.args);
    else {
      if (this.minion.methodNames().includes(this.callback))
        this.minion[this.callback]();
    }

    this.reset();
  }
}
