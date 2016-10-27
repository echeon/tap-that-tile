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

	const Game = __webpack_require__(1);
	const SOUNDS = __webpack_require__(3);
	
	// musics
	const happyBirthday = __webpack_require__(4);
	const LittleStar = __webpack_require__(5);
	const PreludeInC = __webpack_require__(6);
	
	const canvas = document.getElementById('canvas');
	
	const ctx = canvas.getContext('2d');
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
	
	const musics = [
	  happyBirthday,
	  LittleStar,
	  PreludeInC
	];
	
	musics.forEach(music => {
	  const list = $(`<li><p>${music.title}</p><button>play</button></li>`);
	  $('#main-screen > .list > ul').append(list);
	});
	
	$('#main-screen > .list button').each((index, button) => {
	  $(button).on('click', () => {
	    const newGame = new Game(
	      canvas,
	      musics[index].notes,
	      SOUNDS,
	      musics[index].intervalTime
	    );
	    
	    $('#game-end-screen i').on('click', () => {
	      $('#game-end-screen').hide();
	      newGame.reset();
	      $('#main-screen').show();
	    });
	
	    $("#main-screen").hide();
	    newGame.reset();
	    newGame.play();
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Tile = __webpack_require__(2);
	
	const MINIMUM_INTERVAL = 5;
	
	class Game {
	  constructor(canvas, music, sounds, intervalTime) {
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.highestScore = 0;
	    this.currentScore = 0;
	    this.tiles = [];
	    this.prevIndex = null;
	    this.nextIndex = this.getRandomNumber();
	    this.music = music;
	    this.notes = music.filter(note => note ? true : false);
	    this.notesIndex = 0;
	    this.sounds = sounds;
	    this.initIntervalTime = intervalTime;
	    this.intervalTime = intervalTime;
	    this.whenToSpeedUp = Math.min(100, this.notes.length);
	    this.interval1 = null;
	    this.interval2 = null;
	
	    this.updateIntervalHelper = this.updateIntervalHelper.bind(this);
	    this.addRow = this.addRow.bind(this);
	
	    this.generateGame();
	  }
	
	  play() {
	    this.initScoreBoard();
	    this.generateGame();
	
	    this.addClickEventListener();
	    this.addKeydownEventListener();
	
	    this.startCountdown();
	
	    window.setTimeout(() => {
	      this.interval1 = window.setInterval(this.updateIntervalHelper, this.intervalTime);
	      this.inverval2 = window.setInterval(this.addRow, this.intervalTime*30);
	    }, 3000);
	  }
	
	  increaseSpeed() {
	    this.clearIntervals();
	    if (this.intervalTime > MINIMUM_INTERVAL) {
	      this.intervalTime -= 2;
	    }
	    this.interval1 = window.setInterval(this.updateIntervalHelper, this.intervalTime);
	    this.inverval2 = window.setInterval(this.addRow, this.intervalTime*30);
	  }
	
	  startCountdown() {
	    $('#count-3').show();
	
	    window.setTimeout(() => {
	      $('#count-3').hide();
	      $('#count-2').show();
	    }, 1000);
	
	    window.setTimeout(() => {
	      $('#count-2').hide();
	      $('#count-1').show();
	    }, 2000);
	
	    window.setTimeout(() => {
	      $('#count-1').hide();
	    }, 3000);
	  }
	
	  generateGame() {
	    this.game = [];
	    this.gameIndex = 0;
	    this.music.forEach(note => {
	      if (note) {
	        const prevNumber = this.game[this.game.length - 1];
	        let randomNumber = this.getRandomNumber();
	        while (randomNumber === prevNumber) {
	          randomNumber = this.getRandomNumber();
	        }
	        this.game.push(randomNumber);
	      } else {
	        this.game.push(null);
	      }
	    });
	  }
	
	  updateIntervalHelper() {
	    if (this.didMissTile()) {
	      window.clearInterval(this.interval1);
	      window.clearInterval(this.inverval2);
	
	      this.removeEventListeners();
	      this.handleMissingTile();
	    }
	    this.draw();
	    this.update();
	  }
	
	  reset() {
	    this.currentScore = 0;
	    this.tiles = [];
	    this.prevIndex = null;
	    this.nextIndex = this.getRandomNumber();
	    this.notesIndex = 0;
	    this.intervalTime = this.initIntervalTime;
	    this.draw();
	    $('#score-board').hide();
	  }
	
	  initScoreBoard() {
	    $('#score-board').show();
	    $('#score-board').css('transform', `translateY(${$('#canvas')[0].offsetTop}px)`);
	    this.updateScoreBoard();
	  }
	
	  incrementScore() {
	    this.currentScore++;
	    this.updateScoreBoard();
	  }
	
	  decrementScore() {
	    this.currentScore--;
	    this.updateScoreBoard();
	  }
	
	  updateScoreBoard() {
	    $('#score-board').html(this.currentScore);
	  }
	
	  hasBlackTile(row) {
	    return row.some(tile => tile.isBlack);
	  }
	
	  handleTap(index) {
	    for (let i = 0; i < this.tiles.length; i++) {
	      const row = this.tiles[i];
	      const tappedTile = row[index];
	
	      if (!tappedTile.tapped) {
	        const currentNote = this.notes[this.notesIndex];
	
	        let soundGroup;
	        if (Array.isArray(currentNote)) {
	          if (currentNote.length === 1) {
	            soundGroup = [this.sounds[currentNote].cloneNode()];
	          } else if (currentNote.length > 1) {
	            soundGroup = currentNote.map(note => {
	              return this.sounds[note].cloneNode();
	            });
	          }
	        } else {
	          soundGroup = [this.sounds[currentNote].cloneNode()];
	        }
	
	        row.forEach(tile => tile.handleTap());
	        tappedTile.changeColor();
	        this.incrementScore();
	
	        // if you tap non-black tile
	        if (!tappedTile.isBlack) {
	          soundGroup = [new Audio('./music/audio/gameover.wav')];
	          if (tappedTile.coordY > 450) {
	            this.moveRemainingTilesToBaseline();
	          }
	
	          this.draw();
	          this.update();
	
	          this.clearIntervals();
	
	          this.decrementScore();
	          this.removeEventListeners();
	
	          this.showOptionsAfterGameOver();
	        }
	
	        soundGroup.forEach(sound => sound.play());
	        this.notesIndex = (this.notesIndex + 1) % this.notes.length;
	
	        break;
	      }
	    }
	  }
	
	  showOptionsAfterGameOver() {
	    window.setTimeout(() => {
	      $('#game-end-screen').show();
	      $(window).on('keydown', e => {
	        if (e.keyCode === 0 || e.keyCode === 32) {
	          $(window).off('keydown');
	          $('#game-end-screen').hide();
	          this.reset();
	          this.play();
	        }
	      });
	    }, 1000);
	  }
	
	  clearIntervals() {
	    window.clearInterval(this.interval1);
	    window.clearInterval(this.inverval2);
	  }
	
	  addClickEventListener() {
	    $('#canvas').on('click', e => {
	      const positionX = e.offsetX;
	
	      if (positionX >= 0 && positionX < 100) {
	        this.handleTap(0);
	      } else if (positionX >= 101 && positionX < 201) {
	        this.handleTap(1);
	      } else if (positionX >= 202 && positionX < 302) {
	        this.handleTap(2);
	      } else {
	        this.handleTap(3);
	      }
	    });
	  }
	
	  addKeydownEventListener() {
	    $(window).on('keydown', e => {
	      const key = e.key;
	
	      if (key === "f") {
	        this.handleTap(0);
	      } else if (key === "g") {
	        this.handleTap(1);
	      } else if (key === "h") {
	        this.handleTap(2);
	      } else if (key === "j") {
	        this.handleTap(3);
	      }
	    });
	  }
	
	  removeEventListeners() {
	    $('#canvas').off('click');
	    $(window).off('keydown');
	  }
	
	  update() {
	    this.tiles.forEach(row => {
	      row.forEach(tile => {
	        tile.update()
	      });
	    });
	  }
	
	  draw() {
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.drawDividers();
	    this.tiles.forEach(row => {
	      row.forEach(tile => {
	        tile.draw()
	      });
	    });
	  }
	
	  drawDividers() {
	    this.ctx.strokeStyle = '#fff';
	    this.ctx.lineWidth = 1;
	    this.ctx.beginPath();
	    this.ctx.moveTo(100.5, 0);
	    this.ctx.lineTo(100.5, 600);
	    this.ctx.stroke();
	    this.ctx.moveTo(201.5, 0);
	    this.ctx.lineTo(201.5, 600);
	    this.ctx.stroke();
	    this.ctx.moveTo(302.5, 0);
	    this.ctx.lineTo(302.5, 600);
	    this.ctx.stroke();
	    this.ctx.closePath();
	  }
	
	  getRandomNumber() {
	    return Math.floor(Math.random() * 4);
	  }
	
	  generateRow() {
	    const nextRow = [];
	    for (let i = 0; i < 4; i++) {
	      if (i === this.game[this.gameIndex]) {
	        nextRow.push(new Tile(this.canvas, true, i));
	      } else {
	        nextRow.push(new Tile(this.canvas, false, i));
	      }
	    }
	
	    if (!this.hasBlackTile(nextRow)) {
	      nextRow.forEach(tile => tile.handleTap());
	    }
	
	    this.gameIndex++;
	
	    return nextRow;
	  }
	
	  addRow() {
	    if (this.gameIndex > this.game.length) {
	      this.generateGame();
	    }
	    const newRow = this.generateRow();
	    this.tiles.push(newRow);
	    if (this.tiles.length >= 7) {
	      this.tiles.shift();
	    }
	    if (this.currentScore && this.currentScore % this.whenToSpeedUp === 0) {
	      this.increaseSpeed();
	      $('#warning').show();
	      $('#warning').fadeTo(3000, 0, () => {
	        $('#warning').hide();
	        $('#warning').css('opacity', 1);
	      });
	    }
	  }
	
	  didMissTile() {
	    for (let i = 0; i < this.tiles.length; i++) {
	      const nextUntappedTile = this.tiles[i][0];
	      if (!nextUntappedTile.tapped && nextUntappedTile.coordY >= this.canvas.height) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  handleMissingTile() {
	    const sound = new Audio('./music/audio/gameover.wav');
	    sound.play();
	
	    this.showOptionsAfterGameOver();
	
	    this.clearIntervals();
	    this.changeMissedTileColor();
	    this.moveRemainingTilesToBaseline();
	  }
	
	  changeMissedTileColor() {
	    this.tiles[0].forEach(tile => {
	      if (tile.isBlack) {
	        tile.changeColorToRed();
	      }
	    })
	  }
	
	  moveRemainingTilesToBaseline() {
	    const bottomTile = this.tiles[0][0];
	    const tileOffsetY = bottomTile.coordY - 450;
	
	    this.tiles.forEach(row => {
	      row.forEach(tile => {
	        tile.moveUp(tileOffsetY);
	      })
	    })
	  }
	}
	
	module.exports = Game;


/***/ },
/* 2 */
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
	    this.coordY += 5;
	  }
	
	  handleTap() {
	    this.tapped = true;
	  }
	
	  changeColor() {
	    const tappedBlack = "rgba(0, 0, 0, 0.1)";
	    const tappedWrong = "rgba(255, 50, 50, 1)";
	    this.color = (this.color === "#000") ? tappedBlack : tappedWrong;
	  }
	
	  changeColorToRed() {
	    this.color = "rgb(255, 50, 50)";
	  }
	
	  moveUp(offsetY) {
	    this.coordY -= offsetY;
	  }
	}
	
	module.exports = Tile;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Sounds = {};
	
	for (let i = 0; i <= 88; i++) {
	  Sounds[i] = new Audio(`./music/audio/mp3/${i}.mp3`);
	};
	
	module.exports = Sounds;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const keyNumbers = [
	  0, 42, 0, 0, 42, 44, 0, 0, 0, 42, 0, 0, 0, 47, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 42, 44, 0, 0, 0, 42, 0, 0, 0, 49, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 42, 54, 0, 0, 0, 51, 0, 0, 0, 47, 0, 0, 0, 46, 0, 0, 0, 44, 0, 0, 0, 52, 0, 0, 52, 51, 0, 0, 0, 47, 0, 0, 0, 49, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0
	];
	
	const music = {
	  title: "Happy Birthday",
	  notes: keyNumbers,
	  intervalTime: 7
	};
	
	module.exports = music;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const keyNumbers = [
	  [52, 28], [35], [52, 44], [40], [59, 32], [35], [59, 44, 47], [52], [61, 33], [37], [61, 45, 49], [52], [59, 32], [35], [44, 47], 0, [57, 42], [54], [57, 54], [47], [56, 52], [47], [56, 52, 49], [44], [54, 45], [42], [54, 47], [51, 45], [52, 44], [47], [52], [54], [59, 40], [47], [59, 52], [44], [57, 40], [49], [57, 51], [52], [56, 40], [47], [56, 52], [49], [54, 51, 54], [51], [54, 49], [47], [59, 40], [52], [59, 54], [56], [57, 52], [49], [57, 52], [45], [56, 52], [42], [56, 52], [49], [54, 47], [35], [35, 30], [39, 27], [52, 28], [35], [52, 44], [40], [59, 32], [35], [59, 44, 47], [52], [61, 33], [37], [61, 45, 49], [52], [59, 32], [35], [44, 47], 0, [57, 30], [37], [57, 54, 45], [37], [56, 52, 34], [42], [56, 52, 49], [42], [54, 42, 35], [39], [54, 42, 39], [51], [52, 40, 44], 0, 0, 0, [64, 52], [59], [64, 56], [68, 59], [71, 52], [68, 59], [71, 56], [59], [73, 52], [69, 61], [73, 57], [76, 61], [71, 52], [68, 59], [64, 56], [68, 59], [69, 52], [59], [69, 54], [71, 59], [68, 52], [59], [68, 56], [69, 59], [66, 51], [59], [66, 54], [68, 59], [64, 52], [64], [59, 56], [59, 54], [71, 52], [59], [71, 56], [68, 59], [69, 52], [57], [69, 54], [66, 57], [68, 52], [59], [68, 56], [64, 59], [66, 47], [59, 51], [64, 54], [66, 59], [71, 52], [59], [71, 56], [68, 59], [69, 52], [54], [69, 57], [66, 54], [68, 52], [59], [68, 56], [64, 59], [66, 51], [47], [59, 54], [63, 51], [64, 28], [35], [64, 44], [68, 35], [71, 32], [68, 35], [71, 44, 47], [35], [73, 33], [69, 37], [73, 42, 45], [76, 37], [71, 32], [68, 35], [64, 44, 47], [68, 35], [69, 30], [37], [69, 42, 45], [71, 37], [68, 34], [42], [68, 46, 49], [69, 42], [66, 35], [39], [66, 42, 45, 47], [68], [64, 40, 44], 0, 0, 0
	]
	
	const music = {
	  title: "Little Star",
	  notes: keyNumbers,
	  intervalTime: 13
	};
	
	module.exports = music;


/***/ },
/* 6 */
/***/ function(module, exports) {

	const keyNumbers = [
	  0, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 47, 52, 56, 47, 52, 56, 40, 42, 49, 54, 57, 49, 54, 57, 40, 42, 49, 54, 57, 49, 54, 57, 39, 42, 47, 54, 57, 47, 54, 57, 39, 42, 47, 54, 57, 47, 54, 57, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 49, 56, 61, 49, 56, 61, 40, 44, 49, 56, 61, 49, 56, 61, 40, 42, 46, 49, 54, 46, 49, 54, 40, 42, 46, 49, 54, 46, 49, 54, 39, 42, 47, 54, 59, 47, 54, 59, 39, 42, 47, 54, 59, 47, 54, 59, 39, 40, 44, 47, 52, 44, 47, 52, 39, 40, 44, 47, 52, 44, 47, 52, 37, 40, 44, 47, 52, 44, 47, 52, 37, 40, 44, 47, 52, 44, 47, 52, 30, 37, 42, 46, 52, 42, 46, 52, 30, 37, 42, 46, 52, 42, 46, 52, 35, 39, 42, 47, 51, 42, 47, 51, 35, 39, 42, 47, 51, 42, 47, 51, 35, 38, 44, 47, 53, 44, 47, 53, 35, 38, 44, 47, 53, 44, 47, 53, 33, 37, 42, 49, 54, 42, 49, 54, 33, 37, 42, 49, 54, 42, 49, 54, 33, 36, 42, 45, 51, 42, 45, 51, 33, 36, 42, 45, 51, 42, 45, 51, 32, 35, 40, 47, 52, 40, 47, 52, 32, 35, 40, 47, 52, 40, 47, 52, 32, 33, 37, 40, 45, 37, 40, 45, 32, 33, 37, 40, 45, 37, 40, 45, 30, 33, 37, 40, 45, 37, 40, 45, 30, 33, 37, 40, 45, 37, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 28, 32, 35, 40, 44, 35, 40, 44, 28, 32, 35, 40, 44, 35, 40, 44, 28, 35, 38, 40, 44, 38, 40, 44, 28, 35, 38, 40, 44, 38, 40, 44, 21, 33, 37, 40, 44, 37, 40, 44, 21, 33, 37, 40, 44, 37, 40, 44, 22, 28, 37, 40, 43, 37, 40, 43, 22, 28, 37, 40, 43, 37, 40, 43, 23, 31, 39, 40, 43, 39, 40, 43, 23, 31, 39, 40, 43, 39, 40, 43, 24, 33, 39, 40, 42, 39, 40, 42, 24, 33, 39, 40, 42, 39, 40, 42, 23, 33, 35, 39, 42, 35, 39, 42, 23, 33, 35, 39, 42, 35, 39, 42, 23, 32, 35, 40, 44, 35, 40, 44, 23, 32, 35, 40, 44, 35, 40, 44, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 31, 37, 40, 46, 37, 40, 46, 23, 31, 37, 40, 46, 37, 40, 46, 23, 32, 35, 40, 47, 35, 40, 47, 23, 32, 35, 40, 47, 35, 40, 47, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 16, 28, 35, 38, 44, 35, 38, 44, 16, 28, 35, 38, 44, 35, 38, 44, 16, 28, 33, 37, 40, 45, 40, 37, 40, 37, 33, 37, 33, 30, 33, 30, 16, 27, 47, 51, 54, 57, 54, 51, 54, 51, 47, 51, 42, 45, 44, 42, 52
	];
	
	const music = {
	  title: "Prelude in C",
	  notes: keyNumbers,
	  intervalTime: 11
	};
	
	module.exports = music;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map