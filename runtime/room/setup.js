module.exports.Timeout = (_, room) => {
    let found = [];
    with (Runtime) {
        found.push(...Clients.Filter(_ => Check(room, _)));
        found.push(...Registers.List.map(_ => Check(room, _.Data)));
    }
    if (found.length == 0) {
        Runtime.Rooms.Remove(room);
    }
}

function Check(room, data) {
    return data.Room && data.Room.ID == room.ID;
}

module.exports.Load = (room, game) => {
    room.Game = game;
    with (Runtime.Engines) {
        room.Table = { Style: "table", Items: [] }

        if (room.Engine) Remove(room.Engine);
        room.Engine = Add(room);

        room.Clients(2).forEach(client => {
            client.Init();
        });
    }
}