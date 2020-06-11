window.onload = () => {
    window.game = new Game(window.innerWidth, window.innerHeight);
    loop();
};

window.onresize = () => {
    window.game.resize(window.innerWidth, window.innerHeight);
};

let lastUpdate = Date.now();
let loop = () => {
    var now = Date.now();
    var delta = now - lastUpdate;
    lastUpdate = now;

    window.game.update(delta);
    requestAnimationFrame(loop);
};

window.onkeydown = e => {
    window.game.onKeyDown(e);
}

window.onkeyup = e => {
    window.game.onKeyUp(e);
}

window.onmousemove = e => {
    window.game.onMouseMove(e);
}

window.onmouseup = e => {
    window.game.onMouseUp(e);
}

window.onmousedown = e => {
    window.game.onMouseDown(e);
}

class Game {
    constructor(innerWidth, innerHeight) {
        //setup
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = 800;
        this.canvasElement.height = 600;
        this.gl = this.canvasElement.getContext('webgl2');
        this.gl.clearColor(0.4, 0.6, 1.0, 0.0);
        document.body.appendChild(this.canvasElement);

        this.worldSpaceMatrix = new M3x3();

        //load all item sprites
        Item.loadSprites(this.gl);

        //game height
        this.height = 600;
        this.width = 0;
        this.resize(innerWidth, innerHeight);

        //create buffers
        this.backBuffer = new BackBuffer(this.gl, { width: Math.floor(this.height * 2.39), height: this.height });
        this.guiBuffer = new BackBuffer(this.gl, { width: Math.floor(this.height * 2.39), height: this.height });

        //create world
        this.world = new World(this.gl, this);
        this.world.setTile(0, 0, new TileGrass(this.gl, new TileObjectTree(this.gl)));
        this.world.setTile(1, 2, new TileGrass(this.gl, new TileObjectTree(this.gl)));
        this.world.setTile(3, 5, new TileGrass(this.gl, new TileObjectCityHouse(this.gl)));

        //add entities
        this.player = new EntityPlayer(this.gl, 0, 0);
        this.world.addEntity(this.player);

        //key and mouse events
        this.keyDown = [];
        this.mouseDown = [];

        //camera speed
        this.worldMoveSpeed = 0.2;
    }

    resize(x, y) {
        //new width and height
        this.canvasElement.width = x;
        this.canvasElement.height = y;

        //new scale
        this.width = x / (y / this.height);
        this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2 / this.width, -2 / this.height);
    }

    setBuffer(buffer) {
        let gl = this.gl;
        if (buffer instanceof BackBuffer) {
            this.gl.viewport(0, 0, buffer.size.x, buffer.size.y);
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer.fbuffer);
            gl.clear(gl.COLOR_BUFFER_BIT);
        } else {
            this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }

    onMouseDown(e) {
        this.mouseDown[e.keyCode] = true;
    }

    onMouseUp(e) {
        if (this.mouseDown[e.keyCode])
            this.onMouseClick(e);

        this.mouseDown[e.keyCode] = false;
    }

    onMouseClick(e) {
        let position = new Point(e.clientX / (this.canvasElement.width / this.width), e.clientY / (this.canvasElement.height / this.height));
        if (Point.isBetween(this.world.offset, new Point(this.world.offset.x + this.world.size.x * this.world.tileSize.x * this.world.scale.x, this.world.offset.y + this.world.size.y * this.world.tileSize.y * this.world.scale.y), position)) {
            //get tile over
            let tile = this.world.tiles.filter(tile => tile.isOver)[0];
            tile.index = this.world.tiles.indexOf(tile);
            let x = Math.floor(tile.index % this.world.size.x);
            let y = Math.floor(tile.index / this.world.size.x);
            switch (true) {
                case tile.object instanceof TileObjectTree:
                    this.player.chop(x, y, tile);
                    break;
                default:
                    //let playerPosition = this.world.getTileLocation(this.player.x + this.world.offset.x, this.player.y + this.world.offset.y);
                    //this.player.walk(playerPosition.x, playerPosition.y, x, y, 0.1);
                    this.player.teleport(tile, x, y, 2);
                    break;
            }
        }
    }

    onMouseMove(e) {
        let position = new Point(e.clientX / (this.canvasElement.width / this.width), e.clientY / (this.canvasElement.height / this.height));

        //is in world
        if (Point.isBetween(this.world.offset, new Point(this.world.offset.x + this.world.size.x * this.world.tileSize.x * this.world.scale.x, this.world.offset.y + this.world.size.y * this.world.tileSize.y * this.world.scale.y), position)) {
            //for all tiles
            for (let i = 0; i < this.world.tiles.length; i++) {
                let x = Math.floor(i % this.world.size.x) * this.world.tileSize.x * this.world.scale.x;
                let y = Math.floor(i / this.world.size.x) * this.world.tileSize.y * this.world.scale.y;
                if (Point.isBetween(new Point(this.world.offset.x + x, this.world.offset.y + y), new Point(this.world.offset.x + x + this.world.tileSize.x * this.world.scale.x, this.world.offset.y + y + this.world.tileSize.y * this.world.scale.y), position))
                    this.world.tiles[i].isOver = true;
                else
                    this.world.tiles[i].isOver = false;
            }
        } else {
            //for all tiles
            this.world.tiles.forEach(tile => tile.isOver = false);
        }
    }

    onKeyDown(e) {
        this.keyDown[e.keyCode] = true;
    }

    onKeyUp(e) {
        this.keyDown[e.keyCode] = false;
    }

    update(delta) {
        this.tick(delta);
        this.render();
    }

    tick(delta) {
        if (this.keyDown[65]) {
            this.world.offset.x += this.worldMoveSpeed * delta;
        }
        if (this.keyDown[68]) {
            this.world.offset.x += -this.worldMoveSpeed * delta;
        }
        if (this.keyDown[87]) {
            this.world.offset.y += this.worldMoveSpeed * delta;
        }
        if (this.keyDown[83]) {
            this.world.offset.y += -this.worldMoveSpeed * delta;
        }
        this.world.offset.x = this.world.offset.x.clamp(-(this.world.size.x * this.world.tileSize.x * this.world.scale.x - this.width), 0);
        this.world.offset.y = this.world.offset.y.clamp(-(this.world.size.y * this.world.tileSize.y * this.world.scale.y - this.height), 0);
        this.world.tick(delta, this);
    }

    render() {
        this.setBuffer();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.setBuffer(this.backBuffer);
        this.world.render(this.worldSpaceMatrix);

        this.setBuffer(this.guiBuffer);
        this.world.overlayRender.forEach(render => render(this.worldSpaceMatrix));

        this.setBuffer();
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.backBuffer.render();
        this.guiBuffer.render();

        this.gl.flush();
    }
}