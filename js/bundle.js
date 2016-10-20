/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Tile = __webpack_require__(1);
	
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
	      tiles[i][lineNumber].changeColor();
	      if (!tiles[i][lineNumber].isBlack) {
	        draw();
	        update();
	        window.clearInterval(updateId);
	        window.clearInterval(addRowId);
	        $('#canvas').off('click');
	        $(window).off('keydown');
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
	  if (isGameOver()) {
	    window.clearInterval(updateId);
	    window.clearInterval(addRowId);
	    $('#canvas').off('click');
	    $(window).off('keydown');
	    handleGameOver();
	  }
	  draw();
	  update();
	}, 10);
	
	function handleGameOver() {
	  changeMissedTileColor();
	  moveEverythingUp();
	}
	
	function changeMissedTileColor() {
	  tiles[0].forEach(tile => {
	    if (tile.isBlack) {
	      tile.changeColorToRed();
	    }
	  })
	}
	
	function moveEverythingUp() {
	  tiles.forEach(row => {
	    row.forEach(tile => {
	      tile.moveUp();
	    });
	  });
	}
	
	function printLocation() {
	  console.log(tiles.map(row => {
	    return row.map(tile => tile.coordY);
	  }));
	}
	
	const addRowId = window.setInterval(() => {
	  addRow();
	}, (10)*(150/10));
	
	function draw() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  drawDividers();
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
	
	function isGameOver() {
	  for (let i = 0; i < tiles.length; i++) {
	    const nextUntappedTile = tiles[i][0];
	    if (!nextUntappedTile.tapped && nextUntappedTile.coordY >= 600) {
	      return true;
	    }
	  }
	  return false;
	}
	
	function addRow() {
	  const newRow = generateRow()
	  tiles.push(newRow);
	  if (tiles.length >= 7) {
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Tile {
	  constructor(canvas, isBlack, lineNumber) {
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.tapped = false;
	    this.isBlack = isBlack;
	    this.color = isBlack ? "#000" : "transparent";
	    this.coordX = 101 * lineNumber;
	    this.coordY = -150;
	  }
	
	  draw() {
	    const tileWidth = 100;
	    const tileHeight = 150;
	
	    this.ctx.fillStyle = this.color;
	    this.ctx.fillRect(this.coordX, this.coordY, tileWidth, tileHeight);
	  }
	
	  update() {
	    this.coordY += 10;
	  }
	
	  handleTap() {
	    this.tapped = !this.tapped;
	  }
	
	  changeColor() {
	    const tappedBlack = "rgba(0, 0, 0, 0.1)";
	    const tappedWrong = "rgba(255, 50, 50, 1)";
	    this.color = (this.color === "#000") ? tappedBlack : tappedWrong;
	  }
	
	  changeColorToRed() {
	    this.color = "rgb(255, 50, 50)";
	  }
	
	  moveUp() {
	    this.coordY -= 150;
	  }
	}
	
	
	module.exports = Tile;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map