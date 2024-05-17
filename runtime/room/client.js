module.exports.Clients = (room, level = 0) => {
    return Runtime.Clients.Filter(client => 
        client.Room && client.Room.ID == room.ID &&
        (level < 1 || client.Logged) &&
        (level < 2 || client.Active)
    );
}

module.exports.Cast = (room, key, value, level = 0) => {
    room.Clients(level).forEach(client => {
        client.Send(key, value);
    });
}

module.exports.List = (room) => {
    let clients = room.Clients(2).map(client => {
        return [client.ID, client.Name, client.Host];
    });
    room.Cast("Clients", clients);
}

module.exports.Log = (room, message, error = false) => {
    let data = [message, error]
    if (room.Clients(2).length == 0) room.Logs.push(data);
    else {
        room.Cast("Log", data);
    }
}