import Tile from './tile';

const MINIMUM_INTERVAL = 5;
const localStorage = window.localStorage;

export default class Game {
  constructor(canvas, music, sounds) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.highestScore = 0;
    this.currentScore = 0;
    this.tiles = [];
    this.prevIndex = null;
    this.nextIndex = this.getRandomNumber();
    this.music = music.notes;
    this.notes = music.notes.filter(note => note ? true : false);
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
    this.intervalTime -= 2;
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
      this.clearIntervals();

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

          this.handleTapWrongTile();
        }

        soundGroup.forEach(sound => sound.play());
        this.notesIndex = (this.notesIndex + 1) % this.notes.length;

        break;
      }
    }
  }

  handleTapWrongTile() {
    this.draw();
    this.update();

    this.clearIntervals();

    this.decrementScore();
    this.removeEventListeners();

    this.showOptionsAfterGameOver();

    this.saveScore();
  }

  getHighScore() {
    const savedScores = JSON.parse(localStorage.getItem("tttHighScores"));
    $('#high-score span').html(savedScores[this.title]);
  }

  saveScore() {
    let savedScores = JSON.parse(localStorage.getItem("tttHighScores"));
    const currHighScore = savedScores[this.title];
    if (this.currentScore > currHighScore) {
      const newHighScore = {[this.title]: this.currentScore};
      const newScores = Object.assign({}, savedScores, newHighScore);
      localStorage.setItem("tttHighScores", JSON.stringify(newScores));
      $('#high-score span').html(this.currentScore);
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
      if (e.keyCode === 70) {
        this.handleTap(0);
      } else if (e.keyCode === 71) {
        this.handleTap(1);
      } else if (e.keyCode === 72) {
        this.handleTap(2);
      } else if (e.keyCode === 74) {
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
      if (this.intervalTime > MINIMUM_INTERVAL) {
        this.increaseSpeed();
        $('#warning').show();
        $('#warning').fadeTo(3000, 0, () => {
          $('#warning').hide();
          $('#warning').css('opacity', 1);
        });
      }
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

    this.clearIntervals();
    this.changeMissedTileColor();
    this.moveRemainingTilesToBaseline();

    this.showOptionsAfterGameOver();

    this.saveScore();
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
