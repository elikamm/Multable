const CRYPTO = require("crypto");

const Logic = require("./logic");

module.exports.Parse = (code) => {
    let lines = [], vars = {};

    code = code
        .replace(/("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g, (match) => {
            let name = CRYPTO.randomUUID().replaceAll("-", "_"),
                data = match.slice(1, -1).replaceAll("\n", "")
                    .replace(/\\./, (escape) => {
                        switch (escape[1]) {
                            case "n": return "\n";
                            case "\"": return "\""; case "'": return "'";
                            case "\\": return "\\";
                            default: return escape;
                        }
                    });
            vars[name] = ["string", data];
            return name;
        })
        .replace(/#.*(?=\n|$)/g, "");

    code.split("\n").forEach((line, offset) => {
        let indent = line.match(/^ */)[0].length;
        line = line.replaceAll(" ", "");

        if (line.includes(":")) {
            let index = line.indexOf(":");
            lines.push({
                Indent: indent, Text: line.slice(0, index + 1), Offset: offset + 1
            });
            line = line.slice(index + 1); indent++;
        }

        line.split(";").forEach(part => {
            if (part) lines.push({
                Indent: indent, Text: part, Offset: offset + 1
            });
        });
    });

    return [lines, vars];
}

module.exports.Tokenize = (line) => {
    line = line
        .replace(/(?<=^)(on|if|elif|else|while|for)/g, " $& ")
        .replace(/:/g, " $& ")
        .replace(Logic.Regex, " $& ");

    let index = 0, level = 0;
    while (index < line.length) {
        let char = line[index];
        level += (char == "(") - (char == ")");
        if (level > 0 && char == " ") {
            line = line.slice(0, index) + line.slice(index + 1);
        } else index++;
    }

    line = line
        .replace(/^ \- /g, " -")
        .replace(/  \- /g, " -");

    return line.trim().split(" ");
}

module.exports.Get = (lines, regex) => {
    let offset = -1;
    lines.forEach((line, index) => {
        if (regex.test(line.Text)) offset = index;
    });
    return offset;
}

module.exports.Inspect = (lines, offset) => {
    let parent = lines[offset],
        childs = [], next = lines.length;
    for (let i = offset + 1; i < lines.length; i++) {
        let line = lines[i];
        if (line.Indent > parent.Indent)
            childs.push(line);
        else {
            next = i; break;
        }
    }
    return { Childs: childs, Next: next };
}