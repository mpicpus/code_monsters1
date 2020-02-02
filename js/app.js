import { Minion } from './minion.js';

// Initial data

let input = "";
let minions, ctx, spriteInterval, writeEvent, inputBlock;
let canvasSize = {};
let minionHeight = 70;
let fontSize = 13;

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

  minions = window.theMinions = [new Minion('matt', 'robot', minionHeight, canvasCenter(minionHeight), canvasSize)];

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
  ctx.font = `${fontSize}px monospace`;
  
  minions.forEach((minion) => {
    ctx.drawImage(minion.getCurrentSprite(), minion.finalPosition().x, minion.finalPosition().y, minion.width(minion.getCurrentSprite()), minion.height);
    ctx.fillText(`${minion.name}`, minion.position.x + 22, minion.position.y - 5);
  })
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

function taken(name) {
  return minionNames().includes(name);
}

// Input management

function handleKeypress(event) {
  if (event.code == "Enter") {
    let instructions = parseInstructions(inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]);
    let selectedMinions;
    
    if (minionNames().includes(instructions[0])) {
      selectedMinions = minions.filter(m => m.name == instructions[0]);
      instructions.shift(); 
    } else if (instructions[0] == 'all') {
      selectedMinions = minions;
      instructions.shift()
    } else
      selectedMinions = [minions[0]];

    if (instructions.length > 0 && Object.keys(instructionsTree).includes(instructions[0])){
      selectedMinions.forEach((minion) => {
        instructionsTree[instructions[0]](minion, instructions[1] || null, instructions[2] || null);
      })
    } else
      selectedMinions.forEach((minion) => minion.stop());

    addTerminalSym();
  }
}

function parseInstructions(instructions) {
  return instructions.split(' ').map((i) => { return i.replace(' ', '') }).filter((i) => i != '');
}

let instructionsTree = {
  move: (minion, direction) => {
    if (Object.keys(minion.movements()).includes(direction)) {
      minion.direction = direction;
      minion.go();
    } else
      minion.stop();
  },
  speed: (minion, direction) => {
    if (Object.keys(minion.changeSpeed()).includes(direction))
      minion.changeSpeed()[direction]();
  },
  build: (minion) => { minion.build() },
  stop: (minion) => { minion.stop() },
  rename: (minion, name) => { if (!taken(name)) minion.name = name },
  make: (minion, name, size) => {
    if (!taken(name) && name != '' && name != null) {
      instructionsTree.build(minion);
      minion.actionBuffer.set(5, instructionsTree.newMinion, [minion, name, size]);
    }
  },
  newMinion: (minion, name, size) => {
    minion.stop();
    minions.push(new Minion(name, minion.type, size || minion.height, {x: minion.position.x - size - 10, y: minion.position.y + minion.height - size}, minion.canvasSize));
  },
  reset: () => app(),
  clear: () => { setTimeout(() => {inputBlock.value = ''}, 10) }
}

instructionsTree.m = instructionsTree.move;
instructionsTree.s = instructionsTree.speed;
instructionsTree.mk = instructionsTree.make;

window.theInstructionsTree = instructionsTree;

function addTerminalSym() {
  // setTimeout(() => {inputBlock.value += '> '}, 10)
  inputBlock.focus();
}

window.addEventListener('load', (event) => {
  app()
})
