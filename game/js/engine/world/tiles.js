class TileGrass extends Tile {
    constructor(gl, object = null) {
        super(gl, new Sprite(gl, "/tiles/grass.png", vs_main, fs_main, { width: 32, height: 32 }), object);
    }
}