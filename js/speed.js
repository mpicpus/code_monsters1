export class Speed {
  constructor({
    currentSpeed = 0,
    targetSpeed = null
  } = {}) {
    this.currentSpeed = parseFloat(currentSpeed) || 0;
    this.targetSpeed = targetSpeed != null && typeof(parseFloat(targetSpeed)) == 'number' ? parseFloat(targetSpeed) : null;
    this.originalSpeed = this.currentSpeed;
  }

  update() {
    if (this.targetSpeed == null || this.currentSpeed == this.targetSpeed) return;

    this.currentSpeed = this.targetSpeed > this.currentSpeed ? (this.currentSpeed + 0.01) : (this.currentSpeed - 0.01);
    
    if (this.currentSpeed == this.targetSpeed || Math.abs(this.currentSpeed - this.targetSpeed) < 0.01)
      this.normalizeValues();
  }

  setSpeed(speed) {
    this.currentSpeed = parseFloat(speed);
    this.originalSpeed = parseFloat(speed);
  }

  setTarget(speed) {
    this.targetSpeed = parseFloat(speed);
    if (this.currentSpeed > 0 && this.targetSpeed >  0)
      this.originalSpeed = this.currentSpeed;
  }

  resume() {
    this.targetSpeed = this.originalSpeed;
  }

  normalizeValues() {
    this.currentSpeed = Math.round(this.currentSpeed);
    this.targetSpeed = null;
  }

  isZero() {
    return Math.abs(this.currentSpeed) < 0.01;
  }
}