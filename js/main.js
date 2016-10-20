const Tile = require('./tile.js');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let prevIndex = null;
let nextIndex = getNextIndex();

const FPS = 40;

const tiles = [];


$('#canvas').on('click', e => {
  const positionX = e.offsetX;

  if (positionX >= 0 && positionX < 100) {
    handleTap(0);
  } else if (positionX >= 101 && positionX < 201) {
    handleTap(1);
  } else if (positionX >= 202 && positionX < 302) {
    handleTap(2);
  } else {
    handleTap(3);
  }
});

$(window).on('keydown', e => {
  const key = e.key;

  if (key === "d") {
    handleTap(0);
  } else if (key === "f") {
    handleTap(1);
  } else if (key === "j") {
    handleTap(2);
  } else if (key === "k") {
    handleTap(3);
  }
});

function handleTap(lineNumber) {
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i][lineNumber].tapped) {
      tiles[i].forEach(tile => tile.handleTap());
      tiles[i][lineNumber].handleColorChange();
      if (!tiles[i][lineNumber].isBlack) {
        draw();
        drawDividers();
        update();
        window.clearInterval(updateId);
        window.clearInterval(addRowId);
        $('#canvas').off('click');
      }
      break;
    }
  }
}

function generateRow() {
  const nextRow = [];
  [0, 1, 2, 3].forEach(lineIndex => {
    if (lineIndex === nextIndex) {
      nextRow.push(new Tile(canvas, true, lineIndex));
    } else {
      nextRow.push(new Tile(canvas, false, lineIndex));
    }
  });

  prevIndex = nextIndex;
  nextIndex = getNextIndex();

  return nextRow;
}

function getNextIndex() {
  let nextIndex = Math.floor(Math.random() * 4);
  while (nextIndex === prevIndex) {
    nextIndex = Math.floor(Math.random() * 4);
  }
  return nextIndex;
}


const updateId = window.setInterval(() => {
  // printLocation();
  draw();
  drawDividers();
  update();
}, 10);

function printLocation() {
  console.log(tiles.map(row => {
    return row.map(tile => tile.coordY);
  }));
}

const addRowId = window.setInterval(() => {
  addRow();
}, (10)*(150/2));

// addRow();
// printLocation();
// draw();
// drawDividers();
// update();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tiles.forEach(row => {
    row.forEach(tile => {
      tile.draw();
    });
  });
}

function update() {
  tiles.forEach(row => {
    row.forEach(tile => {
      tile.update();
    });
  });
}

function addRow() {
  const newRow = generateRow()
  tiles.push(newRow);
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
