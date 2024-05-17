const Setup = require("./setup"),
    Client = require("./client"),
    Item = require("./item");

module.exports = () => {
    Runtime.Rooms = {
        List:   [],

        Add:    Add,
        Remove: Remove,
        Get:    Get
    };
}

class Room {
    constructor() {
        let id;
        do { id = 100000 + Math.round(899999 * Math.random()); }
        while (Runtime.Rooms.Get(id));
        this.ID = id;

        this.Timeout = setInterval(this.Timeout, 10000, this);
        this.Password = "";
        this.Setup = false;
        this.Game = null;
        this.Engine = null;
        this.Table = null;
        this.Logs = [];
    }

    Timeout()   { return Setup.Timeout(this, ...arguments); }
    Load()      { return Setup.Load(this, ...arguments); }

    Clients()   { return Client.Clients(this, ...arguments); }
    Cast()      { return Client.Cast(this, ...arguments); }
    List()      { return Client.List(this, ...arguments); }
    Log()       { return Client.Log(this, ...arguments); }

    Get()       { return Item.Get(this, ...arguments); }
    Add()       { return Item.Add(this, ...arguments); }
    Update()    { return Item.Update(this, ...arguments); }
    Remove()    { return Item.Remove(this, ...arguments); }
}

function Add() {
    let room = new Room();
    Runtime.Rooms.List.push(room);
    Log(`opened room @${room.ID}`);
    return room;
}

function Remove(room) {
    if (room.Engine) Runtime.Engines.Remove(room.Engine);
    Log(`closed @${room.ID}`);
    clearTimeout(room.Timeout);
    with (Runtime.Rooms) {
        List = List.filter(_ => _.ID != room.ID);
    }
}

function Get(id) {
    let room = Runtime.Rooms.List.filter(room => room.ID == id)[0];
    if (room) return room; else return null;
}