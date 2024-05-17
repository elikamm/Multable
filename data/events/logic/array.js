_["array"] = {
    Info: "make array..",
    Args: { "[..]": "" },
    Code: (engine, ...args) => {
        if (args.length == 1 && args[0][0] == "null") args = [];
        return ["array", ...args];
    }
}

_["range"] = {
    Info: "numeric array..",
    Args: { from: "number", to: "number" },
    Code: (engine, from, to) => {
        let a = Math.round(Number(from[1])),
            b = Math.round(Number(to[1])),
            step = (b > a) ? 1 : -1, range = [];

        for (let i = a; i != b + step; i += step) {
            range.push(["number", String(i)]);
        }
        return ["array", ...range];
    }
}

_["at"] = {
    Info: "get index..",
    Args: { array: "array", index: "number" },
    Code: (engine, array, index) => {
        let data = array.slice(1)[index[1]];
        if (data) return data; else return ["null"];
    }
}

_["first"] = {
    Info: "get first..",
    Args: { array: "array" },
    Code: (engine, array) => {
        let data = array.slice(1);
        if (data.length > 0) return data[0];
        else return ["null"];
    }
}

_["last"] = {
    Info: "get last..",
    Args: { array: "array" },
    Code: (engine, array) => {
        let data = array.slice(1);
        if (data.length > 0) return data[0];
        else return ["null"];
    }
}

_["len"] = {
    Info: "get length..",
    Args: { array: "array" },
    Code: (engine, array) => {
        let data = array.slice(1);
        return ["number", String(data.length)];
    }
}