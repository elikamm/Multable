const Setup = require("./setup"),
        Live = require("./live");

module.exports = () => {
    Runtime.Clients = {
        List:   [],

        Add:    Add,
        Remove: Remove,
        Filter: Filter,
        Get:    Get
    };
}

class Client {
    constructor (connection) {
        this.ID = require("crypto").randomUUID();
        this.Connection = connection;
        this.Name = "";
        this.Active = false;
        this.Room = null;
        this.Logged = false;
        this.Host = false;
        this.Position = null;
    }

    Guide()         { return Setup.Guide(this, ...arguments); }
    Revive()        { return Setup.Revive(this, ...arguments); }
    SetName()       { return Setup.SetName(this, ...arguments); }
    SetRoom()       { return Setup.SetRoom(this, ...arguments); }
    SetGame()       { return Setup.SetGame(this, ...arguments); }
    SetSetup()      { return Setup.SetSetup(this, ...arguments); }
    CheckSetup()    { return Setup.CheckSetup(this, ...arguments); }
    Activate()      { return Setup.Activate(this, ...arguments); }
    Reset()         { return Setup.Reset(this, ...arguments); }

    Init()          { return Live.Init(this, ...arguments); }
    Cursor()        { return Live.Cursor(this, ...arguments); }
    Press()         { return Live.Press(this, ...arguments); }
    Click()         { return Live.Click(this, ...arguments); }
    Drag()          { return Live.Drag(this, ...arguments); }

    Send (key, value) {
        let data = `${key} ${JSON.stringify(value)}`;
        this.Connection.send(data);
    }
}

function Add(connection) {
    let client = new Client(connection);
    Runtime.Clients.List.push(client);
    Log(`new client #${client.ID}`);
    return client;
}

function Remove(client) {
    client.Reset();
    Log(`#${client.ID} disconnected`);
    with (Runtime.Clients) {
        List = List.filter(_ => _.ID != client.ID);
    }
}

function Filter(filter) {
    return Runtime.Clients.List.filter(filter);
}

function Get(id) {
    let client = Runtime.Clients.List.filter(client => client.ID == id)[0];
    if (client) return client; else return null;
}