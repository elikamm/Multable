const _Pairs = ['""', "''", "()"];

function _HandleInput(_event) {
    let _line = _GetLine(),
        _indent = _line[0].match(/^[ ]*/g)[0],
        _prevent = false, _insert = "", 
        _move = 0, _select = 0, _remove = [0, 0],
        _autofill = true, _clear = _Input.selectionEnd - _Input.selectionStart;

    switch (_event.code) {
        case "Enter":
            _prevent = true; _move = _indent.length + 1;
            if (_line[0].trim().slice(-1) == ":") {
                _insert = `\n${_indent}  `; _move += 2;
            } else _insert = `\n${_indent}`;
            break;

        case "Tab":
            _prevent = true;
            if (_Results.length > 0) {
                let _old = _GetLast(), _new = _Results[_Offset];
                _remove[0] = _old.length; _move = -_old.length;
                _insert = _new[1].replaceAll("\n", `\n${_indent}`);
                _move += _insert.length - _new[2]; _select = _new[3];
            } else {
                let _space = 2 - _line[0].length % 2;
                _move = _space; _insert = " ".repeat(_space);
            }
            break;

        case "ArrowUp": if (_Select(-1)) { _prevent = true; _autofill = false; } break;
        case "ArrowDown": if (_Select(1)) { _prevent = true; _autofill = false; } break;

        case "Backspace":
            if (_clear == 0) {
                if (_line[0].match(/  $/g) && _line[0].length % 2 == 0) {
                    _prevent = true; _move = -2;
                    _remove[0] = 2;
                } else
                    _Pairs.forEach(_pair => {
                        if (_line[0][_line[0].length - 1] == _pair[0] && _line[1][0] == _pair[1]) {
                            _prevent = true; _move = -1; _remove = [1, 1];
                        }
                    });
            }
            break;
        
        default:
            _Pairs.forEach(_pair => {
                if (_pair.includes(_event.key)) {
                    _prevent = true; _move = 1;
                    if (_event.key == _pair[0]) _insert = _pair;
                    else if (!_pair.includes(_line[1][0])) _insert = _pair[1];
                }
            });
            break;
    }

    if (_clear != 0) { _remove[0] = _clear; _move -= _clear; }

    if (_prevent) {
        _event.preventDefault();
        let _value = _Input.value, _caret = _Input.selectionEnd;

        _value = 
            _value.slice(0, _caret - _remove[0]) + _insert + _value.slice(_caret + _remove[1]);
        
        _Input.value = _value;
        _caret += _move; _Input.setSelectionRange(_caret, _caret + _select);
        _UpdateCode(); if (_autofill) _UpdateCaret();
    }

    if (_autofill)
        setTimeout(() => {
            _Query = _GetLast(); _Send("Search", _Query);
        }, 0);
}

function _GetLast() {
    return _Input.value.slice(0, _Input.selectionEnd).match(/\w*$/)[0].toLowerCase();
}

function _GetLine() {
    let _start = _Input.value
        .substring(0, _Input.selectionEnd).match(/(\n|^)[^\n]*$/g)[0];

    if (_start.startsWith("\n")) _start = _start.substring(1);

    return [
        _start,
        _Input.value
            .substring(_Input.selectionEnd).match(/^[^\n]*(?=\n|$)/g)[0]
    ];
}