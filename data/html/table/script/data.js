var _List = [];

function _HandleOpen(_first) {
    if (_first) {
        _ShowLoad(false);
        _OnOpen();
    } else _Reload();
}

function _HandleMessage(_key, _value) {
    switch(_key) {
        case "Clients":
            _List = _value;
            _Clients.innerHTML = _List.reverse().map(_ =>
                (_[2] ? "<span>•</span>" : "") + _[1]
            ).join("<br>");
            break;

        case "Log": _Log(..._value); break;

        default:
            _OnMessage(_key, _value);
            break;
    }
}

function _HandleClose() {
    _ShowLoad(true);
}

function _Reload() {
    window.location.replace("/?reload=1");
}