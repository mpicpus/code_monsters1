import { SoundEngine } from '../../sound-engine.js';

// This class imports all needed sounds and exposes simple "play" and "stop" actions.
export class SoundSolarSystem extends SoundEngine {
  constructor(attrs = {}) {
    attrs.soundPairs = [
      "explosion01",
      "explosion02",
      "explosion03",
      "explosion04",
      "explosion05",
      "explosion-muffled01",
      "explosion-muffled02",
      "explosion-short01",
      "explosion-short02",
      "explosion-short03",
      "explosion-short04",
      "explosion-short05",
      "shot01",
      "shot02",
      "shot03",
      "shot04",
      "shot-super01"
    ];

    super(attrs)
  }
}
