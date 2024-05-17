const FS = require("fs"),
    PATH = require("path");

const Dynamic = require("./dynamic");

module.exports.Collect = Collect;
function Collect(dir) {
    let files = {};

    FS.readdirSync(dir).forEach(file => {
        let path = PATH.join(dir, file),
            stat = FS.lstatSync(path);

        if (stat.isDirectory())
            files = {...files, ...Collect(path)};
        else if (stat.isFile() && !file.startsWith(".")) {
            let name = path.substring(Config.Paths.HTML.length);
            files[name] = Read(path);
        }
    });

    return files;
}

module.exports.Read = Read;
var Texts = [".js", ".html", ".css"];
function Read(file) {
    let data = FS.readFileSync(file),
        name = PATH.extname(file);

    if (Texts.includes(name)) {
        data = Dynamic.Modify(name, data);
        if (Config.Abstract) data = Abstract(name, data);
    }

    return data;
}

var Table = [];
function Abstract(name, buffer) {
    let data = buffer.toString(),
        lines = data.split("\n");
    
    lines.forEach((line, index) => {
        lines[index] = line.trim();
    });
    switch (name) {
        case ".js":
            lines.forEach((line, index) => {
                if (line.endsWith("}")) line += ";";
                lines[index] = line.replace(/(?<!:)\/\/.*$/g, "");
            });

        case ".html":
        case ".css":
            data = lines.join(" ");
            break;
    }

    data = data.replace(/_[A-Za-z0-9]*/g, (match) => {
        let index = 0;

        if (Table.includes(match))
            index = Table.indexOf(match) + 1;
        else index = Table.push(match);

        index = index.toString();
        return `l${index.padStart(3, "0")}`;
    });

    return Buffer.from(data);
}