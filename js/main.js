const Game = require('./game.js');
const Sounds = require('../music/audio/sounds.js');
const music = require('../music/music_1.js');
const music2 = require('../music/music_2.js');

const canvas = document.getElementById('canvas');


const g = new Game(canvas, music2, Sounds);
g.play();
