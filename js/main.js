const Game = require('./game.js');
const SOUNDS = require('../music/audio/sounds.js');

// musics
const happyBirthday = require('../music/songs/happy_birthday.js');
const LittleStar = require('../music/songs/little_star.js');
const PreludeInC = require('../music/songs/prelude_in_c.js');

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
