var _Data = [];

function _OnInitialize() {
    let _search = new URL(window.location).searchParams;

    if (_search.get("reload") == "1") _Log("this page had to be reloaded", true);

    let _unknown = _search.get("unknown");
    if (_unknown) _Log(`the page '${_unknown}' could not be found`, true);

    let _room = _search.get("room");
    if (_room) _Data.push(["Room", Number(_room)]);

    let _game = _search.get("game");
    if (_game) _Data.push(["Game", _game]);

    _Inputs();
}

function _OnOpen() {
    if (_Data.length > 0) {
        _Data.forEach(_ => _Send(..._));
    } else _Send("Guide", null);
}

function _OnMessage(_key, _value) {
    switch (_key) {
        case "Name":
            console.log(_Name);
            _Name.innerText = _value; _Send("Guide", null);
            break;
        case "Room":
            _Room.innerText = _value;
        case "Game": case "Good":
            _Send("Guide", null);
            break;

        case "Ask":
            if (_value) {
                _Slide(_value); _ShowLoad(false);
            } else _Send("Register", null);
            break;
        case "Bad":
            _Reset(_value); _ShowLoad(false);
            switch (_value) {
                case "Name": _Log("this name isn't allowed", true); break;
                case "Room": _Log("this room doesn't exist", true); break;
                case "Game": _Log("no games match the query", true); break;
            }
            break;

        case "Games":
            _ListGames(_value); _ShowLoad(false);
            break;

        case "Register":
            window.location.replace(`/table?key=${_value}`);
            break;
    }
}