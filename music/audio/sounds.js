const SOUNDS = {};

for (let i = 0; i <= 88; i++) {
  SOUNDS[i] = new Audio(`./music/audio/mp3/${i}.mp3`);
};

export default SOUNDS;
