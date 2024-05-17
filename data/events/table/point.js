_["point"] = {
    Info: "create point..",
    Args: { x: "number", y: "number" },
    Code: (engine, x, y) => {
        return ["point", x[1], y[1]];
    }
}

_["x"] = {
    Info: "get x-coord..",
    Args: { position: "point/item" },
    Code: (engine, point) => {
        point = toPoint(engine, point);
        return ["number", String(point[0])];
    }
}

_["y"] = {
    Info: "get y-coord..",
    Args: { position: "point/item" },
    Code: (engine, point) => {
        point = toPoint(engine, point);
        return ["number", String(point[1])];
    }
}

_["dist"] = {
    Info: "get distance..",
    Args: { a: "point/item", b: "point/item" },
    Code: (engine, a, b) => {
        a = toPoint(engine, a); b = toPoint(engine, b);
        return ["number",
            Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
        ]
    }
}