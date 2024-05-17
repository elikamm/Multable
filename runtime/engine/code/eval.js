const Format = require("./format"),
    Logic = require("./logic"),
    Prog = require("./prog");

module.exports = Eval;

async function Eval(engine, expr, scope) {
    if (expr.length == 1) {
        let token = expr[0];

        if (token == "") {
            return ["null"];
        }
        else if (!isNaN(token)) {
            return ["number", token];
        }
        else if (/^\w*$/.test(token)) {
            if (Object.keys(scope).includes(token)) {
                return scope[token];
            } else if (Object.keys(engine.Vars).includes(token)) {
                return engine.Vars[token];
            } else if (Object.keys(Runtime.Events.Params).includes(token)) {
                return Runtime.Events.Params[token];
            } else {
                return ["null"];
            }
        }
        else if (/^\w*\(.*\)$/.test(token)) {
            let name = token.slice(0, token.indexOf("(")),
                args = token.slice(token.indexOf("(") + 1, -1),
                level = 0;

            for (let i = 0; i < args.length; i++) {
                level += (args[i] == "(" ? 1 : 0) + (args[i] == ")" ? -1 : 0);
                if (level == 0 && args[i] == ",") {
                    args = args.slice(0, i) + " " + args.slice(i + 1);
                }
            }

            return new Promise(async (resolve) => {
                args = await Promise.all(args.split(" ").map(async (_) => {
                    return await Eval(engine, Format.Tokenize(_), scope);
                }));
                let error = args.filter(_ => _[0] == "error");

                if (error.length > 0) resolve(error[0]);
                else if (name == "") resolve(args[0]);
                else {
                    let value = await Prog.Trigger(engine, name, ...args);
                    if (value == null) value = Runtime.Events.Handle(engine, name, args);
                    else value = value[name];
                    if (value == null) {
                        value = ["error", `'${name}()' is not defined`];
                    }
                    resolve(value);
                }
            });
        }
        else {
            return ["error", `unexpected token '${token}'`];
        }
    }
    else for (let i = 0; i < Logic.Special.length; i++) {
        let special = Logic.Special[i];

        if (expr.includes(special)) {
            let sides = Split(expr, special, true);

            return new Promise(async (resolve) => {
                sides = await Promise.all(sides.map(async (_) => {
                    return await Eval(engine, _, scope);
                }));
                let error = sides.filter(_ => _[0] == "error");

                if (error.length > 0) resolve(error[0]);
                else {
                    resolve(Logic.Calc(special, ...sides));
                }
            });
        }
    }

    return ["error", "invalid syntax"];
}

function Split(expr, token, last = false) {
    let index = last ? expr.lastIndexOf(token) : expr.indexOf(token);
    return [
        expr.slice(0, index),
        expr.slice(index + 1)
    ]
}