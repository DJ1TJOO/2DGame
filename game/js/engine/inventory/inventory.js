class Inventory {
    constructor(gl, sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.items = [];
        this.stackSize = 8;
        this.gl = gl;

        this.inventoryOverlay = new Sprite(gl, '/items/inventory_overlay.png', vs_main, fs_main, { width: 32, height: 32 });
        this.inventorySlot = new Sprite(gl, '/items/inventory_slot.png', vs_main, fs_main, { width: 32, height: 32 });

        this.scale = 3;
        this.slotSize = 16 * this.scale;
        this.slotScale = this.slotSize / 32;
        this.gapSize = 8 * this.scale;

        this.width = (this.sizeX * this.slotSize + (this.sizeX + 1) * this.gapSize);
        this.height = (this.sizeY * this.slotSize + (this.sizeY + 1) * this.gapSize);
        this.widthScale = this.width / 32;
        this.heightScale = this.height / 32;
    }

    addItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (item.type === this.items[i].type) {
                if (this.items[i].amount + item.amount > this.stackSize) {
                    this.items[i].amount += (this.stackSize - this.items[i].amount);
                    return item.amount - (this.stackSize - this.items[i].amount);
                } else {
                    this.items[i].amount += item.amount;
                    return 0;
                }
            }
        }

        if (this.items.length < this.sizeX * this.sizeY) {
            if (item.amount > this.stackSize) {
                this.items.push(new Item(item.type, this.stackSize));
                return item.amount - this.stackSize;
            } else {
                this.items.push(item);
                return 0;
            }
        }

        return item.amount;
    }

    removeItem(item) {
        let returnAmount = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (item.type === this.items[i].type) {
                if (item.amount > this.items[i].amount) {
                    returnAmount = item.amount - this.items[i].amount;
                } else {
                    this.items[i].amount -= item.amount;
                    returnAmount = 0;
                }
            }
        }

        //remove empty items
        this.items = this.items.filter(item => item.amount !== 0);

        if (returnAmount === -1)
            returnAmount = item.amount;

        return returnAmount;
    }

    render(worldSpaceMatrix, world) {
        let x = (world.game.width / 2) - (this.width / 2);
        let y = (world.game.height / 2) - (this.height / 2);
        this.inventoryOverlay.render(new Point(x, y), new Point(), worldSpaceMatrix, { scalex: this.widthScale, scaley: this.heightScale });

        let slot = new Point();
        slot.x = this.gapSize;
        slot.y = this.gapSize;
        for (let slotX = 0; slotX < this.sizeX; slotX++) {
            slot.y = this.gapSize;
            for (let slotY = 0; slotY < this.sizeY; slotY++) {
                this.inventorySlot.render(new Point(x + slot.x, y + slot.y), new Point(), worldSpaceMatrix, { scalex: this.slotScale, scaley: this.slotScale });
                slot.y += this.slotSize + this.gapSize;
            }
            slot.x += this.slotSize + this.gapSize;
        }
        //Item.SPRITES.WOOD.render(new Point(x, y), new Point(), worldSpaceMatrix, { this.scalex: 10, this.scaley: 10 });
    }
}