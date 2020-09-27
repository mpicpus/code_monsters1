export class Canvas {
  constructor() {
    this.canvasWrapper = document.querySelector('#work-place');
    // this.canvas = document.querySelector("#canvas");

    this.canvasSize = {
      x: this.canvasWrapper.clientWidth,
      y: this.canvasWrapper.clientHeight
    }
  }
}