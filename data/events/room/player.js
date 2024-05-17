_["players"] = {
    Info: "all players",
    Args: {},
    Code: (engine) => {
        let clients = engine.Room.Clients(2);
        return [
            "array",
            ...clients.map(client => {
                return ["player", client.ID];
            })
        ];
    }
}

_["rotate"] = {
    Info: "spin table..",
    Args: { player: "player", degree: "number" },
    Code: (engine, player, degree) => {
        let client = Runtime.Clients.Get(player[1]);
        if (client) client.Send("Rotate", degree[1]);;
        return ["null"];
    }
}