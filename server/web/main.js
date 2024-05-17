const HTTP = require("http"),
    MIME = require("mime-types");
    
const Data = require("./data");

module.exports = () => {
    let server = HTTP.createServer(Handle);
    server.listen(Config.Port);

    Runtime.Web = {
        Server: server,
        Data:   Data.Collect(Config.Paths.HTML)
    };
}

function Handle(request, response) {
    let url = request.url.split("?")[0],
        path = url.split("/");
    
    let last = path[path.length - 1];
    if (!last) path.pop();
    if (!last.includes("."))
        path.push("index.html");
    path = path.join("/");

    if (path.endsWith("index.html")) Log(`served '${path}'`);
    let file = Runtime.Web.Data[path];

    if (file) {
        response.writeHead(200, {
            "Content-Type": MIME.lookup(path)
        });
        response.write(file);
    }
    else {
        let redirect = "/?",
            room = path.match(/(?<=^\/@)[0-9]*(?=\/index\.html$)/g),
            game = path.match(/(?<=^\/)[^\/]*(?=\/index\.html$)/g);

        if (room) {
            redirect += `room=${room[0]}`;
        } else if (game && Runtime.Games.Get(game[0]).Exist == 1) {
            redirect += `game=${game[0]}`;
        } else {
            redirect += `unknown=${encodeURIComponent(url)}`;
        }

        response.writeHead(302, {
            "Location": redirect,
            "Content-Type": "text/html",
        });
        response.write(`Go <a href="${redirect}">here</a>.`);
    }

    response.end();
}