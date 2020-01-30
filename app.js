import { Minion } from './minion.js';

// Initial data

let input = "";
let minions, ctx, spriteInterval, writeEvent, inputBlock;
let canvasSize = {};

// Initialization
spriteInterval = window.setInterval(updateSpriteSteps, 150);

function updateSpriteSteps() {
  if (minions)
    minions.forEach((minion) => minion.updateSpriteSteps());
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

  minions = window.theMinions = [new Minion('matt', 'robot', 100, canvasCenter(100), canvasSize)];

  ctx = canvas.getContext("2d");
  window.requestAnimationFrame(draw);
}

let canvasCenter = (minionHeight) => {
  return {
    x: Math.floor(canvasSize.x / 2 - minionHeight / 2),
    y: Math.floor(canvasSize.y / 2 - minionHeight / 2)
  }
}

function draw() {
  updatePositions();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvasSize.x, canvasSize.y); // clear canvas
  drawMinionSprites();

  window.requestAnimationFrame(draw);
}

function drawMinionSprites() {
  ctx.font = "10px monospace";
  
  minions.forEach((minion) => {
    ctx.drawImage(minion.getCurrentSprite(), minion.position.x, minion.position.y, minion.width(minion.getCurrentSprite()), minion.height);
    ctx.fillText(`${minion.name}`, minion.position.x + 22, minion.position.y - 5);
  })
}

function getCurrentSprite() {
  return minionImages ? minionImages[minion.type][minion.state][minion.currentAnimationStep] : null;
}

function updatePositions() {
  updateMinionPositions();
}

function updateMinionPositions() {
  if (minions)
    minions.forEach((minion) => minion.move())
}

function minionNames() {
  return minions.map(minion => minion.name);
}

// Input management

function handleKeypress(event) {
  if (event.code == "Enter") {
    let instructions = parseInstructions(inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]);
    let minion;
    
    if (minionNames().includes(instructions[0])) {
      minion = minions.filter(m => m.name == instructions[0])[0];
      instructions.shift(); 
    } else
        minion = minions[0];

    if (instructions.length > 0 && Object.keys(instructionsTree).includes(instructions[0])){
      instructionsTree[instructions[0]](minion, (instructions[1] || null));
    }

    addTerminalSym();
  }
}

function parseInstructions(instructions) {
  return instructions.split(' ').map((i) => { return i.replace(' ', '') }).filter((i) => i != '');
}

let instructionsTree = {
  move: (minion, direction) => {
    if (Object.keys(minion.movements()).includes(direction)) {
      minion.currentAnimationStep = 0;
      minion.direction = direction;
      minion.go();
    } else
      minion.stop();
  },
  build: (minion) => {
    minion.currentAnimationStep = 0;
    minion.stop();
    minion.state = 'build';
  },
  stop: (minion) => { minion.currentAnimationStep = 0; minion.stop() },
  rename: (minion, name) => { minion.name = name },
  clear: () => { setTimeout(() => {inputBlock.value = ''}, 10) }
}

function addTerminalSym() {
  // setTimeout(() => {inputBlock.value += '> '}, 10)
  inputBlock.focus();
}

window.addEventListener('load', (event) => {
  app()
})
