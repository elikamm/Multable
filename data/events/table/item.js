_["items"] = {
    Info: "all items",
    Args: {},
    Code: (engine) => {
        let items = engine.Room.Table.Items;
        return [
            "array",
            ...items.map(item => {
                return ["item", item.ID];
            })
        ];
    }
}

_["add"] = {
    Info: "make item..",
    Args: { type: "type" },
    Code: (engine, type) => {
        let item = engine.Room.Add(type[1]);
        engine.Room.Update(item);
        return ["item", item.ID];
    }
}

_["remove"] = {
    Info: "remove item..",
    Args: { item: "item" },
    Code: (engine, item) => {
        engine.Room.Remove(item[1]);
        return ["null"];
    }
}

_["turn"] = {
    Info: "turn card..",
    Args: { item: "item", side: "side" },
    Code: (engine, data, side) => {
        let item = engine.Room.Get(data[1]), type;
        switch (side[1]) {
            case "front": type = item.Origin; break;
            case "back": type = "card/back"; break;
        }
        if (item && isCard(item.Origin)) {
            engine.Room.Cast("Change", [item.ID, type], 2)
            item.Type = type;
        }
        return data;
    }
}

_["turnFor"] = {
    Info: "turn card for..",
    Args: { player: "player", item: "item", side: "side" },
    Code: (engine, player, data, side) => {
        let client = Runtime.Clients.Get(player[1]),
            item = engine.Room.Get(data[1]), type;
        switch (side[1]) {
            case "front": type = item.Origin; break;
            case "back": type = "card/back"; break;
        }
        if (client && item && isCard(item.Origin)) {
            client.Send("Change", [item.ID, type]);
        }
        return data;
    }
}

_["move"] = {
    Info: "move item..",
    Args: { item: "item", position: "point/item" },
    Code: (engine, data, position) => {
        let point = toPoint(engine, position),
            item = engine.Room.Get(data[1]);
        if (item) {
            item.Position = [
                Math.max(0, Math.min(100, point[0])),
                Math.max(0, Math.min(100, point[1]))
            ];
            engine.Room.Update(item);
        }
        return data;
    }
}

_["spin"] = {
    Info: "spin item..",
    Args: { item: "item", degree: "number" },
    Code: (engine, data, degree) => {
        let item = engine.Room.Get(data[1]);
        if (item) {
            item.Rotation = Number(degree[1]);
            engine.Room.Update(item);
        }
        return data;
    }
}