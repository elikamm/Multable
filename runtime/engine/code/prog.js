const Format = require("./format"),
    Eval = require("./eval"),
    Logic = require("./logic");

module.exports.Trigger = async (engine, event, ...args) => {
    if (event == "" && engine.Ready) {
        Treverse(engine, engine.Code, {}, 0, 0);
        return null;
    }
    else {
        let offset = Format.Get(engine.Code, new RegExp(`^on${event}\(.*\):$`));
        if (offset >= 0 && engine.Ready) {
            let text = engine.Code[offset].Text,
                names = text.slice(text.indexOf("(") + 1, -2).split(","),
                scope = { [event]: ["null"] };

            names.forEach((name, index) => {
                if (/^\w*$/.test(name)) {
                    if (name == "") return;
                    if (index < args.length) scope[name] = args[index];
                } else {
                    engine.Error(offset, `unexpected token '${name}'`);
                }
            });

            let lines = Format.Inspect(engine.Code, offset).Childs;
            return new Promise(async (resolve) => {
                let res = await Treverse(engine, lines, scope, 0, 0);
                resolve(res);
            });
        }
        return null;
    }
}

async function Treverse(engine, lines, scope, pointer, state) {
    if (pointer >= lines.length) return scope;

    let line = lines[pointer],
        text = Format.Tokenize(line.Text),
        info = Format.Inspect(lines, pointer),
        condition = text.slice(1, -1);

    if (text.length > 2 && text[text.length - 1] == ":") {
        if (text[0] == "on") {
            state = 0;
        }
        else if (text[0] == "for") {
            if (condition.length > 2 && condition[1] == "=") {
                let name = condition[0];
                if (/^\w+$/.test(name)) {
                    let value = await Eval(engine, condition.slice(2), scope),
                        iterate = [];

                    if (value[0] == "error") engine.Error(line.Offset, value[1]);
                    else if (value[0] == "array")
                        value.slice(1).forEach(element => {
                            iterate.push(element);
                        });
                    else iterate.push(value);

                    if (state == -1) state = 0;
                    state++;

                    if (state < iterate.length + 1) {
                        let temp = scope[name];

                        scope[name] = iterate[state - 1];
                        scope = await Treverse(engine, info.Childs, scope, 0, 0);
                        if (engine.Ready) {
                            if (scope[name]) delete scope[name];
                            if (temp) scope[name] = temp;
                        }
                        return promise(engine, lines, scope, pointer, state);
                    }
                    state = 0;
                }
                else engine.Error(line.Offset, `invalid variable '${name}'`);
            }
            else engine.Error(line.Offset, "no variable declaration in 'for'");
        }
        else if (text[0] == "while") {
            let value = await Eval(engine, condition, scope);

            if (Logic.IsTrue(value)) {
                scope = await Treverse(engine, info.Childs, scope, 0, 0);
                return promise(engine, lines, scope, pointer, state);
            }
            state = 0;
        }
        else {
            let value = await Eval(engine, condition, scope);

            if (value[0] == "error") engine.Error(line.Offset, value[1])
            else {
                switch (text[0]) {
                    case "elif":
                        if (state == 0) break;
                    case "if":
                        state = Logic.IsTrue(value) ? 0 : -1;
                        if (state == 0) await Treverse(engine, info.Childs, scope, 0, 0);
                        break;

                    case "else":
                        if (state == -1) await Treverse(engine, info.Childs, scope, 0, 0);
                        state = 0;
                        break;

                    default:
                        engine.Error(line.Offset, `invalid operator '${text[0]}'`);
                        break;
                }
            }
        }
        pointer = info.Next - 1;
    }
    else if (text.length > 2 && text[1] == "=") {
        let name = text[0];
        if (/^\w+$/.test(name)) {
            let value = await Eval(engine, text.slice(2), scope);

            if (value[0] == "error") engine.Error(line.Offset, value[1]);
            else if (scope[name]) scope[name] = value;
            else engine.Vars[name] = value;
        }
        else engine.Error(line.Offset, `invalid variable '${name}'`);
        state = 0;
    }
    else if (text.length > 2 && text[1].endsWith("=")) {
        let name = text[0],
            data = (scope[name]) ? scope[name] : engine.Vars[name];
        if (data) {
            let value = await Eval(engine, text.slice(2), scope);
            value = Logic.Calc(text[1].slice(0, -1), data, value);

            if (value[0] == "error") engine.Error(line.Offset, value[1]);
            else if (scope[name]) scope[name] = value;
            else engine.Vars[name] = value;
        }
        state = 0;
    }
    else {
        let value = await Eval(engine, text, scope);
        if (value[0] == "error") engine.Error(line.Offset, value[1]);
        state = 0;
    }

    pointer++;
    return promise(engine, lines, scope, pointer, state);
}

function promise(engine, lines, scope, pointer, state) {
    if (engine.Ready)
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                let res = await Treverse(engine, lines, scope, pointer, state);
                resolve(res);
            }, 0);
        });
}