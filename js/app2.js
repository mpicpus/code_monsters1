import { Screen } from './screens/screen.js'

class App {
  constructor() {
    this.inputBlock = document.querySelector('.input-area');
    
    this.spriteLoops = {};

    this.initialize();
  }

  initialize(type) {
    type = type || 'initial';
    this.setScreen(type);

    this.inputBlock.value = '';
    // window.requestAnimationFrame(() => this.draw());

    this.initializeDebugWindowVars();
  }

  initializeDebugWindowVars() {
    window.app = this;
  }

  onTypeChange(type) {
    this.initialize(type);
  }

  setScreen(name) {
    Screen.get(name).then(screen => this.screen = screen)
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', (event) => { window.app = new App() });