var _Key;

function _OnInitialize() {
    window.addEventListener("keydown", (_event) => {
        let _key;
        switch (_event.code) {
            case "KeyW": case "ArrowUp": _key = "up"; break;
            case "KeyS": case "ArrowDown": _key = "down"; break;
            case "KeyA": case "ArrowLeft": _key = "left"; break;
            case "KeyD": case "ArrowRight": _key = "right"; break;
            case "Space": case "Enter": _key = "fire"; break;
        }
        if (_key) _Send("Press", _key);
    });
    window.addEventListener("mousemove", (_event) => {
        let _position = _Convert(_event);
        _Send("Cursor", _position.map(_ => Math.round(_ * 10) / 10)); _Drag(_position);
    });
    window.addEventListener("mouseup", (_event) => {
        if (_Dragging) {
            let _position = _Convert(_event);
            _Send("Drag", [_Dragging.getAttribute("_id"), _position]);
            with (_Dragging.style) {
                transition = ""; zIndex = "";
                left = _Dragging.getAttribute("_x");
                top = _Dragging.getAttribute("_y");
            }
            _Dragging = null;
        }
    });
    window.addEventListener("blur", () => _Send("Cursor", null));
    window.addEventListener("mouseout", (_event) => {
        if (_event.relatedTarget == null) _Send("Cursor", null);
    });

    _Table.addEventListener("mousedown", (_event) => {
        if (!_Dragging && _event.button == 0) _Send("Click", _Convert(_event));
    });

    let _search = new URL(window.location).searchParams;
    _Key = _search.get("key");
}

function _OnOpen() {
    if (_Key) {
        _Send("Revive", _Key);
    } else _Reload();
}

function _OnMessage(_key, _value) {
    switch (_key) {
        case "Bad": _Reload(); break;
        case "Name": _Name.innerText = _value; break;
        case "Room":
            _Room.innerText = _value; _URL(`/@${_value}`);
            break;
        case "Game":
            if (_value[0] != "[") _value = `'${_value}'`;
            document.title =`${_value} - %Name%`;
            break;

        case "Style":   _Style(_value);  break;
        case "Rotate":  _Rotate(_value); break;
        case "Clear":   _Clear();        break;
        case "Update":  _Update(_value); break;
        case "Change":  _Change(_value); break;
        case "Remove":  _Remove(_value); break;
        case "Cursor":  _Cursor(_value); break;

        case "Banner": _ShowBanner(_value); break;
    }
}

function _Convert(_event) {
    let _coords = [_event.clientX, _event.clientY],
        _scale = (224 * Math.cos(_Scale)) / Math.min(window.innerWidth, window.innerHeight);

    _coords = [_coords[0] - window.innerWidth / 2, _coords[1] - window.innerHeight / 2];
    _coords = [
        _coords[1] * Math.sin(_Rotation) + _coords[0] * Math.cos(_Rotation),
        _coords[1] * Math.cos(_Rotation) - _coords[0] * Math.sin(_Rotation)
    ];
    _coords = [_coords[0] * _scale + 50, _coords[1] * _scale + 50];
    
    return _coords;
}

function _Drag(_position) {
    if (_Dragging) {
        let _left = `${(_position[0] / 100) * 92 + 4}%`,
            _top = `${(_position[1] / 100) * 92 + 4}%`;;
        with (_Dragging.style) {
            left = _left; top = _top;
        }
    }
}

function _ShowBanner(_text) {
    with (_Banner) {
        innerText = _text;
        style.animation = ""; offsetHeight;
        style.animation = "_Banner 2s linear";
    }
}