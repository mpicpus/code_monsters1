export class Speed {
  constructor(currentSpeed, targetSpeed) {
    this.currentSpeed = parseFloat(currentSpeed) || 0;
    this.targetSpeed = typeof(parseFloat(targetSpeed)) == 'number' ? parseFloat(targetSpeed) : null;
    this.originalSpeed = this.currentSpeed;
  }

  update() {
    if (this.targetSpeed == null || this.currentSpeed == this.targetSpeed) return;

    this.currentSpeed = this.targetSpeed > this.currentSpeed ? (this.currentSpeed + 0.01) : (this.currentSpeed - 0.01);
    
    if (this.currentSpeed == this.targetSpeed || Math.abs(this.currentSpeed - this.targetSpeed) < 0.01)
      this.normalizeValues();
  }

  setTarget(speed) {
    this.targetSpeed = parseFloat(speed);
    if (this.currentSpeed != 0)
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