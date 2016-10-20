const Tile = require('./tile.js');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let time = 0;

const FPS = 40;

const tiles = [new Tile(canvas, ctx)];
// printLocation();
draw();
drawDividers();
update();

window.setInterval(() => {
  // printLocation();
  draw();
  drawDividers();
  update();
}, 10);

function printLocation() {
  console.log(tiles.map(tile => {
    return tile.coordY;
  }));
}

window.setInterval(() => {
  addTile();
}, (10)*(150/2));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tiles.forEach(tile => {
    tile.draw();
  });
}

function update() {
  tiles.forEach(tile => {
    tile.update();
  });
}

function addTile() {
  tiles.push(new Tile(canvas, ctx));
  if (tiles.length >= 6) {
    tiles.shift();
  }
}

function drawDividers() {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100.5, 0);
  ctx.lineTo(100.5, 600);
  ctx.stroke();
  ctx.moveTo(201.5, 0);
  ctx.lineTo(201.5, 600);
  ctx.stroke();
  ctx.moveTo(302.5, 0);
  ctx.lineTo(302.5, 600);
  ctx.stroke();
  ctx.closePath();
}
