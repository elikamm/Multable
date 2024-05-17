_["random"] = {
    Info: "between 0 and 1",
    Args: {},
    Code: () => {
        return ["number", String(Math.random())];
    }
}

_["abs"] = {
    Info: "make positive..",
    Args: { number: "number" },
    Code: (engine, number) => {
        let num = Number(number[1]);
        return ["number", Math.abs(num).toString()];
    }
}

_["round"] = {
    Info: "round..",
    Args: { number: "number" },
    Code: (engine, number) => {
        let num = Number(number[1]);
        return ["number", Math.round(num).toString()];
    }
}