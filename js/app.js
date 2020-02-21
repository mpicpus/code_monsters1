import { Minion, Minions } from './minion.js';
import { Track, TrackSet, TrackPath } from './track.js';
import { InstructionsEngine } from './instructions-engine.js';

console.log('This is the bronx');
// Initial data

let input = "";
let minions, tracks, ctx, spriteInterval, writeEvent, inputBlock, instructionsEngine;
let canvasSize = {};
let minionHeight = 70;
let fontSize = 13;

// Initialization
spriteInterval = window.setInterval(updateSpriteSteps, 150);

function updateSpriteSteps() {
  if (minions)
    minions.collection.forEach((minion) => minion.updateSpriteSteps());
}

// Main app
function initialize() {
  writeEvent = document.querySelector('.input-area').addEventListener('keydown', handleKeypress)

  let canvasWrapper = document.querySelector('#work-place');
  inputBlock = document.querySelector('.input-area');
  focusTextArea();

  canvasSize = {
    x: canvasWrapper.clientWidth,
    y: canvasWrapper.clientHeight
  }

  let canvas = document.querySelector("#canvas");
  canvas.height = canvasSize.y;
  canvas.width = canvasSize.x;

  let minion = new Minion('matt', 'robot', minionHeight, canvasCenter(minionHeight), canvasSize);
  minions = new Minions();
  minions.add(minion);

  instructionsEngine = new InstructionsEngine(minions, inputBlock, initialize);
  window.inst = InstructionsEngine;
  // tracks = new TrackSet();
  window.track = Track;
  window.minion = Minion;
  window.trackSet = TrackSet;
  window.minions = minions;

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
  
  minions.collection.forEach((minion) => {
    ctx.drawImage(minion.getCurrentSprite(), minion.finalPosition().x, minion.finalPosition().y, minion.width(minion.getCurrentSprite()), minion.height);
    ctx.fillText(`${minion.name}`, minion.position.x + 22, minion.position.y - 5);
  })
}

function updatePositions() {
  updateMinionPositions();
}

function updateMinionPositions() {
  if (minions)
    minions.collection.forEach((minion) => minion.move())
}

function minionNames() {
  return minions.names();
}

function taken(name) {
  return minionNames().includes(name);
}

function handleKeypress(event) {
  if (event.code == "Enter") {
    let instructions = parseInstructions(inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]);
    let selectedMinions;
    
    if (minions.names().includes(instructions[0])) {
      selectedMinions = minions.collection.filter(m => m.name == instructions[0]);
      instructions.shift(); 
    } else if (instructions[0] == 'all') {
      selectedMinions = minions.collection;
      instructions.shift();
    } else if (InstructionsEngine.singleMethodNames().includes(instructions[0])) {
      selectedMinions = [];
      instructionsEngine[instructions[0]]();
    } else {      
      selectedMinions = [];
    }

    if (selectedMinions.length > 0 && instructions.length > 0 && InstructionsEngine.methodNames().includes(instructions[0])){
      selectedMinions.forEach((minion) => {
        let localInstructions = Array.from(instructions);
        let method = localInstructions[0];
        localInstructions.shift();

        instructionsEngine[method](minion, ...localInstructions);
      })
    } else
      selectedMinions.forEach((minion) => minion.stop());

    focusTextArea();
  }
}

function parseInstructions(instructions) {
  return instructions.split(' ').map((i) => { return i.replace(' ', '') }).filter((i) => i != '');
}

function focusTextArea() {
  inputBlock.focus();
}

window.addEventListener('load', (event) => {
  initialize()
})
