import Game from './game';
import SOUNDS from '../music/audio/sounds';
import musics from '../music/music_library';

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

const highScores = {};

musics.forEach(music => {
  const list = $(`<li><p>${music.title}</p><button>play</button></li>`);
  $('#main-screen > .list > ul').append(list);

  highScores[music.title] = 0;
});

if (localStorage.getItem("tttHighScores") === null) {
  localStorage.setItem("tttHighScores", JSON.stringify(highScores));
}

$('#main-screen > .list button').each((index, button) => {
  $(button).on('click', () => {
    const newGame = new Game(
      canvas,
      musics[index],
      SOUNDS,
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
