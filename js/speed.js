export class Speed {
  constructor({
    currentSpeed = {x: 0, y: 0},
    targetSpeed = null,
    cruiseSpeed = {x: 0, y: 0}
  } = {}) {
    this.currentSpeed = setSpeed(currentSpeed) || {x: 0, y: 0};
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
    speed = speed || {x: 0, y: 0};
    this.currentSpeed.x = parseFloat(speed.x);
    this.currentSpeed.y = parseFloat(speed.y);
    this.originalSpeed = this.currentSpeed;
  }

  setTarget(speed) {
    speed = speed || {x: 0, y: 0};
    this.targetSpeed = parseFloat(speed);
    if (this.currentSpeed > 0 && this.targetSpeed >  0)
      this.originalSpeed = this.currentSpeed;
  }

  resume() {
    this.targetSpeed = this.originalSpeed;
  }

  resetValues() {
    this.currentSpeed = Math.round(this.currentSpeed);
    this.targetSpeed = null;
  }

  round(speed) {
    speed = speed || {x: 0, y: 0}
  }

  roundNum(num) {
    num = parseFloat(num);
    return Math.round(num)
  }

  isZero() {
    return Math.abs(this.currentSpeed) < 0.01;
  }
}
