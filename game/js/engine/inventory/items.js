class Item {
    constructor(type, amount = 0) {
        this.type = type;
        this.amount = amount;
    }

    static loadSprites(gl) {
        Item.SPRITES = {};
        Item.SPRITES.WOOD = new Sprite(gl, 'items/wood.png', vs_main, fs_main, { width: 16, height: 16 });
    }
}

Item.WOOD = 0;