const FS = require("fs"),
    PATH = require("path");

module.exports.Modify = Modify;
function Modify (name, buffer) {
    let data = buffer.toString();

    switch (name) {
        case ".html":
            data = data.replace(/<include[^>]*\/>/g, (match) => {
                let path = match.match(/(?<=href=")[^"]*/g)[0],
                    file = PATH.join(Config.Paths.HTML, path);
                return FS.readFileSync(file).toString();
            });
        
        case ".js":
        case ".css":
            data = data.replace(/%[A-Za-z0-9]*%/g, (match) => {
                let name = match.slice(1, -1);
                return Config[name].toString();
            });
            break;
    }

    return Buffer.from(data);
}