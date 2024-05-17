const _Operators = {
    on: ["on", 0, 0], if: ["if :", 1, 0], elif: ["elif :", 1, 0],
    else: ["else:\n  ", 0, 0], while: ["while :", 1, 0], for: ["for i = :", 1, 0]
}

function _OnInitialize() {
    _Input.addEventListener("keydown", _HandleInput);
    _Input.addEventListener("scroll", () => _UpdateScroll() );
    _Input.addEventListener("input", () => {
        _UpdateCode();
        _UpdateCaret();
        _Change(true);
    });

    document.addEventListener("selectionchange", () => _UpdateCaret() );
    _Content.addEventListener("click", () => { _Input.focus(); });

    _Input.value = ""; _Input.focus();

    _URL("/editor");
}

var _Results = [], _Offset = 0, _Query = "";
function _OnMessage(_key, _value) {
    if (_key == "Search") {
        _Results = []; _Offset = 0;

        if (_Query) {
            _Results.push(...Object.keys(_Operators)
                .filter(_ => _.toLowerCase().startsWith(_Query)).map((_) => {
                    return [`<c_branch>${_}:</c_branch>`, ..._Operators[_]];
            }));
            
            _Results.push(..._GetVars()
                .filter(_ => _[0].toLowerCase().startsWith(_Query)).map(_ => {
                    return [`<c_variable>${_[0]}</c_variable> <span>(line ${_[1]})</span>`, _[0], 0, 0];
            }));
        }
        
        _Results.push(..._value.map(_ => {
            let _args = _.Args.join(", "),
                _name = `<c_command>${_.Name}()</c_command> <span>${_.Info}</span>`;
            if (_.Type == "param")
                return [`<c_variable>${_.Name}</c_variable>`, _.Name, 0, 0];
            else if (_.Type == "event")
                return [_name, `on ${_.Name}(${_args}):\n  `, 0, 0];
            else {
                let _len = _args.length;
                return [
                    _name, `${_.Name}(${_args})`, _len ? (_len + 1) : 0, _len
                ];
            }
        }));

        _Results = _Results.filter((_result, _index) => {
            return _Results.findIndex(_ => _[1] == _result[1]) == _index;
        });

        _Autofill.innerHTML = "";
        _Autofill.style.display = (_Results.length == 0) ? "" : "block";
        _Results.forEach((_result) => {
            let _div = document.createElement("div");
            _div.innerHTML = _result[0];
            _Autofill.appendChild(_div);
        });
        _Select(0);
    }
}

function _GetVars() {
    let _vars = [],
        _lines = _Input.value
            .replace(/#.*(?=\n|$)/g, "")
            .replace(/("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g, "")
            .replaceAll(" ", "").split("\n");

    _lines.forEach((_line, _index) => {
        (_line.match(/\w+[\(]{0,1}/g) || []).forEach(_ => {
            if (!_.endsWith("(") && _Query != _.toLowerCase() && !_Operators[_])
                _vars.push([_, _index + 1]);
        });
    });

    return _vars;
}

function _GetCode() {
    return [_Input.value, _Input.selectionEnd];
}

function _SetCode(_code, _caret) {
    _Input.value = _code;
    _Input.setSelectionRange(_caret, _caret);
    _UpdateCode(); _UpdateCaret();
}

function _Select(_move) {
    if (_Results.length == 0) return false;

    _Offset = Math.abs((_Offset + _move) % _Results.length);
    $("#_Autofill div").forEach((_, _index) => {
        _.style.background = (_index == _Offset) ? "var(--_Plane4)" : "";
    });

    return true;
}