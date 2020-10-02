// Engine for general instruction parsing.
// Will be part of the Screen instance.
//
// Instruction processing will start here, 
// individual instructions will be passed to the apropriate Thing.instructionSet.
export class InstructionsEngine {
  constructor({
    screen = null,
    selector = '.input-area'
  } = {}) {
    this.screen = screen;
    this.selector = selector;

    this.initialize()
  }

  initialize() {
    this.inputBlock = document.querySelector(this.selector);
    this.writeEvent = this.inputBlock.addEventListener('keyup', this.handleKeypress.bind(this));

    this.buffer = [];
  }

  parse(instructions) {
    instructions = this.normalize(instructions);
    let commands = instructions.split(' ');
    let command = commands.shift();

    let thing = this.getThing(command);

    if (thing)
      thing.parseInstructions(commands);
    else {
      try {
        this[command](commands)
      } catch (e) {
        console.error(e);
        console.error(`I don't know what "${instructions}" means.`);
      }
    }
  }

  normalize(instructions) {
    return instructions.replace(/^ +| +$/g, '').replace(/( ) +/, ' ')
  }

  handleKeypress(event) {
    if (event.keyCode == 13 || event.code == "Enter") {
      let instructions = this.inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]
      this.parse(instructions)
    }
  }

  getThing(command) {
    return this.screen.things.avatar.find(a => a.name == command)
  }

  stop() {
    this.screen.renderer.stop()
  }

  go() {
    this.screen.renderer.go()
  }
}

// Engine for Things class.
// Will encapsulate specific object behaviour.
export class InstructionSet {
  constructor({
    thing = null,
    modules = null
  } = {}) {
    this.thing = thing;
    this.modules = modules;

    this.addModules()
  }

  parse(instructions) {
    console.log(`${this.thing.name} received: "${instructions.join(' ')}"`)
  } 

  addModule(moduleName) {
    let module;
    try {
      module = eval(moduleName)
    } catch(e) { return }

    module.methodNames().forEach( name => this[name] = module.prototype[name] )
  }

  addModules() {
    if (!this.modules || this.modules.length == 0) return;

    this.modules.forEach(name => this.addModule(name))
  }
}


// This class and children will be used to store shared sets across instruction sets.
export class InstructionsModule {
  static methodNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(n => n != 'constructor')
  }
}

// Basic movement set:
class BasicMovementSet extends InstructionsModule {
  move(direction) {
    {
      left: () => {
        this.thing.setState('go');
        this.thing.speed.target.x = 0 - this.thing.speed.default;
        this.thing.move(0 - this.thing.speed.default);
      }
    }
  }

  stop() {
    this.thing.stop();
  }
}
