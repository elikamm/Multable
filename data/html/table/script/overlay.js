function _Initialize() {
    _Room.addEventListener("click", () => {
        let _copy = document.createElement("textarea");
        _copy.value = `http://${window.location.host}/@${_Room.innerText}`;
        document.body.appendChild(_copy); _copy.select();
        document.execCommand("copy"); _copy.remove();

        _Log("copied invite link to clipboard");
    });

    _OnInitialize();
    _URL("/");
}

function _Style(_design) {
    with (_Table.style) {
        display = "block";
        backgroundImage = `url(/assets/design/${_design}.png)`;
    }
}

var _Rotation = 0, _Scale = 1;
function _Rotate(_degree) {
    _Rotation = (_degree / 180) * Math.PI;
    _Scale = 1 + Math.sin(Math.PI / 4) - Math.sin(_Rotation % (Math.PI / 2) + Math.PI / 4);

    with (document.body.style) {
        setProperty("--_Scale", _Scale);
        setProperty("--_Rotation", `${_Rotation}rad`);
    }
}

function _Cursor(_value) {
    let _id = _value[0], _position = _value[1],
        _found = false;
    
    $("._Cursor", _Cursors).forEach(_cursor => {
        if (_cursor.getAttribute("_id") == _id) {
            if (!_position) _cursor.remove();
            else with (_cursor.style) {
                left = `${(_position[0] / 100) * 92 + 4}%`,
                top = `${(_position[1] / 100) * 92 + 4}%`;
            }
            _found = true;
        }
    });

    if (!_found && _position) {
        let _cursor = document.createElement("div");
        _cursor.classList.add("_Pane", "_Cursor");
        _cursor.setAttribute("_id", _id);

        let _name = _List.filter(_ => _[0] == _id).map(_ => _[1])[0] || "";
        _cursor.innerText = _name;

        with (_cursor.style) {
            left = `${(_position[0] / 100) * 92 + 4}%`,
            top = `${(_position[1] / 100) * 92 + 4}%`;
        }
        _Cursors.appendChild(_cursor);
    }
}