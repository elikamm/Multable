const FS = require("fs"),
    PATH = require("path");

with (global) {
    Runtime = {};
    Config = JSON.parse(
        FS.readFileSync("config.json").toString()
    );
    Log = (log) => {
        if (Config.Log) console.log(log);
    }
}

function Setup() {
    Log(`### ${Config.Name} ${Config.Version} ###`);
    let scripts = Config.Scripts,
        paths = Config.Paths,
        time = -Date.now();

    scripts.Runtime.forEach(script =>
        Run(paths.Runtime, script)
    );
    Log("initialized runtime");
    scripts.Server.forEach(script =>
        Run(paths.Server, script)
    );
    Log(`listening on port ${Config.Port}`);

    time += Date.now();
    Log(`ready in ${time}ms.`);
}

function Run(root, script) {
    let path = PATH.join(root, script, "main");
    require(`./${path}`)();
}

Setup();