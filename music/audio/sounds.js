const Sounds = {};

for (let i = 0; i <= 88; i++) {
  Sounds[i] = new Audio(`./music/audio/mp3/${i}.mp3`);
};

module.exports = Sounds;
