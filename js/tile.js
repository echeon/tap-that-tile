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
