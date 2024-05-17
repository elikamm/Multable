module.exports = () => {
    Runtime.Registers = {
        List:   [],

        Add:    Add,
        Get:    Get,
        Debug:  Debug
    };
}

class Register {
    constructor(client) {
        this.ID = require("crypto").randomUUID();
        this.Timeout = setTimeout(Remove, 10000, this);
        this.Data = {
            Name:   client.Name,
            Host:   client.Host,
            Room:   client.Room,
            Logged: client.Logged
        }
    }
}

function Add(client) {
    let register = new Register(client);
    Runtime.Registers.List.push(register);
    Log(`created register *${register.ID}`);
    client.Send("Register", register.ID);
}

function Get(id) {
    let registers = Runtime.Registers.List.filter(_ => _.ID == id);
    if (registers.length) {
        let data = registers[0].Data;
        Remove(registers[0]);
        return data;
    } else return null;
}

function Debug(code) {
    let room = Runtime.Rooms.Add();
    room.Setup = true; room.Load({
        Name: "[debug]", Code: code
    });
    let register = new Register({
        Name: "Player", Host: true,
        Room: room, Logged: true
    });
    Runtime.Registers.List.push(register);
    return register.ID;
}

function Remove(register) {
    Log(`*${register.ID} deleted`);
    clearTimeout(register.Timeout);
    with (Runtime.Registers) {
        List = List.filter(_ => _.ID != register.ID);
    }
}