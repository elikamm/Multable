const FS = require("fs"),
    PATH = require("path");

module.exports.ReadEvts = (path) => {
    let events = {}, files = getFiles(path),
        general = "";

    files = files.filter((file) => {
        let intern = PATH.parse(file).name.startsWith("#");
        if (intern) general += FS.readFileSync(file) + "\n";
        return !intern;
    });

    eval(general);

    files.forEach(file => {
        let data = FS.readFileSync(file),
            _ = {};
        
        eval(data.toString());
        Object.keys(_).forEach(name => {
            let event = _[name];
            event.Type = PATH.parse(file).name;
            events[name] = event;
        });
    });

    return events;
}

module.exports.ReadParams = (path) => {
    let data = FS.readFileSync(path).toString();
    return JSON.parse(data);
}

function getFiles(dir) {
    let files = [];
    FS.readdirSync(dir).forEach(name => {
        let path = PATH.join(dir, name);
        if (FS.lstatSync(path).isDirectory()) {
            files.push(...getFiles(path));
        }
        else files.push(path);
    });
    return files;
}