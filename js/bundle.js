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

	'use strict';
	
	var _game = __webpack_require__(1);
	
	var _game2 = _interopRequireDefault(_game);
	
	var _sounds = __webpack_require__(3);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	var _music_library = __webpack_require__(4);
	
	var _music_library2 = _interopRequireDefault(_music_library);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var canvas = document.getElementById('canvas');
	
	var ctx = canvas.getContext('2d');
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
	
	var highScores = {};
	
	_music_library2.default.forEach(function (music) {
	  var list = $('<li><p>' + music.title + '</p><button>play</button></li>');
	  $('#main-screen > .list > ul').append(list);
	
	  highScores[music.title] = 0;
	});
	
	if (localStorage.getItem("tttHighScores") === null) {
	  localStorage.setItem("tttHighScores", JSON.stringify(highScores));
	} else {
	  var scores = JSON.parse(localStorage.getItem("tttHighScores"));
	  var newScores = Object.assign({}, highScores, scores);
	  localStorage.setItem("tttHighScores", JSON.stringify(newScores));
	}
	
	$('#main-screen > .list button').each(function (index, button) {
	  $(button).on('click', function () {
	    var newGame = new _game2.default(canvas, _music_library2.default[index], _sounds2.default);
	
	    $('#game-end-screen i').on('click', function () {
	      $('#game-end-screen').hide();
	      $("#high-score").hide();
	      newGame.reset();
	      $('#main-screen').show();
	    });
	
	    $("#main-screen").hide();
	
	    $("#high-score").show();
	    newGame.reset();
	    newGame.play();
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _tile = __webpack_require__(2);
	
	var _tile2 = _interopRequireDefault(_tile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MINIMUM_INTERVAL = 5;
	var localStorage = window.localStorage;
	
	var Game = function () {
	  function Game(canvas, music, sounds) {
	    _classCallCheck(this, Game);
	
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.highestScore = 0;
	    this.currentScore = 0;
	    this.tiles = [];
	    this.prevIndex = null;
	    this.nextIndex = this.getRandomNumber();
	    this.music = music.notes;
	    this.notes = music.notes.filter(function (note) {
	      return note ? true : false;
	    });
	    this.notesIndex = 0;
	    this.sounds = sounds;
	    this.initIntervalTime = music.intervalTime;
	    this.intervalTime = music.intervalTime;
	    this.whenToSpeedUp = Math.min(50, this.notes.length);
	    this.interval1 = null;
	    this.interval2 = null;
	    this.title = music.title;
	
	    this.updateIntervalHelper = this.updateIntervalHelper.bind(this);
	    this.addRow = this.addRow.bind(this);
	
	    this.getHighScore();
	  }
	
	  _createClass(Game, [{
	    key: 'play',
	    value: function play() {
	      var _this = this;
	
	      this.initScoreBoard();
	      this.generateGame();
	
	      this.addClickEventListener();
	      this.addKeydownEventListener();
	
	      this.startCountdown();
	
	      window.setTimeout(function () {
	        _this.interval1 = window.setInterval(_this.updateIntervalHelper, _this.intervalTime);
	        _this.inverval2 = window.setInterval(_this.addRow, _this.intervalTime * 30);
	      }, 3000);
	    }
	  }, {
	    key: 'increaseSpeed',
	    value: function increaseSpeed() {
	      this.clearIntervals();
	      this.intervalTime -= 2;
	      this.interval1 = window.setInterval(this.updateIntervalHelper, this.intervalTime);
	      this.inverval2 = window.setInterval(this.addRow, this.intervalTime * 30);
	    }
	  }, {
	    key: 'startCountdown',
	    value: function startCountdown() {
	      $('#count-3').show();
	
	      window.setTimeout(function () {
	        $('#count-3').hide();
	        $('#count-2').show();
	      }, 1000);
	
	      window.setTimeout(function () {
	        $('#count-2').hide();
	        $('#count-1').show();
	      }, 2000);
	
	      window.setTimeout(function () {
	        $('#count-1').hide();
	      }, 3000);
	    }
	  }, {
	    key: 'generateGame',
	    value: function generateGame() {
	      var _this2 = this;
	
	      this.game = [];
	      this.gameIndex = 0;
	      this.music.forEach(function (note) {
	        if (note) {
	          var prevNumber = _this2.game[_this2.game.length - 1];
	          var randomNumber = _this2.getRandomNumber();
	          while (randomNumber === prevNumber) {
	            randomNumber = _this2.getRandomNumber();
	          }
	          _this2.game.push(randomNumber);
	        } else {
	          _this2.game.push(null);
	        }
	      });
	    }
	  }, {
	    key: 'updateIntervalHelper',
	    value: function updateIntervalHelper() {
	      if (this.didMissTile()) {
	        this.clearIntervals();
	
	        this.removeEventListeners();
	        this.handleMissingTile();
	      }
	      this.draw();
	      this.update();
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.currentScore = 0;
	      this.tiles = [];
	      this.prevIndex = null;
	      this.nextIndex = this.getRandomNumber();
	      this.notesIndex = 0;
	      this.intervalTime = this.initIntervalTime;
	      this.draw();
	      $('#score-board').hide();
	    }
	  }, {
	    key: 'initScoreBoard',
	    value: function initScoreBoard() {
	      $('#score-board').show();
	      $('#score-board').css('transform', 'translateY(' + $('#canvas')[0].offsetTop + 'px)');
	      this.updateScoreBoard();
	    }
	  }, {
	    key: 'incrementScore',
	    value: function incrementScore() {
	      this.currentScore++;
	      this.updateScoreBoard();
	    }
	  }, {
	    key: 'decrementScore',
	    value: function decrementScore() {
	      this.currentScore--;
	      this.updateScoreBoard();
	    }
	  }, {
	    key: 'updateScoreBoard',
	    value: function updateScoreBoard() {
	      $('#score-board').html(this.currentScore);
	    }
	  }, {
	    key: 'hasBlackTile',
	    value: function hasBlackTile(row) {
	      return row.some(function (tile) {
	        return tile.isBlack;
	      });
	    }
	  }, {
	    key: 'handleTap',
	    value: function handleTap(index) {
	      var _this3 = this;
	
	      for (var i = 0; i < this.tiles.length; i++) {
	        var row = this.tiles[i];
	        var tappedTile = row[index];
	
	        if (!tappedTile.tapped) {
	          var currentNote = this.notes[this.notesIndex];
	
	          var soundGroup = void 0;
	          if (Array.isArray(currentNote)) {
	            if (currentNote.length === 1) {
	              soundGroup = [this.sounds[currentNote].cloneNode()];
	            } else if (currentNote.length > 1) {
	              soundGroup = currentNote.map(function (note) {
	                return _this3.sounds[note].cloneNode();
	              });
	            }
	          } else {
	            soundGroup = [this.sounds[currentNote].cloneNode()];
	          }
	
	          row.forEach(function (tile) {
	            return tile.handleTap();
	          });
	          tappedTile.changeColor();
	          this.incrementScore();
	
	          // if you tap non-black tile
	          if (!tappedTile.isBlack) {
	            soundGroup = [new Audio('./music/audio/gameover.wav')];
	
	            if (tappedTile.coordY > 450) {
	              this.moveRemainingTilesToBaseline();
	            }
	
	            this.handleTapWrongTile();
	          }
	
	          soundGroup.forEach(function (sound) {
	            return sound.play();
	          });
	          this.notesIndex = (this.notesIndex + 1) % this.notes.length;
	
	          break;
	        }
	      }
	    }
	  }, {
	    key: 'handleTapWrongTile',
	    value: function handleTapWrongTile() {
	      this.draw();
	      this.update();
	
	      this.clearIntervals();
	
	      this.decrementScore();
	      this.removeEventListeners();
	
	      this.showOptionsAfterGameOver();
	
	      this.saveScore();
	    }
	  }, {
	    key: 'getHighScore',
	    value: function getHighScore() {
	      var savedScores = JSON.parse(localStorage.getItem("tttHighScores"));
	      $('#high-score span').html(savedScores[this.title]);
	    }
	  }, {
	    key: 'saveScore',
	    value: function saveScore() {
	      var savedScores = JSON.parse(localStorage.getItem("tttHighScores"));
	      var currHighScore = savedScores[this.title];
	      if (this.currentScore > currHighScore) {
	        var newHighScore = _defineProperty({}, this.title, this.currentScore);
	        var newScores = Object.assign({}, savedScores, newHighScore);
	        localStorage.setItem("tttHighScores", JSON.stringify(newScores));
	        $('#high-score span').html(this.currentScore);
	      }
	    }
	  }, {
	    key: 'showOptionsAfterGameOver',
	    value: function showOptionsAfterGameOver() {
	      var _this4 = this;
	
	      window.setTimeout(function () {
	        $('#game-end-screen').show();
	        $(window).on('keydown', function (e) {
	          if (e.keyCode === 0 || e.keyCode === 32) {
	            $(window).off('keydown');
	            $('#game-end-screen').hide();
	            _this4.reset();
	            _this4.play();
	          }
	        });
	      }, 1000);
	    }
	  }, {
	    key: 'clearIntervals',
	    value: function clearIntervals() {
	      window.clearInterval(this.interval1);
	      window.clearInterval(this.inverval2);
	    }
	  }, {
	    key: 'addClickEventListener',
	    value: function addClickEventListener() {
	      var _this5 = this;
	
	      $('#canvas').on('click', function (e) {
	        var positionX = e.offsetX;
	
	        if (positionX >= 0 && positionX < 100) {
	          _this5.handleTap(0);
	        } else if (positionX >= 101 && positionX < 201) {
	          _this5.handleTap(1);
	        } else if (positionX >= 202 && positionX < 302) {
	          _this5.handleTap(2);
	        } else {
	          _this5.handleTap(3);
	        }
	      });
	    }
	  }, {
	    key: 'addKeydownEventListener',
	    value: function addKeydownEventListener() {
	      var _this6 = this;
	
	      $(window).on('keydown', function (e) {
	        if (e.keyCode === 70) {
	          _this6.handleTap(0);
	        } else if (e.keyCode === 71) {
	          _this6.handleTap(1);
	        } else if (e.keyCode === 72) {
	          _this6.handleTap(2);
	        } else if (e.keyCode === 74) {
	          _this6.handleTap(3);
	        }
	      });
	    }
	  }, {
	    key: 'removeEventListeners',
	    value: function removeEventListeners() {
	      $('#canvas').off('click');
	      $(window).off('keydown');
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      this.tiles.forEach(function (row) {
	        row.forEach(function (tile) {
	          tile.update();
	        });
	      });
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	      this.drawDividers();
	      this.tiles.forEach(function (row) {
	        row.forEach(function (tile) {
	          tile.draw();
	        });
	      });
	    }
	  }, {
	    key: 'drawDividers',
	    value: function drawDividers() {
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
	  }, {
	    key: 'getRandomNumber',
	    value: function getRandomNumber() {
	      return Math.floor(Math.random() * 4);
	    }
	  }, {
	    key: 'generateRow',
	    value: function generateRow() {
	      var nextRow = [];
	      for (var i = 0; i < 4; i++) {
	        if (i === this.game[this.gameIndex]) {
	          nextRow.push(new _tile2.default(this.canvas, true, i));
	        } else {
	          nextRow.push(new _tile2.default(this.canvas, false, i));
	        }
	      }
	
	      if (!this.hasBlackTile(nextRow)) {
	        nextRow.forEach(function (tile) {
	          return tile.handleTap();
	        });
	      }
	
	      this.gameIndex++;
	
	      return nextRow;
	    }
	  }, {
	    key: 'addRow',
	    value: function addRow() {
	      if (this.gameIndex > this.game.length) {
	        this.generateGame();
	      }
	      var newRow = this.generateRow();
	      this.tiles.push(newRow);
	      if (this.tiles.length >= 7) {
	        this.tiles.shift();
	      }
	      if (this.currentScore && this.currentScore % this.whenToSpeedUp === 0) {
	        if (this.intervalTime > MINIMUM_INTERVAL) {
	          this.increaseSpeed();
	          $('#warning').show();
	          $('#warning').fadeTo(3000, 0, function () {
	            $('#warning').hide();
	            $('#warning').css('opacity', 1);
	          });
	        }
	      }
	    }
	  }, {
	    key: 'didMissTile',
	    value: function didMissTile() {
	      for (var i = 0; i < this.tiles.length; i++) {
	        var nextUntappedTile = this.tiles[i][0];
	        if (!nextUntappedTile.tapped && nextUntappedTile.coordY >= this.canvas.height) {
	          return true;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'handleMissingTile',
	    value: function handleMissingTile() {
	      var sound = new Audio('./music/audio/gameover.wav');
	      sound.play();
	
	      this.clearIntervals();
	      this.changeMissedTileColor();
	      this.moveRemainingTilesToBaseline();
	
	      this.showOptionsAfterGameOver();
	
	      this.saveScore();
	    }
	  }, {
	    key: 'changeMissedTileColor',
	    value: function changeMissedTileColor() {
	      this.tiles[0].forEach(function (tile) {
	        if (tile.isBlack) {
	          tile.changeColorToRed();
	        }
	      });
	    }
	  }, {
	    key: 'moveRemainingTilesToBaseline',
	    value: function moveRemainingTilesToBaseline() {
	      var bottomTile = this.tiles[0][0];
	      var tileOffsetY = bottomTile.coordY - 450;
	
	      this.tiles.forEach(function (row) {
	        row.forEach(function (tile) {
	          tile.moveUp(tileOffsetY);
	        });
	      });
	    }
	  }]);
	
	  return Game;
	}();
	
	exports.default = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tile = function () {
	  function Tile(canvas, isBlack, lineNumber) {
	    _classCallCheck(this, Tile);
	
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.tapped = false;
	    this.isBlack = isBlack;
	    this.color = isBlack ? "#000" : "transparent";
	    this.coordX = 101 * lineNumber;
	    this.coordY = -150;
	  }
	
	  _createClass(Tile, [{
	    key: "draw",
	    value: function draw() {
	      var tileWidth = 100;
	      var tileHeight = 150;
	
	      this.ctx.fillStyle = this.color;
	      this.ctx.fillRect(this.coordX, this.coordY, tileWidth, tileHeight);
	    }
	  }, {
	    key: "update",
	    value: function update() {
	      this.coordY += 5;
	    }
	  }, {
	    key: "handleTap",
	    value: function handleTap() {
	      this.tapped = true;
	    }
	  }, {
	    key: "changeColor",
	    value: function changeColor() {
	      var tappedBlack = "rgba(0, 0, 0, 0.1)";
	      var tappedWrong = "rgba(255, 50, 50, 1)";
	      this.color = this.color === "#000" ? tappedBlack : tappedWrong;
	    }
	  }, {
	    key: "changeColorToRed",
	    value: function changeColorToRed() {
	      this.color = "rgb(255, 50, 50)";
	    }
	  }, {
	    key: "moveUp",
	    value: function moveUp(offsetY) {
	      this.coordY -= offsetY;
	    }
	  }]);
	
	  return Tile;
	}();
	
	exports.default = Tile;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SOUNDS = {};
	
	for (var i = 0; i <= 88; i++) {
	  SOUNDS[i] = new Audio("./music/audio/mp3/" + i + ".mp3");
	};
	
	exports.default = SOUNDS;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _happy_birthday = __webpack_require__(5);
	
	var _happy_birthday2 = _interopRequireDefault(_happy_birthday);
	
	var _little_star = __webpack_require__(6);
	
	var _little_star2 = _interopRequireDefault(_little_star);
	
	var _prelude_in_c = __webpack_require__(7);
	
	var _prelude_in_c2 = _interopRequireDefault(_prelude_in_c);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var musicLibrary = [_happy_birthday2.default, _little_star2.default, _prelude_in_c2.default];
	
	exports.default = musicLibrary;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var keyNumbers = [0, 42, 0, 0, 42, 44, 0, 0, 0, 42, 0, 0, 0, 47, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 42, 44, 0, 0, 0, 42, 0, 0, 0, 49, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 42, 54, 0, 0, 0, 51, 0, 0, 0, 47, 0, 0, 0, 46, 0, 0, 0, 44, 0, 0, 0, 52, 0, 0, 52, 51, 0, 0, 0, 47, 0, 0, 0, 49, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0];
	
	var music = {
	  title: "Happy Birthday",
	  notes: keyNumbers,
	  intervalTime: 7
	};
	
	exports.default = music;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var keyNumbers = [[52, 28], [35], [52, 44], [40], [59, 32], [35], [59, 44, 47], [52], [61, 33], [37], [61, 45, 49], [52], [59, 32], [35], [44, 47], 0, [57, 42], [54], [57, 54], [47], [56, 52], [47], [56, 52, 49], [44], [54, 45], [42], [54, 47], [51, 45], [52, 44], [47], [52], [54], [59, 40], [47], [59, 52], [44], [57, 40], [49], [57, 51], [52], [56, 40], [47], [56, 52], [49], [54, 51, 54], [51], [54, 49], [47], [59, 40], [52], [59, 54], [56], [57, 52], [49], [57, 52], [45], [56, 52], [42], [56, 52], [49], [54, 47], [35], [35, 30], [39, 27], [52, 28], [35], [52, 44], [40], [59, 32], [35], [59, 44, 47], [52], [61, 33], [37], [61, 45, 49], [52], [59, 32], [35], [44, 47], 0, [57, 30], [37], [57, 54, 45], [37], [56, 52, 34], [42], [56, 52, 49], [42], [54, 42, 35], [39], [54, 42, 39], [51], [52, 40, 44], 0, 0, 0, [64, 52], [59], [64, 56], [68, 59], [71, 52], [68, 59], [71, 56], [59], [73, 52], [69, 61], [73, 57], [76, 61], [71, 52], [68, 59], [64, 56], [68, 59], [69, 52], [59], [69, 54], [71, 59], [68, 52], [59], [68, 56], [69, 59], [66, 51], [59], [66, 54], [68, 59], [64, 52], [64], [59, 56], [59, 54], [71, 52], [59], [71, 56], [68, 59], [69, 52], [57], [69, 54], [66, 57], [68, 52], [59], [68, 56], [64, 59], [66, 47], [59, 51], [64, 54], [66, 59], [71, 52], [59], [71, 56], [68, 59], [69, 52], [54], [69, 57], [66, 54], [68, 52], [59], [68, 56], [64, 59], [66, 51], [47], [59, 54], [63, 51], [64, 28], [35], [64, 44], [68, 35], [71, 32], [68, 35], [71, 44, 47], [35], [73, 33], [69, 37], [73, 42, 45], [76, 37], [71, 32], [68, 35], [64, 44, 47], [68, 35], [69, 30], [37], [69, 42, 45], [71, 37], [68, 34], [42], [68, 46, 49], [69, 42], [66, 35], [39], [66, 42, 45, 47], [68], [64, 40, 44], 0, 0, 0];
	
	var music = {
	  title: "Little Star",
	  notes: keyNumbers,
	  intervalTime: 11
	};
	
	exports.default = music;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var keyNumbers = [0, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 47, 52, 56, 47, 52, 56, 40, 42, 49, 54, 57, 49, 54, 57, 40, 42, 49, 54, 57, 49, 54, 57, 39, 42, 47, 54, 57, 47, 54, 57, 39, 42, 47, 54, 57, 47, 54, 57, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 47, 52, 56, 47, 52, 56, 40, 44, 49, 56, 61, 49, 56, 61, 40, 44, 49, 56, 61, 49, 56, 61, 40, 42, 46, 49, 54, 46, 49, 54, 40, 42, 46, 49, 54, 46, 49, 54, 39, 42, 47, 54, 59, 47, 54, 59, 39, 42, 47, 54, 59, 47, 54, 59, 39, 40, 44, 47, 52, 44, 47, 52, 39, 40, 44, 47, 52, 44, 47, 52, 37, 40, 44, 47, 52, 44, 47, 52, 37, 40, 44, 47, 52, 44, 47, 52, 30, 37, 42, 46, 52, 42, 46, 52, 30, 37, 42, 46, 52, 42, 46, 52, 35, 39, 42, 47, 51, 42, 47, 51, 35, 39, 42, 47, 51, 42, 47, 51, 35, 38, 44, 47, 53, 44, 47, 53, 35, 38, 44, 47, 53, 44, 47, 53, 33, 37, 42, 49, 54, 42, 49, 54, 33, 37, 42, 49, 54, 42, 49, 54, 33, 36, 42, 45, 51, 42, 45, 51, 33, 36, 42, 45, 51, 42, 45, 51, 32, 35, 40, 47, 52, 40, 47, 52, 32, 35, 40, 47, 52, 40, 47, 52, 32, 33, 37, 40, 45, 37, 40, 45, 32, 33, 37, 40, 45, 37, 40, 45, 30, 33, 37, 40, 45, 37, 40, 45, 30, 33, 37, 40, 45, 37, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 28, 32, 35, 40, 44, 35, 40, 44, 28, 32, 35, 40, 44, 35, 40, 44, 28, 35, 38, 40, 44, 38, 40, 44, 28, 35, 38, 40, 44, 38, 40, 44, 21, 33, 37, 40, 44, 37, 40, 44, 21, 33, 37, 40, 44, 37, 40, 44, 22, 28, 37, 40, 43, 37, 40, 43, 22, 28, 37, 40, 43, 37, 40, 43, 23, 31, 39, 40, 43, 39, 40, 43, 23, 31, 39, 40, 43, 39, 40, 43, 24, 33, 39, 40, 42, 39, 40, 42, 24, 33, 39, 40, 42, 39, 40, 42, 23, 33, 35, 39, 42, 35, 39, 42, 23, 33, 35, 39, 42, 35, 39, 42, 23, 32, 35, 40, 44, 35, 40, 44, 23, 32, 35, 40, 44, 35, 40, 44, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 31, 37, 40, 46, 37, 40, 46, 23, 31, 37, 40, 46, 37, 40, 46, 23, 32, 35, 40, 47, 35, 40, 47, 23, 32, 35, 40, 47, 35, 40, 47, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 40, 45, 35, 40, 45, 23, 30, 35, 39, 45, 35, 39, 45, 23, 30, 35, 39, 45, 35, 39, 45, 16, 28, 35, 38, 44, 35, 38, 44, 16, 28, 35, 38, 44, 35, 38, 44, 16, 28, 33, 37, 40, 45, 40, 37, 40, 37, 33, 37, 33, 30, 33, 30, 16, 27, 47, 51, 54, 57, 54, 51, 54, 51, 47, 51, 42, 45, 44, 42, 52];
	
	var music = {
	  title: "Prelude in C",
	  notes: keyNumbers,
	  intervalTime: 11
	};
	
	exports.default = music;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map