import { Screen } from './screens/screen.js';
import { InstructionSet } from './instructions.js';

class App {
  constructor() {
    this.inputBlock = document.querySelector('.input-area');
    // this.initialize();
    this.initialize('solar_system');

    this.instructions = new AppInstructionSet({thing: this})
  }

  initialize(type) {
    type = type || 'initial';
    this.setScreen(type);

    this.inputBlock.value = '';

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

  getName() {
    return "App"
  }
}

class AppInstructionSet extends InstructionSet {
  constructor(attrs = {}) {
    super(attrs);

    this.app = attrs.thing;
  }

  screen(name) {
    debugger;
    this.app.initialize(name)
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', (event) => { window.app = new App() });