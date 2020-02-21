export class Track {
  constructor(model, image, position, previous, next) {
    this.model = model;
    this.image = image || this.loadImage();
    this.position = position || {};
    this.previous = previous || null;
    this.next = next || null;
  }

  name() {
    return `${this.shape}_${this.model.join('-')}`
  }

  loadImage() {
    let image = new Image();
    image.src = `assets/train/tracks/${this.model.join('-')}.png`;
    return image
  }
}

export class TrackPath {
  constructor(tracks) {
    this.tracks = tracks || [];
  }

  add(track) {
    this.tracks.push(track)
  }

  remove(track) {
    this.tracks = this.tracks.filter(t => t != track)
  }
}

export class TrackSet {
  constructor() {
    this.tracks = this.getTrackSet();
  }

  getTrackSet() {
    let tracks = [];
    let list = this.trackList();
    
    list.forEach((model) => {
      tracks.push(new Track(model))
    })

    return tracks;
  }

  trackList() {
    return [
      // vertical
      ['1a', '6a'],
      ['1b', '6b'],
      ['2a', '5a'],
      ['2b', '5b'],
      // horizontal
      ['3a', '8a'],
      ['3b', '8b'],
      ['4a', '7a'],
      ['4b', '7b'],
      // Curve
      ['1a', '4b'],
      ['1b', '4a'],
      ['2a', '7a'],
      ['2b', '7b'],
      ['3a', '6a'],
      ['3b', '6b'],
      ['5a', '8b'],
      ['5b', '8a'],
    ]
  }

  connections(track) {
    let endCode = track.model[1];
    let code = this.connectionCodes(endCode);
    return this.tracks.filter(track => track.model.filter(m => code.includes(m)).length > 0);
  }

  connectionCodes(endCode) {
    return this.connectionTable()[endCode[0]].map(code => `${code}${endCode[1]}`)
  }

  connectionTable() {
    return {
      '1': ['6'],
      '2': ['5'],
      '3': ['8'],
      '4': ['7'],
      '5': ['2'],
      '6': ['1'],
      '7': ['4'],
      '8': ['3'],
    }
  }
}
