export class Grid {
  constructor(
    {
      canvas: {},
      dimensions: {columns: 4, rows: 4}
    } = {}) {

    this.canvas = canvas;
    this.dimensions = dimensions;
    
    this.tiles = generateTiles();
  }

  generateTiles() {
    let tiles = Array(this.dimensions.rows).fill(Array(this.dimensions.columns).fill([]))
    tiles.forEach((row) => {
      row.map((column) => {
        return getTileBoundaries(row, column)
      })
    })
  }

  calculateTileDimensions() {}
}


class Tile {
  constructor() {}
}
