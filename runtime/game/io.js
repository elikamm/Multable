const FS = require("fs"),
    PATH = require("path");

module.exports.Read = (name) => {
    let file = FS.readFileSync(Path(name)).toString(),
        data = {}, game = {};

    file.match(/(?<=<)\w*(?=>)/g).forEach(match => {
        let content = file.match(
            new RegExp(`(?<=<${match}>)[\\w\\W]*(?=</${match}>)`)
        )[0];
        data[match] = Special(content, false);
    });

    game.Name = data.name;
    game.Info = data.info;
    game.Key = data.key;
    game.Hide = (data.hide == "true");
    game.Plays = Number(data.plays);
    game.Caret = Number(data.caret);
    game.Code = data.code.match(/(?<=    ).*(?=\n)/g).join("\n");

    return game;
}

module.exports.Write = (name, data) => {
    let code = data.Code.split("\n").join("\n    ");

    let file =
        "<meta>\n" +
        `    <name>${Special(data.Name)}</name>\n` +
        `    <info>${Special(data.Info)}</info>\n` +
        `    <key>${Special(data.Key)}</key>\n` +
        `    <hide>${data.Hide}</hide>\n` +
        "</meta>\n<hot>\n" +
        `    <plays>${data.Plays}</plays>\n` +
        `    <caret>${data.Caret}</caret>\n` +
        "</hot>\n<code>\n" +
        `    ${Special(code)}\n` +
        "</code>";

    FS.writeFileSync(Path(name), file);
}

module.exports.Watch = (list) => {
    let path = Config.Paths.Games;
    FS.watch(path, (event) => {
        if (event == "rename") list(GetGames(path));
    });
    list(GetGames(path));
}

function GetGames(path) {
    return FS.readdirSync(path)
        .filter(file => !file.startsWith(".") && PATH.extname(file) == ".xml")
        .map(file => file.slice(0, -4));
}

function Path(name) {
    return PATH.join(
        Config.Paths.Games, `${name}.xml`
    );
}

function Special(text, encode = true) {
    if (encode) {
        text = text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
    } else {
        text = text
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("&amp;", "&")
    }
    return text;
}