module.exports.Special = ["+", "-", "*", "/", "&", "|", "<=", "<", ">=", ">", "!=", "="];
module.exports.Regex = /(\+|-|\*|\/|&|\||<=|<|>=|>|!=|=)(={0,1})/g;

module.exports.Calc = (special, a, b) => {
    switch (special) {
        case "+": return Add(a, b); 
        case "-": return Subtract(a, b); 
        case "*": return Multiply(a, b); 
        case "/": return Divide(a, b);
        case "&": return And(a, b); 
        case "|": return Or(a, b);

        case "<=": return IsLessOrEqual(a, b);
        case "<": return IsLess(a, b);
        case ">=": return IsGreaterOrEqual(a, b);
        case ">": return IsGreater(a, b);  
        case "!=": return IsNot(a, b);
        case "=": return IsEqual(a, b);

        default: return ["null"];
    }
}

module.exports.IsTrue = IsTrue;
function IsTrue(value) {
    return !(
        (value[0] == "null") ||
        (value[0] == "number" && value[1] == "0") ||
        (value[0] == "string" && value[1] == "")
    );
}

function Add(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) + Number(b[1])).toString();
        return ["number", value];
    } else if (a[0] == "string" && b[0] == "string" ||
               a[0] == "number" && b[0] == "string" ||
               a[0] == "string" && b[0] == "number") {
        return ["string", a[1] + b[1]];
    } else if (a[0] == "array") {
        return [...a, b];
    }
    else return ["error", `can't add ${b[0]} to ${a[0]}`];
}

function Subtract(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) - Number(b[1])).toString();
        return ["number", value];
    } else if (a[0] == "array") {
        let array = a.slice(2).filter(_ => JSON.stringify(_) != JSON.stringify(b));
        return ["array", ...array];
    }
    else return ["error", `can't subtract ${b[0]} from ${a[0]}`];
}

function Multiply(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) * Number(b[1])).toString();
        return ["number", value];
    }
    else return ["error", `can't multiply ${a[0]} with ${b[0]}`];
}

function Divide(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        if (b[1] == "0") return ["error", "division by zero"];
        else {
            value = (Number(a[1]) / Number(b[1])).toString();
            return ["number", value];
        }
    }
    else return ["error", `can't divide ${a[0]} by ${b[0]}`];
}

function And(a, b) {
    let value = (IsTrue(a) && IsTrue(b)) ? "1" : "0";
    return ["number", value];
}

function Or(a, b) {
    let value = (IsTrue(a) || IsTrue(b)) ? "1" : "0";
    return ["number", value];
}

function IsLessOrEqual(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) <= Number(b[1])) ? "1" : "0";
        return ["number", value];
    }
    else return ["error", `can't compare ${a[0]} to ${b[0]}`];
}

function IsLess(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) < Number(b[1])) ? "1" : "0";
        return ["number", value];
    }
    else return ["error", `can't compare ${a[0]} to ${b[0]}`];
}

function IsGreaterOrEqual(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) >= Number(b[1])) ? "1" : "0";
        return ["number", value];
    }
    else return ["error", `can't compare ${a[0]} to ${b[0]}`];
}

function IsGreater(a, b) {
    let value = "";

    if (a[0] == "number" && b[0] == "number") {
        value = (Number(a[1]) > Number(b[1])) ? "1" : "0";
        return ["number", value];
    }
    else return ["error", `can't compare ${a[0]} to ${b[0]}`];
}

function IsNot(a, b) {
    let value = (a[0] == b[0] && a[1] == b[1]) ? "0" : "1";
    return ["number", value];
}

function IsEqual(a, b) {
    let value = (a[0] == b[0] && a[1] == b[1]) ? "1" : "0";
    return ["number", value];
}