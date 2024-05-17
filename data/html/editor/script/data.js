function _HandleOpen(_first) {
    _Run.disabled = false;
    _ShowLoad(false);
}

function _HandleMessage(_key, _value) {
    switch(_key) {
        case "Exist":
            $("[_default]").forEach(_ => {
                let _text = "create";
                switch (_value) {
                    case -1: _.disabled = true; break;
                    case 1: _text = _.getAttribute("_default");
                    case 0: _.disabled = false; break;
                }
                _.innerText = _text;
            });
            break;

        case "Edit":
            _Show("");
            if (_value) {
                if (!_value.Exist) _Log(`created game '${_value.Name}'`);
                _Update(_value);
            } else _Log("the key is wrong", true);
            break;
        
        case "Debug":
            _Window.location = `/table?key=${_value}`;
            break;

        default:
            _OnMessage(_key, _value);
            break;
    }
}

function _HandleClose() {
    _Run.disabled = true;
    _ShowLoad(true);
}

function _SendEdit(_data) {
    _Send("Edit", { Name: _data[0], Key: _data[1] });
}
function _SendUpload() {
    let _pane = $("[_name=_Upload]")[0],
        _inputs = $("input, textarea", _pane),
        _data = _GetCode(), _game;

    _game = {
        Name: _inputs[0].value, Key: _inputs[1].value,
        Info: _inputs[2].value, Hide: _inputs[3].checked,
        Code: _data[0], Caret: _data[1]
    };

    _Send("Edit", _game);
}
function _SendDebug() {
    _Window = window.open("_blank");
    _Send("Debug", _GetCode()[0]);
}

function _Update(_data) {
    _Change(false, _data.Name);

    _Hide.checked = _data.Hide;
    _Info.value = _data.Info;

    _SetCode(_data.Code, _data.Caret);
}