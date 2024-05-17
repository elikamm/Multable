module.exports.Init = (client) => {
    with (client.Room) {
        client.Send("Game", Game.Name);
        client.Send("Style", Table.Style);
        client.Send("Rotate", 0);

        client.Send("Clear", null);
        Table.Items.forEach(item => {
            client.Send("Update", item.Filter());
        });

        client.Room.Clients(2).forEach(_ => {
            if (_.ID != client.ID) client.Send("Cursor", [_.ID, _.Position]);
        });

        if (Logs) {
            Logs.forEach(log => client.Send("Log", log));
            Logs = [];
        }
        
        List();
    }

    client.Room.Engine.Trigger("join", ["player", client.ID]);
}

module.exports.Cursor = (client, cursor) => {
    client.Position = cursor;
    if (client.Active) {
        client.Room.Clients(2).forEach(_ => {
            if (_.ID != client.ID) _.Send("Cursor", [client.ID, client.Position]);
        });
    }
}

module.exports.Press = (client, key) => {
    if (client.Active)
        client.Room.Engine.Trigger("press",
            ["player", client.ID],
            ["key", key]
        );
}

module.exports.Click = (client, position) => {
    if (client.Active)
        with (client.Room) {
            Engine.Trigger("click",
                ["player", client.ID],
                ["point", String(position[0]), String(position[1])]
            );
        }
}

module.exports.Drag = (client, drag) => {
    if (client.Active)
        with (client.Room) {
            let item = Get(drag[0]), position = drag[1];
            Engine.Trigger("drag",
                ["player", client.ID],
                ["item", item.ID],
                ["point", String(position[0]), String(position[1])]
            );
        }
}