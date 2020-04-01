import { Minion, Minions } from './minion.js';
import { Trap, Traps } from './trap.js';
import { Prop, Props, Zeppelin, Train } from './prop.js';
import { Track, TrackSet, TrackPath } from './track.js';
import { InstructionsEngine } from './instructions-engine.js';

// Initial data

let input = "";
let ctx, spriteInterval, writeEvent, inputBlock, instructionsEngine;
let canvasSize = {};
let minionHeight = 180;
let mineHeight = 45;
let trackHeight = 70;
let fontSize = 13;
let showHotPoints = false;

let things = {}

// Initialization
spriteInterval = window.setInterval(updateSpriteSteps, 150);

function updateSpriteSteps() {
  if (things.minions)
    things.minions.collection.forEach((minion) => minion.updateSpriteSteps());

  if (things.traps)
    things.traps.collection.forEach((trap) => trap.updateSpriteSteps());

  if (things.props)
    things.props.collection.forEach((prop) => prop.updateSpriteSteps());
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

  let minion = new Minion('matt', 'stone_robot', minionHeight, canvasBottomRight(minionHeight), canvasSize);
  things.minions = new Minions();
  things.minions.add(minion);

  let newTraps = [...Array(20).keys()].map((i) => {
    return new Trap(``, 'mine', mineHeight, {x: Math.random() * canvasSize.x * 0.78, y: Math.random() * canvasSize.y})
  });
    
  things.traps = new Traps();
  things.traps.collection = newTraps;
  // let newTrap = new Trap(`1`, 'mine', minionHeight / 2, canvasCenter(minionHeight), canvasSize);
  // things.traps.add(newTrap);

  things.props = new Props([], canvasSize);
  // let newTrain = new Train('train', null, null, canvasSize);
  // things.props.add(newTrain);

  things.trackPath = new TrackPath();
  things.trackSet = new TrackSet(trackHeight);

  instructionsEngine = new InstructionsEngine(things, inputBlock, initialize);
  window.instructionsEngine = instructionsEngine;

  window.things = things;

  ctx = canvas.getContext("2d");
  window.requestAnimationFrame(draw);
}

let canvasCenter = (minionHeight) => {
  return {
    x: Math.floor(canvasSize.x / 2 - minionHeight / 2),
    y: Math.floor(canvasSize.y / 2 - minionHeight / 2)
  }
}

let canvasBottomRight = (minionHeight) => {
  return {
    x: Math.floor(canvasSize.x * 0.95 - minionHeight),
    y: Math.floor(canvasSize.y * 0.95 - minionHeight)
  }
}

function draw() {
  updateStates();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvasSize.x, canvasSize.y); // clear canvas
  drawMinionSprites();
  drawTrapSprites();
  drawPropSprites();
  drawTrackSprites();

  window.requestAnimationFrame(draw);
}

function drawHotPoints(thing, radius, color) {
  if (!showHotPoints) return;

  let hotpoints = thing.getHotPoints();
  radius = radius || 5;
  color = color || 'red';

  hotpoints.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  })
}

function drawMinionSprites() {
  ctx.font = `${fontSize}px monospace`;
  
  things.minions.collection.forEach((minion) => {
    ctx.beginPath();
    ctx.drawImage(minion.getCurrentSprite(), minion.finalPosition().x, minion.finalPosition().y, minion.width(minion.getCurrentSprite()), minion.height);

    drawHotPoints(minion);

    ctx.fillStyle = "white";
    ctx.fillText(`${minion.name}`, minion.position.x + 22, minion.position.y - 5);
    ctx.closePath();
  })
}

function drawTrapSprites() {
  things.traps.collection.forEach((trap) => {
    ctx.beginPath();
    ctx.drawImage(trap.getCurrentSprite(), trap.finalPosition().x, trap.finalPosition().y, trap.width(trap.getCurrentSprite()), trap.height);
    ctx.closePath();
    drawHotPoints(trap)
  })
}

function drawPropSprites() {
  things.props.collection.forEach((prop) => {
    ctx.beginPath();
    ctx.drawImage(prop.getCurrentSprite(), prop.finalPosition().x, prop.finalPosition().y, prop.width(prop.getCurrentSprite()), prop.height);
    ctx.closePath();
  })
}

function drawTrackSprites() {
  things.trackPath.tracks.forEach((track) => {
    cts.beginPath();
    ctx.drawImage(track.image, track.position.x, track.position.y, track.size, track.size);
    ctx.closePath();
  })

  if (things.trackPath.preview) {
    let track = things.trackPath.preview;
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(track.image, track.position.x, track.position.y, track.size, track.size);
    ctx.globalAlpha = 1.0;
    ctx.closePath();
  }
}

function updateStates() {
  updateMinionPositions();
  updatePropPositions();
  checkTraps();
}

function updateMinionPositions() {
  if (things.minions)
    things.minions.collection.forEach((minion) => minion.move())
}

function updatePropPositions() {
  if (things.props){
    things.props.collection.forEach((prop) => prop.move());
    things.props.checkZepBoundaries()
  }
}

function checkTraps() {
  let threshold = 50;
  things.traps.collection.filter(trap => trap.state != 'die').forEach((trap) => {
    let trapHotPoints = trap.getHotPoints();
    
    let touchedMinions = things.minions.collection
                        .filter((minion) => {
                          let minionHotPoints = minion.getHotPoints();
                          return minion.state != 'die' &&
                            minionHotPoints.find((mhp) => {
                              return trapHotPoints.filter((thp) => Math.abs(mhp.x - thp.x) + Math.abs(mhp.y - thp.y) < threshold).length > 0
                            }) })
    
    if (touchedMinions.length > 0) {
      instructionsEngine.blowTrap(trap);
      touchedMinions.forEach((minion) => {
        instructionsEngine.blow(minion)
      })
    }
  })
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
    } else if (['zep', 'train', 'z', 't'].includes(instructions[0])) {
      let method = instructions[0];
      instructions.shift();
      let localInstructions = Array.from(instructions);
      instructionsEngine[method](... localInstructions);      
    } else if (['points'].includes(instructions[0])) {
      togglePoints();
    } else
      selectedMinions.forEach((minion) => minion.stop());

    focusTextArea();
  } else {
    let trackModel = null, minion = null;
    
    if (instructions[1] == 'track') {
      minion = things.minions.collection.filter((m) => m.name == instructions[0])[0] || things.minions.collection[0];
      trackModel = things.trackPath.lastTrack() || things.trackSet.tracks[9];
    }
    
    instructionsEngine.previewTrack(minion, trackModel)
  }
}

function togglePoints() {
  showHotPoints = !showHotPoints;
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
