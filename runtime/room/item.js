class Item {
    constructor(type) {
        this.ID = require("crypto").randomUUID();
        this.Origin = type;
        this.Type = type;
        this.Position = [50, 50];
        this.Rotation = 0;
    }

    Filter() {
        return { ID: this.ID, Type: this.Type, Position: this.Position, Rotation: this.Rotation };
    }
}

module.exports.Get = (room, id) => {
    let item = room.Table.Items.filter(item => item.ID == id)[0];
    if (item) return item; else return null;
}

module.exports.Add = (room, type) => {
    let item = new Item(type);
    room.Table.Items.push(item);
    return item;
}

module.exports.Update = (room, item) => {
    room.Cast("Update", item.Filter());
}

module.exports.Remove = (room, id) => {
    room.Cast("Remove", id);
    with (room.Table) {
        Items = Items.filter(_ => _.ID != id);
    }
}