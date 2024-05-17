const WebSocket = require("websocket");

const Answer = require("./answer");

module.exports = () => {
    let server = new WebSocket.server({
        httpServer: Runtime.Web.Server        
    });
    server.on("request", Handle);

    Runtime.Socket = server;
}

function Handle(request) {
    let connection = request.accept(),
        client = Runtime.Clients.Add(connection);

    connection.on("message", (message) => {
        try {
            let key, value = message.utf8Data;
            value = JSON.parse(
                value.replace(/^\w*/, match => {
                    key = match; return "";
                })
            );

            Answer(client, key, value);
        } catch(_) { console.error(_) };
    });

    connection.on("close", () => {
        Runtime.Clients.Remove(client);
    });
}