var FS = require("fs"),
    PATH = require("path"),
    CHILD = require("child_process"),
    CHOKIDAR = require("chokidar"),
    File = "start.js", //process.argv.slice(-1)[0],
    Process = null,
    Counter = 0;

CHOKIDAR.watch(PATH.dirname(File), { ignored: ["games"] }).on("all", () => {
    Counter++;
    setTimeout((counter) => {
        if (counter == Counter) Reset();
    }, 100, Counter);
});

Reset();
function Reset() {
    if (Process != null) {
        Process.kill();
        setTimeout(Launch, 100);
        return;
    }
    else Launch();
}

function Launch() {
    console.clear();
    process.stdout.write(`\u001b[7m ${File} \u001b[0m\u001b[2m [${Time()}]\u001b[0m\n> `);
    Process = CHILD.spawn("node", [File]);

    Process.stdout.on("data", (data) => Log(data, false));
    Process.stderr.on("data", (data) => Log(data, true));
    Process.on("close", () => {
        process.stdout.write("\n");
        Process = null;
    });
}

function Log(data, error) {
    let lines = data.toString().split("\n");
    if (error) lines = lines.map(l => `\u001b[31m${l}\u001b[0m`);
    process.stdout.write(lines.join("\n> "));
}

function Time() {
    let date = new Date(),
        time = [
            date.getHours(), date.getMinutes(), date.getSeconds()
        ]

    time = time.map(t => {
        t = t.toString();
        return ((t.length == 1) ? "0" : "") + t;
    });

    return time.join(":");
}