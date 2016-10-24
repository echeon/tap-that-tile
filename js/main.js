const Game = require('./game.js');
const SOUNDS = require('../music/audio/sounds.js');
const music1 = require('../music/happy_birthday.js');
const music2 = require('../music/prelude_in_c.js');

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

const musics = [music1, music2];

musics.forEach(music => {
  const list = $(`<li><p>${music.title}</p><button>play</button></li>`);
  $('#main-screen > .list > ul').append(list);
});

$('#main-screen > .list button').each((index, button) => {
  $(button).on('click', () => {
    const newGame = new Game(canvas, musics[index].notes, SOUNDS);

    $('#game-end-screen i:first-child').on('click', () => {
      $('#game-end-screen').hide();
      newGame.reset();
      newGame.play();
    });

    $('#game-end-screen i:last-child').on('click', () => {
      $('#game-end-screen').hide();
      newGame.reset();
      $('#main-screen').show();
    });

    $("#main-screen").hide();
    newGame.reset();
    newGame.play();
  });
});
