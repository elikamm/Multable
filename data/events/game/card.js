_["addDeck"] = {
    Info: "make deck..",
    Args: { count: "number", position: "point/item" },
    Code: (engine, count, position) => {
        let cards = getCards(Number(count[1])),
            point = toPoint(engine, position);
            items = [];
        cards.forEach(card => {
            let item = engine.Room.Add(card);
            item.Position = point; item.Type = "card/back";
            engine.Room.Update(item);
            items.push(item);
        });
        items = items.map(_ => ["item", _.ID]);
        return ["array", ...items];
    }
}

_["side"] = {
    Info: "get side..",
    Args: { item: "item" },
    Code: (engine, data) => {
        let item = engine.Room.Get(data[1]);
        if (item && isCard(item.Origin)) {
            return ["side", item.Type == "card/back" ? "back" : "front"];
        }
        else return ["null"];
    }
}

_["suit"] = {
    Info: "get suit..",
    Args: { item: "item" },
    Code: (engine, data) => {
        let item = engine.Room.Get(data[1]);
        if (item && isCard(item.Origin)) {
            let card = item.Origin.split("/");
            return ["suit", card[1]];
        }
        else return ["null"];
    }
}

_["symbol"] = {
    Info: "get symbol..",
    Args: { item: "item" },
    Code: (engine, data) => {
        let item = engine.Room.Get(data[1]);
        if (item && isCard(item.Origin)) {
            let card = item.Origin.split("/"), value = -1,
                symbol = card[card.length == 2 ? 1 : 2];
            return ["number", String(getValue(symbol))];
        }
        else return ["null"];
    }
}