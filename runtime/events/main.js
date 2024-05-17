const IO = require("./io.js");

module.exports = () => {
    Runtime.Events = {
        List:   IO.ReadEvts(Config.Paths.Events),
        Params: IO.ReadParams(Config.Paths.Params),

        Handle: Handle,
        Search: Search
    };
}

function Handle(engine, name, args) {
    let events = Runtime.Events.List;
    if (Object.keys(events).includes(name)) {
        let event = events[name],
            values = Object.values(event.Args);

        if (args.length < values.length) return ["error", `'${name}()' has too few arguments`];
        else {
            for (let i = 0; i < values.length; i++) {
                let types = values[i].split("/");
                if (values[i] != "" && !types.includes(args[i][0]))
                    return ["error", `'${name}()' expects ${values[i]} but got ${args[i][0]}`];
            }
            
            return event.Code(engine, ...args);
        }
    }
    else return null;
}

function Search(query) {
    let results = [], on;
    if (!query) return results;

    query = query.replace(" ", "").toLowerCase();
    on = query.startsWith("on");
    if (on) query = query.substring(2);

    with (Runtime.Events) {
        Object.keys(Params).forEach(name => {
            let param = Params[name];

            if (results.length < 4 && on == false && name.toLowerCase().startsWith(query)) {
                results.push({
                    Name:   name,
                    Info:   "",
                    Type:   "param",
                    Args:   []
                });
            }
        });

        Object.keys(List).forEach(name => {
            let event = List[name];

            if (results.length < 4 && on == (event.Type == "event") && name.toLowerCase().startsWith(query)) {
                results.push({
                    Name:   name,
                    Info:   event.Info,
                    Type:   event.Type,
                    Args:   Object.keys(event.Args)
                });
            }
        });
    }

    return results;
}