const IO = require("./io"),
    Filter = require("./filter");

module.exports = () => {
    Runtime.Games = {
        List: [],

        Search: Search,
        Edit:   Edit,
        Get:    Get,
        Play:   Play
    };

    IO.Watch(list => {
        Runtime.Games.List = list;
    });
}

class Game {
    constructor(name) {
        this.Path = Simplify(name);
        if (Runtime.Games.List.includes(this.Path)) {
            let data = IO.Read(this.Path);
            Object.assign(this, data);
            this.Exist = 1;
        }
        else if (/^([A-Za-z0-9\-]{1,10})$/.test(name)) {
            this.Name = name; this.Info = "";
            this.Key = ""; this.Hide = true; this.Plays = 0;
            this.Caret = 0; this.Code = "";
            this.Exist = 0;
        }
        else this.Exist = -1;
    }

    Filter() {
        return {
            Name: this.Name, Info: this.Info, Plays: this.Plays
        }
    }
    
    Save() {
        IO.Write(this.Path, this);
    }
}

function Search(query) {
    query = Simplify(query);
    let files = Filter([...Runtime.Games.List], query),
        games = [];
    for (let i = 0; i < files.length; i++) {
        if (games.length == 4) break;
        let game = new Game(files[i]);
        if (!game.Hide) games.push(game.Filter());
    }
    return games;
}

function Edit(data) {
    let game = new Game(data.Name);
    switch (game.Exist) {
        case -1:
            return null;

        case 0:
            game.Key = data.Key;
        case 1:
            if (game.Key == data.Key) {
                if (data.Info != undefined) game.Info = data.Info;
                if (data.Hide != undefined) game.Hide = data.Hide;
                if (data.Code != undefined) game.Code = data.Code;
                if (data.Caret != undefined) game.Caret = data.Caret;

                game.Save();
                delete game.Path;
                return game;
            }
            else return null;
    }
}

function Get(name) {
    return new Game(name);
}

function Play(name) {
    let game = new Game(name);
    game.Plays++; game.Save();
}

function Simplify(name) {
    return name
        .toLowerCase()
        .replaceAll(" ", "-");
}