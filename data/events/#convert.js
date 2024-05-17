function toPoint(engine, point) {
    if (point[0] == "item") {
        let item = engine.Room.Get(point[1]);
        if (item) return item.Position;
        else return [-1, -1];
    }
    return [Number(point[1]), Number(point[2])];
}

function toString(engine, data) {
    switch(data[0]) {
        case "null":
            return "null";

        case "number": case "string":
        case "key": case "side": case "suit":
            return data[1];

        case "array":
            return data
                .slice(1).map(_ => toString(engine, _)).join(",");

        case "point":
            return `[${data[1]},${data[2]}]`;

        case "item":
            let item = engine.Room.Get(data[1]);
            if (item) return item.Origin;
            else return "";

        case "player":
            let client = Runtime.Clients.Get(data[1]);
            if (client) return client.Name;
            else return "";

        default:
            return "";
    }
}