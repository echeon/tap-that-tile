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


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Tile {
	  constructor(canvas, ctx) {
	    this.canvas = canvas;
	    this.ctx = ctx;
	    this.tapped = false;
	    this.tappedColor = "#f00";
	    this.untappedColor = "#000";
	    this.coordX = 101 * Math.floor(Math.random() * 4);
	    this.coordY = -150;
	  }
	
	
	  draw() {
	    const tileWidth = 100;
	    const tileHeight = 150;
	
	    this.ctx.fillStyle = this.untappedColor;
	    this.ctx.fillRect(this.coordX, this.coordY, tileWidth, tileHeight);
	  }
	
	  update() {
	    this.coordY += 2;
	  }
	}
	
	
	module.exports = Tile;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map