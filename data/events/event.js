_["tick"] = {
    Info: `do ${Config.Ticks} times a second`,
    Args: { delta: "number" }
}

_["join"] = {
    Info: "when player joins",
    Args: { player: "player" }
}

_["leave"] = {
    Info: "when player leaves",
    Args: { player: "player" }
}

_["click"] = {
    Info: "when table is clicked",
    Args: { player: "player", position: "point" }
}

_["drag"] = {
    Info: "when item is dragged",
    Args: { player: "player", item: "item", position: "point" }
}

_["press"] = {
    Info: "when key is pressed",
    Args: { player: "player", key: "string" }
}