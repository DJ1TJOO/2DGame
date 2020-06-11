class World {
    constructor(gl, game) {
        this.gl = gl;
        this.game = game;
        this.offset = new Point(0, 0);
        this.tileSize = new Point(32, 32);
        this.scale = new Point(4, 4);
        this.size = new Point(10, 10);
        this.tiles = [];
        this.entities = [];
        this.grid = new PF.Grid(this.size.x, this.size.y);
        this.overlayRender = [];

        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                this.setTile(x, y, new Tile(this.gl), false);
            }
        }

        //this.calculateGrid();
    }

    calculateGrid() {
        this.grid = new PF.Grid(this.size.x, this.size.y);
        for (let i = 0; i < this.tiles.length; i++) {
            let x = Math.floor(i % this.size.x);
            let y = Math.floor(i / this.size.x);
            if (this.tiles[i].object)
                this.grid.setWalkableAt(x, y, this.tiles[i].object.canMove);
            else
                this.grid.setWalkableAt(x, y, true);
        }
    }

    render(worldSpaceMatrix) {
        for (let i = 0; i < this.tiles.length; i++) {
            let x = Math.floor(i % this.size.x) * this.tileSize.x * this.scale.x;
            let y = Math.floor(i / this.size.x) * this.tileSize.y * this.scale.y;
            if (this.game.width + this.tileSize.x * this.scale.x > x + this.offset.x && -this.tileSize.x * this.scale.x < x + this.offset.x) {
                if (this.game.height + this.tileSize.y * this.scale.y > y + this.offset.y && -this.tileSize.y * this.scale.y < y + this.offset.y) {
                    this.tiles[i].render(worldSpaceMatrix, this, x, y);
                }
            }
        }

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(worldSpaceMatrix, this);
        }
    }

    tick(delta, game) {
        this.game = game;
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].tick(delta, this);
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].tick(delta, this);
        }
    }

    setTile(x, y, tile, calculateGrid = true) {
        let i = x + this.size.x * y;
        this.tiles[i] = tile;
        //if (calculateGrid)
        //this.calculateGrid();
    }

    getTile(x, y) {
        if (Point.isBetween(this.offset, new Point(this.offset.x + this.size.x * this.tileSize.x * this.scale.x + this.scale.x * 2, this.offset.y + this.size.y * this.tileSize.y * this.scale.y + this.scale.y * 2), new Point(x, y))) {
            //for all tiles
            for (let i = 0; i < this.tiles.length; i++) {
                let x = Math.floor(i % this.size.x) * this.tileSize.x * this.scale.x;
                let y = Math.floor(i / this.size.x) * this.tileSize.y * this.scale.y;
                if (Point.isBetween(new Point(this.offset.x + x, this.offset.y + y), new Point(this.offset.x + x + this.tileSize.x * this.scale.x, this.offset.y + y + this.tileSize.y * this.scale.y), new Point(x, y)))
                    return this.tiles[i];
            }
        }
        return null;
    }

    getTileLocation(x, y) {
        if (Point.isBetween(this.offset, new Point(this.offset.x + this.size.x * this.tileSize.x * this.scale.x + this.scale.x * 2, this.offset.y + this.size.y * this.tileSize.y * this.scale.y + this.scale.y * 2), new Point(x, y))) {
            //for all tiles
            for (let i = 0; i < this.tiles.length; i++) {
                let xTile = Math.floor(i % this.size.x) * this.tileSize.x * this.scale.x;
                let yTile = Math.floor(i / this.size.x) * this.tileSize.y * this.scale.y;
                if (Point.isBetween(new Point(this.offset.x + xTile, this.offset.y + yTile), new Point(this.offset.x + xTile + this.tileSize.x * this.scale.x, this.offset.y + yTile + this.tileSize.y * this.scale.y), new Point(x, y))) {
                    x = Math.floor(i % this.size.x);
                    y = Math.floor(i / this.size.x);
                    return new Point(x, y);
                }
            }
        }
        return new Point(0, 0);
    }

    addEntity(entity) {
        this.entities.push(entity);
    }
    removeEntity(i) {
        this.entities.splice(i, 1);
    }
}

class Entity {
    constructor(gl, x = 0, y = 0, sprite = new Sprite(gl, "/sprites/player.png", vs_main, fs_main, { width: 32, height: 64 })) {
        this.gl = gl;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.inventory = new Inventory(gl, 5, 1);
    }

    tick(delta, world) {
        this.x += this.velX * delta;
        this.y += this.velY * delta;
    }

    render(worldSpaceMatrix, world) {
        let worldSpaceMatrixTranslated = worldSpaceMatrix.transition(world.offset.x, world.offset.y);
        this.sprite.render(new Point(this.x, this.y), new Point(), worldSpaceMatrixTranslated, { scalex: world.scale.x, scaley: world.scale.y });
    }
}

class TileObject {
    constructor(gl, sprite = new Sprite(gl, "/sprites/tree.png", vs_main, fs_main, { width: 32, height: 64 })) {
        this.gl = gl;
        this.sprite = sprite;
        this.canMove = false;
    }

    render(worldSpaceMatrix, world, x, y) {
        let worldSpaceMatrixTranslated = worldSpaceMatrix.transition(world.offset.x, world.offset.y);
        this.sprite.render(new Point(x, y - this.sprite.size.y * world.scale.y + world.tileSize.y * world.scale.y), new Point(), worldSpaceMatrixTranslated, { scalex: world.scale.x, scaley: world.scale.y });
    }

    tick(delta, world) {}
}

class Tile {
    constructor(gl, sprite = new Sprite(gl, "/tiles/grass.png", vs_main, fs_main, { width: 32, height: 32 }), object = null) {
        this.gl = gl;
        this.sprite = sprite;
        this.object = object;
        this.isOver = false;
        this.tileOver = new Sprite(this.gl, "/tiles/tile_overlay.png", vs_main, fs_main, { width: 32, height: 32 });
    }

    render(worldSpaceMatrix, world, x, y) {
        let worldSpaceMatrixTranslated = worldSpaceMatrix.transition(world.offset.x, world.offset.y);
        this.sprite.render(new Point(x, y), new Point(), worldSpaceMatrixTranslated, { scalex: world.scale.x, scaley: world.scale.y });
        if (this.isOver)
            this.tileOver.render(new Point(x, y), new Point(), worldSpaceMatrixTranslated, { scalex: world.scale.x, scaley: world.scale.y });

        if (this.object != null)
            this.object.render(worldSpaceMatrix, world, x, y);

    }

    tick(delta, world) {
        if (this.object != null)
            this.object.tick(delta, world);
    }
}

class Order {
    constructor() {
        this.finished = false;
        this.inited = false;
    }

    init(entity) {
        this.inited = true;
    }

    execute(entity, delta) {}
}