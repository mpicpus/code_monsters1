// Initial data
let minion = {
  name: 'Thousy',
  state: 'idle',
  type: 'robot',
  currentStep: 0,
  direction: 'right',
  height: 100,
  width: (img) => img.width / img.height * minion.height,
  position: {
    x: 0,
    y: 500
  },
  movementLimit: {
    left: () => {return {x: 0, y: null}},
    right: () => {return {x: canvasSize.x - minion.height, y: null}},
    up: () => {return {x: null, y: 0}},
    down: () => {return {x: null, y: canvasSize.y - minion.height}}
  },
  isBlocked: () => {
    return (minion.movementLimit[minion.direction]().x == null && minion.movementLimit[minion.direction]().y == minion.position.y) ||
    (minion.movementLimit[minion.direction]().y == null && minion.movementLimit[minion.direction]().x == minion.position.x)
  },
  move: {
    left: () => { minion.position.x-- },
    right: () => { minion.position.x++ },
    up: () => { minion.position.y-- },
    down: () => { minion.position.y++ }
  },
  stop: () => {
    minion.state = 'idle'
  },
  go: () => {
    minion.state = 'go'
  }
};

let avatarSteps = {
  robot: {
    idle: 5,    
    go: 5,
    die: 9,
    build: 7
  }
}

let input = "";
let ctx, avatarImages, spriteInterval, inputBlock;
let canvasSize = {};

// Initialization
spriteInterval = window.setInterval(updateSpriteSteps, 150);
avatarImages = loadImages();

function updateSpriteSteps() {
  minion.currentStep ++;
  if (minion.currentStep > avatarImages[minion.type][minion.state].length - 1)
    minion.currentStep = 0;
}

function getSpriteImage(name, state, index) {
  return `assets/avatars/${name}/${state}/${index}.png`
}

function loadImages() {
  let images = {};

  for (let name in avatarSteps) {
    images[name] = {};
    for (let state in avatarSteps[name]) {
      images[name][state] = Array(avatarSteps[name][state]).fill(0).map((el, index) => {
        let img = new Image();
        img.src = getSpriteImage(name, state, index + 1);
        return img;
      });
    }
  }

  return images;
}

// Main app
function app() {
  writeEvent = document.querySelector('.input-area').addEventListener('keydown', handleKeypress)

  let canvasWrapper = document.querySelector('#work-place');
  inputBlock = document.querySelector('.input-area');
  addTerminalSym();

  canvasSize = {
    x: canvasWrapper.clientWidth,
    y: canvasWrapper.clientHeight
  }

  let canvas = document.querySelector("#canvas");
  canvas.height = canvasSize.y;
  canvas.width = canvasSize.x;

  centerAvatar();

  ctx = canvas.getContext("2d");
  window.requestAnimationFrame(draw);
}

let centerAvatar = () => {
  minion.position.x = canvasSize.x / 2 - minion.height / 2;
  minion.position.y = canvasSize.y / 2 - minion.height / 2;
}

function draw() {
  updatePositions();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvasSize.x, canvasSize.y); // clear canvas
  ctx.drawImage(getCurrentSprite(), minion.position.x, minion.position.y, minion.width(getCurrentSprite()), minion.height);

  window.requestAnimationFrame(draw);
}

function getCurrentSprite() {
  return avatarImages ? avatarImages[minion.type][minion.state][minion.currentStep] : null;
}

function updatePositions() {
  updateAvatarPosition();
}

function updateAvatarPosition() {
  if (minion.state == 'go') {
    if (minion.isBlocked()) {
      minion.stop()
    } else {
      minion.move[minion.direction]();
    }
  }
}

// Input management

function handleKeypress(event) {
  if (event.code == "Enter") {
    let instructions = parseInstructions(inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]);
    
    if (instructions.length > 0 && Object.keys(instructionsTree).includes(instructions[0]))
      instructionsTree[instructions[0]](instructions[1] || null);

    addTerminalSym();
  }
}

function parseInstructions(instructions) {
  return instructions.split(' ').map((i) => { return i.replace(' ', '') }).filter((i) => i != '');
}

let instructionsTree = {
  move: (direction) => {
    if (Object.keys(minion.move).includes(direction)) {
      minion.currentStep = 0;
      minion.direction = direction;
      minion.go();
    } else
      minion.stop();
  },
  build: () => {
    minion.currentStep = 0;
    minion.stop();
    minion.state = 'build';
  },
  stop: () => { minion.currentStep = 0; minion.stop() },
  clear: () => { setTimeout(() => {inputBlock.value = ''}, 10) }
}

function addTerminalSym() {
  // setTimeout(() => {inputBlock.value += '> '}, 10)
  inputBlock.focus();
}

window.addEventListener('load', (event) => {
  app()
})
