class EntityPlayer extends Entity {
    constructor(gl, x = 0, y = 0) {
        super(gl, x, y, new Sprite(gl, "/sprites/player_small.png", vs_main, fs_main, { width: 32, height: 32 }));
        this.world = null;
        this.orders = [];
    }

    walk(currentTileX, currentTileY, tileX, tileY, speed) {
        //WERKT NOG NIET
        var finder = new PF.AStarFinder({
            allowDiagonal: false,
            diagonalMovement: PF.DiagonalMovement.Never
        });
        var path = finder.findPath(currentTileX, currentTileY, tileX, tileY, this.world.grid.clone());

        if (path.length < 1)
            return;

        this.orders.push(new OrderWalk(path, speed, this.world));
    }

    teleport(tile, tileX, tileY, time) {
        this.orders.push(new OrderTeleport(tile, tileX, tileY, this.world, 2, time));
    }

    chop(x, y, tile) {
        this.orders.push(new OrderChop(tile, x, y, this.world));
    }

    tick(delta, world) {
        this.world = world;

        this.x += this.velX * delta;
        this.y += this.velY * delta;

        if (this.orders.length > 0 && !this.orders[0].inited)
            this.orders[0].init(this);

        if (this.orders.length > 0 && !this.orders[0].finished)
            this.orders[0].execute(this, delta);

        if (this.orders.length > 0 && this.orders[0].finished)
            this.orders.shift();

    }
}