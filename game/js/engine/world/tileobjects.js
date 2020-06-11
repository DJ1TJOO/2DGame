class TileObjectTree extends TileObject {
    constructor(gl) {
        super(gl, new Sprite(gl, "/sprites/tree.png", vs_main, fs_main, { width: 32, height: 32 }));
    }
}

class TileObjectCityHouse extends TileObject {
    constructor(gl) {
        super(gl, new Sprite(gl, "/sprites/house.png", vs_main, fs_main, { width: 32, height: 32 }));
        this.citizens = [];
        this.inventory = new Inventory(gl, 5, 7);
    }

    addCitizen(entity) {
        if (this.citizens.indexOf(entity) > 0) {
            return false;
        }

        this.citizens.push(entity);
        return true;
    }

    removeCitizen(entity) {
        if (this.citizens.indexOf(entity) < 0) {
            return false;
        }
        this.citizens.splice(this.citizens.indexOf(entity), 1);
        return true;
    }

    render(worldSpaceMatrix, world, x, y) {
        super.render(worldSpaceMatrix, world, x, y);
        let self = this;
        world.overlayRender.push(worldSpaceMatrix => {
            self.inventory.render(worldSpaceMatrix, world);
        });
    }
}