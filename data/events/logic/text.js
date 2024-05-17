_["print"] = {
    Info: "log data..",
    Args: { text: "" },
    Code: (engine, text) => {
        engine.Room.Log(toString(engine, text));
        return ["null"];
    }
}

_["display"] = {
    Info: "show banner..",
    Args: { player: "player", text: "" },
    Code: (engine, player, text) => {
        let client = Runtime.Clients.Get(player[1]);
        if (client) client.Send("Banner", toString(engine, text));
        return ["null"];
    }
}

_["text"] = {
    Info: "to string..",
    Args: { data: "" },
    Code: (engine, data) => {
        return ["string", toString(engine, data)];
    }
}