const Tile = require('./tile.js');

class Game {
  constructor(canvas, music, sounds) {
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
    this.intervalTime = 6;
    this.interval1 = null;
    this.interval2 = null;

    this.updateIntervalHelper = this.updateIntervalHelper.bind(this);
    this.addRow = this.addRow.bind(this);

    this.generateGame();
  }


  play() {
    this.initScoreBoard();

    this.addClickEventListener();
    this.addKeydownEventListener();

    this.startCountdown();

    window.setTimeout(() => {
      this.interval1 = window.setInterval(this.updateIntervalHelper, this.intervalTime);
      this.inverval2 = window.setInterval(this.addRow, this.intervalTime*30);
    }, 3000);
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
    this.generateGame();
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
        let sound = this.sounds[currentNote].cloneNode();

        row.forEach(tile => tile.handleTap());
        tappedTile.changeColor();
        this.incrementScore();

        // if you tap non-black tile
        if (!tappedTile.isBlack) {
          sound = new Audio('./music/audio/gameover.wav');
          if (tappedTile.coordY > 450) {
            this.moveRemainingTilesToBaseline();
          }

          this.draw();
          this.update();

          this.clearIntervals();

          this.decrementScore();
          this.removeEventListeners();

          window.setTimeout(() => {
            $('#game-end-screen').show();
          }, 1000);
        }

        sound.play();
        this.notesIndex = (this.notesIndex + 1) % this.notes.length;

        break;
      }
    }
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

    window.setTimeout(() => {
      $('#game-end-screen').show();
    }, 1000);

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
