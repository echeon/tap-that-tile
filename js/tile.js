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
