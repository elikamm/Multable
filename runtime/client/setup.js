module.exports.Guide = (client) => {
    let guide = null;
    if (!client.Name) guide = "Name";
    else if (!client.Room) guide = "Room";
    else if (client.Host && !client.Room.Game) guide = "Game";
    else if (client.Host && !client.Room.Setup) guide = "Setup";
    else if (!client.Logged) guide = "Password";

    client.Send("Ask", guide);
}

module.exports.Revive = (client, key) => {
    let register = Runtime.Registers.Get(key);
    if (register) {
        client.Reset();
        client.Name = register.Name;
        client.Host = register.Host;
        client.Logged = register.Logged;
        client.Room = register.Room;

        client.Send("Name", client.Name);
        with (client.Room) {
            client.Send("Room", ID);
            List();
        }
    }
    else client.Send("Bad", "Register");
}

module.exports.SetName = (client, name) => {
    if (/^([A-Za-z0-9]{1,10})$/.test(name) && !client.Active) {
        if (client.Active) client.Room.List();
        client.Name = name;
        client.Send("Name", name);
        Log(`#${client.ID} named '${name}'`);
    }
    else client.Send("Bad", "Name");
}

module.exports.SetRoom = (client, id) => {
    let room = Runtime.Rooms.Get(id);
    if (room) {
        client.Reset();
        client.Room = room;
        if (room.Clients(1).length == 0) {
            client.Host = true;
            client.Logged = true;
        } else {
            client.Logged = (room.Setup && room.Password == "");
        }
        room.List();
        client.Send("Room", room.ID);
        Log(`#${client.ID} joined @${room.ID}`);
    }
    else client.Send("Bad", "Room");
}

module.exports.SetGame = (client, name) => {
    let game = Runtime.Games.Get(name);
    if (!client.Room) {
        let room = Runtime.Rooms.Add();
        client.SetRoom(room.ID);
    }
    if (game.Exist == 1 && client.Host) {
        client.Room.Load(game);
        Runtime.Games.Play(name);
        client.Send("Good", null);
    }
    else client.Send("Bad", "Game");
}

module.exports.SetSetup = (client, password) => {
    if (client.Host) {
        client.Room.Setup = true;
        client.Room.Password = password;
        client.Send("Good", null);
    }
    else client.Send("Bad", "Setup");
}

module.exports.CheckSetup = (client, password) => {
    if (client.Room && client.Room.Password == password) {
        with (client.Room)
            if (Setup && Password == password) {
                client.Logged = true;
                client.Send("Good", null);
            }
    } else client.Send("Bad", "Password");
}

module.exports.Activate = (client) => {
    if (client.Logged && client.Room.Game != null) {
        client.Active = true;
        client.Init();
        client.Send("Good", null);
    }
    else client.Send("Bad", "Activate");
}

module.exports.Reset = (client) => {
    let room = client.Room;
    client.Room = null;
    if (client.Active) {
        room.Engine.Trigger("leave", ["player", client.ID]);
        room.Clients(2).forEach(_ => {
            if (_.ID != client.ID) _.Send("Cursor", [client.ID, null]);
        });
        room.List();
    }
    client.Active = false;
    client.Logged = false;
    client.Host = false;
}