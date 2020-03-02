import { Minion, Minions } from './minion.js';
import { Track, TrackSet, TrackPath } from './track.js';
import { InstructionsEngine } from './instructions-engine.js';

console.log('This is the bronx');
// Initial data

let input = "";
let ctx, spriteInterval, writeEvent, inputBlock, instructionsEngine;
let canvasSize = {};
let minionHeight = 70;
let trackHeight = 70;
let fontSize = 13;

let things = {}

// Initialization
spriteInterval = window.setInterval(updateSpriteSteps, 150);

function updateSpriteSteps() {
  if (things.minions)
    things.minions.collection.forEach((minion) => minion.updateSpriteSteps());
}

// Main app
function initialize() {
  writeEvent = document.querySelector('.input-area').addEventListener('keyup', handleKeypress)

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
  things.minions = new Minions();
  things.minions.add(minion);

  things.trackPath = new TrackPath();
  things.trackSet = new TrackSet(trackHeight);

  instructionsEngine = new InstructionsEngine(things, inputBlock, initialize);

  window.things = things;
  window.inst = instructionsEngine;

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
  drawTrackSprites();

  window.requestAnimationFrame(draw);
}

function drawMinionSprites() {
  ctx.font = `${fontSize}px monospace`;
  
  things.minions.collection.forEach((minion) => {
    ctx.drawImage(minion.getCurrentSprite(), minion.finalPosition().x, minion.finalPosition().y, minion.width(minion.getCurrentSprite()), minion.height);
    ctx.fillText(`${minion.name}`, minion.position.x + 22, minion.position.y - 5);
  })
}

function drawTrackSprites() {
  things.trackPath.tracks.forEach((track) => {
    ctx.drawImage(track.image, track.position.x, track.position.y, track.size, track.size)
  })

  if (things.trackPath.preview) {
    let track = things.trackPath.preview;
    ctx.globalAlpha = 0.5;
    ctx.drawImage(track.image, track.position.x, track.position.y, track.size, track.size);
    ctx.globalAlpha = 1.0;
  }
}

function updatePositions() {
  updateMinionPositions();
}

function updateMinionPositions() {
  if (things.minions)
    things.minions.collection.forEach((minion) => minion.move())
}

function minionNames() {
  return things.minions.names();
}

function taken(name) {
  return minionNames().includes(name);
}

function handleKeypress(event) {
  if (!inputBlock.value) return;

  let instructions = parseInstructions(inputBlock.value.split('\n').filter((i) => i != '').slice(-1)[0]);

  if (event.code == "Enter") {
    let selectedMinions;
    
    if (things.minions.names().includes(instructions[0])) {
      selectedMinions = things.minions.collection.filter(m => m.name == instructions[0]);
      instructions.shift(); 
    } else if (instructions[0] == 'all') {
      selectedMinions = things.minions.collection;
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
  } else {
    let trackModel = null, minion = null;
    
    if (instructions[1] == 'track') {
      minion = things.minions.collection.filter((m) => m.name == instructions[0])[0] || things.minions.collection[0];
      trackModel = things.trackPath.lastTrack() || things.trackSet.tracks[9];
    }

    console.log(instructions);
    
    instructionsEngine.previewTrack(minion, trackModel)
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
