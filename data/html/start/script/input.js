function _Inputs() {
    let _inputs = $("[_flow]");
    _inputs.forEach((_, _index) => {
        let _next = _inputs[_index + 1];
        switch (_.nodeName) {
            case "INPUT":
                _.addEventListener("keydown", _ => {
                    if (_.key == "Enter") _next.click();
                });
                break;
            case "BUTTON":
                _.addEventListener("click", () => {
                    let _parent = _.parentElement,
                        _value = $("input", _parent).map(_ => _.value)[0],
                        _slide = _parent.getAttribute("_name");
                    switch (_slide) {
                        case "Room": _Send("Create", null); break;
                        default: _Send(_slide, _value); break;
                    }
                    _ShowLoad(true);
                });
                break;
        }
    });

    let _digits = $("#_Digits input");
    _digits.forEach((_, _index) => {
        let _next = _digits[_index + 1],
            _last = _digits[_index - 1],
            _create = $("button", _.parentElement.parentElement)[0];
        _.addEventListener("keydown", _event => {
            let _key = _event.key, _prevent = true;
            if (_key == "Tab") {
                _create.focus();
            } else if (_key.match(/^[0-9]$/)) {
                _.value = _event.key;
                if (_next) _next.select();
                else {
                    let _value = _digits.map(_ => _.value).join("");
                    _Send("Room", Number(_value)); _ShowLoad(true);
                }
            } else if (_key == "Backspace") {
                if (_.value) _.value = "";
                else if (_last) {
                    _last.value = "";
                    _last.focus();
                }
            } else _prevent = false;
            if (_prevent) _event.preventDefault();
        });
    });

    _Search.addEventListener("input", _ => {
        setTimeout((_, _value) => {
            if (_.value == _value)
                _Send("Games", _Search.value);
        }, 200, _Search, _Search.value);
        _ShowLoad(true);
    });
    _Search.addEventListener("keydown", _ => {
        if (_.key == "Enter") {
            let _game = $("._Game")[0];
            if (_game) _game.click();
            else _Send("Game", _Search.value);
        }
    });

    window.addEventListener("keydown", _ => {
        if (_.key == "Escape") _.preventDefault();
    });
}