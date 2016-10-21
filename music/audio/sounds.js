const Sounds = {};

for (let i = 0; i <= 64; i++) {
  Sounds[i] = new Audio(`./music/audio/wav/${i}.wav`);
  // sounds[i] = new Audio(`./music/audio/mp3/${i}.mp3`);
  // console.log(sounds[i]);
};

module.exports = Sounds;
