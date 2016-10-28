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
