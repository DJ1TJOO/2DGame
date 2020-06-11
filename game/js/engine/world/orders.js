class OrderWalk extends Order {
    constructor(path, speed, world) {
        super();
        this.goTo = new Point();
        this.goToD = new Point();
        this.path = path;
        this.speed = speed * 1;
        this.world = world;
    }

    init(entity) {
        super.init(entity);
        this.walkToTile(entity, this.path[0][0], this.path[0][1], this.speed);
    }

    execute(entity, delta) {
        super.execute(entity);
        let dx = this.goTo.x - entity.x;
        let dy = this.goTo.y - entity.y;
        if ((this.goToD.x > 0 && 0 >= dx) || (this.goToD.x < 0 && 0 <= dx))
            entity.velX = 0;

        if ((this.goToD.y > 0 && 0 >= dy) || (this.goToD.y < 0 && 0 <= dy))
            entity.velY = 0;

        if (this.path.length > 0 && entity.velX == 0 && entity.velY == 0) {
            this.goTo = new Point();
            this.goToD = new Point();
            this.path.shift();
            if (this.path.length > 0)
                this.walkToTile(entity, this.path[0][0], this.path[0][1], this.speed);
            else
                this.finished = true;
        }
    }

    walkToTile(entity, tileX, tileY, speed) {
        let x = tileX * this.world.tileSize.x * this.world.scale.x;
        let y = tileY * this.world.tileSize.y * this.world.scale.y;
        let dx = x - entity.x;
        let dy = y - entity.y;
        if (dx == 0 && dy == 0)
            return;

        let angle = Math.atan2(dy, dx);
        entity.velX = speed * Math.cos(angle);
        entity.velY = speed * Math.sin(angle);

        this.goTo.x = x;
        this.goTo.y = y;
        this.goToD.x = dx;
        this.goToD.y = dy;
    }
}

class OrderChop extends Order {
    constructor(tile, tileX, tileY, world) {
        super();
        this.tile = tile;
        this.tileX = tileX;
        this.tileY = tileY;
        this.world = world;
        this.deltaPast = 0;
    }

    init(entity) {
        super.init(entity);

        let playerTile = this.world.getTileLocation(entity.x + this.world.offset.x + entity.sprite.size.x / 2, entity.y + this.world.offset.y + entity.sprite.size.y / 2);
        if (!Point.isBetween(new Point(this.tileX - 1, this.tileY - 1), new Point(this.tileX + 1, this.tileY + 1), playerTile)) {
            this.finished = true;
        }
    }

    execute(entity, delta) {
        super.execute(entity);
        this.deltaPast += delta;
        //TODO chop tree
        if (this.deltaPast > 5000 /*5 seconds*/ ) {
            this.finished = true;
            entity.inventory.addItem(new Item(Item.WOOD, 1));
            this.tile.object = null;
        }
    }
}

class OrderTeleport extends Order {
    constructor(tile, tileX, tileY, world, range, time) {
        super();
        this.tile = tile;
        this.tileX = tileX;
        this.tileY = tileY;
        this.world = world;
        this.range = range;
        this.time = time;
    }

    init(entity) {
        super.init(entity);
        let playerTile = this.world.getTileLocation(entity.x + this.world.offset.x + entity.sprite.size.x / 2, entity.y + this.world.offset.y + entity.sprite.size.y / 2);
        if (!Point.isBetween(new Point(this.tileX - this.range, this.tileY - this.range), new Point(this.tileX + this.range, this.tileY + this.range), playerTile)) {
            this.finished = true;
        }
        let xDistance = this.tileX - playerTile.x;
        let yDistance = this.tileY - playerTile.y;
        xDistance = -xDistance > 0 ? -xDistance : xDistance;
        yDistance = -yDistance > 0 ? -yDistance : yDistance;
        this.distance = (xDistance + yDistance) / 2;
        this.deltaPast = 0;
    }

    execute(entity, delta) {
        super.execute(entity);
        this.deltaPast += delta;
        //TODO chop tree
        if (this.deltaPast > (this.time / this.range * this.distance) * 1000) {
            entity.velX = 0;
            entity.velY = 0;
            entity.x = this.tileX * this.world.tileSize.x * this.world.scale.x;
            entity.y = this.tileY * this.world.tileSize.y * this.world.scale.y;
            this.finished = true;
        }
    }
}