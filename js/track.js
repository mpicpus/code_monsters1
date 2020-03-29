export class Track {
  constructor(type, model, size, image, position, previous, next) {
    this.type = type;
    this.model = model;
    this.image = image || this.loadImage();
    this.position = position || {};
    this.previous = previous || null;
    this.next = next || null;
    this.isLast = true;
    this.size = size;
  }

  name() {
    return `${this.shape}_${this.model.sort().join('-')}`
  }

  loadImage() {
    let image = new Image();
    image.src = `assets/train/tracks/${this.model.join('-')}.png`;
    return image
  }

  attachmentPoint(newTrack) {
    if (Object.keys(this.position).length > 0) {
      let calculator = TrackSet.connectionTable()[this.model[1][0]][newTrack.model[0][0]]
      return {
        x: this.position.x + (this.size * calculator[0]),
        y: this.position.y + (this.size * calculator[1])
      }
    }
  }

  endPoint() {
    
  }

  static fromModel(trackModel, last, position) {
    let trackPosition = last ? last.attachmentPoint(trackModel) : position;
    let newTrack = new Track(trackModel.type, trackModel.model, trackModel.size, trackModel.image, trackPosition, last);

    return newTrack
  }
}

export class TrackPath {
  constructor(tracks) {
    this.tracks = tracks || [];
    this.preview = null;
  }

  add(track, position) {
    let newTrack;

    if (this.preview) {
      newTrack = Track.fromModel(this.preview, this.lastTrack(), position);
      this.preview = null;
    } else if (track) {
      let last = this.lastTrack();
      this.tracks.forEach((t) => t.isLast = false);

      newTrack = Track.fromModel(track, last, position)
    }

    if (newTrack) this.tracks.push(newTrack);
  }

  remove(track) {
    this.tracks = this.tracks.filter(t => t != track)
  }

  lastTrack() {
    return this.tracks.filter((track) => track.isLast)[0];
  }

  setPreview(track, position) {
    if (track == null)
      this.preview = null;
    else
      this.preview = Track.fromModel(track, this.lastTrack(), position);
  }
}

export class TrackSet {
  constructor(size) {
    this.size = size;
    this.tracks = this.getTrackSet();
  }

  getTrackSet() {
    let tracks = [];
    let list = this.trackList();
    
    Object.keys(list).forEach((type) => {
      list[type].forEach((model) => {
        tracks.push(new Track(type, model, this.size))
      })
    })

    return tracks;
  }

  straight() {
    return this.tracks.filter(t => t.type == 'straight')
  }

  curves() {
    return this.tracks.filter(t => t.type == 'curve')
  }

  trackList() {
    return {
      straight: [
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
      ],
      curve: [
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
  }

  connections(track) {
    let endCode = track.model[1];
    let code = this.connectionCodes(endCode);

    let result = [];
    // straight
    result = result.concat(this.straight().filter((track) => {
      track.model.filter((m) => {
        if (this.constructor.connectionTable()[track.model[1][0]][m[0]])
          return code.includes(m) && this.constructor.connectionTable()[track.model[1][0]][m[0]].reduce((i, a = 0) => a * i) == 0;
      }).length > 0
    }));
    // curves
    result = result.concat(this.curves().filter(track => track.model.filter(m => code.includes(m)).length > 0));

    return result;
  }

  connectionCodes(endCode) {
    return Object.keys(this.constructor.connectionTable()[endCode[0]]).map(code => `${code}${endCode[1]}`)
  }

  static connectionTable() {
    return {
      '1': {
        '5': [-0.5, -1],
        '6': [0, -1]
      },
      '2': {
        '5': [0, -1],
        '6': [0.5, -1]
      },
      '3':{
        '7': [1, -0.5],
        '8': [1, 0]
      },
      '4': {
        '7': [1, 0],
        '8': [1, 0.5]
      },
      '5': {
        '1': [0.5, 1],
        '2': [0, 1]
      },
      '6': {
        '1': [0, 1],
        '2': [-0.5, 1]
      },
      '7': {
        '3': [-1, 0.5],
        '4': [-1, 0]
      },
      '8': {
        '3': [-1, 0],
        '4': [-1, -0.5]
      },
    }
  }
}
