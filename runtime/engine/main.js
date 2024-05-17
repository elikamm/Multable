const Format = require("./code/format"),
        Prog = require("./code/prog");

module.exports = () => {
    Runtime.Engines = {
        List:   [],

        Add:    Add,
        Remove: Remove
    };
}

class Engine {
    constructor(room) {
        this.ID = require("crypto").randomUUID();
        this.Room = room;

        let data = Format.Parse(room.Game.Code);
        this.Code = data[0]; this.Vars = data[1];

        this.Delta = 0;
        this.Timer = setInterval(() => {
            this.Trigger("tick", ["number", String(this.Delta)]);
            this.Delta = (this.Delta + 1) % Config.Ticks;
        }, 1000 / Config.Ticks);

        this.Ready = true;
        this.Trigger("");
    }

    Trigger() {
        setTimeout(() => {
            try { Prog.Trigger(this, ...arguments); }
            catch (_) {
                this.Error(-1, "fatal crash");
            }
        }, 0, this);
    }

    Error (line, text) {
        let error = `Error: ${text}` + (line == -1 ? "" : ` (line ${line})`);
        this.Room.Log(error, true);
        this.Ready = false;
    }
}

function Add(room) {
    let engine = new Engine(room);
    Runtime.Engines.List.push(engine);
    return engine;
}

function Remove(engine) {
    engine.Ready = false;
    clearInterval(engine.Timer);
    with (Runtime.Engines) {
        List = List.filter(_ => _.ID != engine.ID);
    }
}