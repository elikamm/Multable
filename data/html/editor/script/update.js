function _UpdateCode() {
    let _code = _Input.value,
        _replace = "";

    _code = _code.replace(/[&<>]/g, (_match) => {
        switch (_match) {
            case "&": _replace = "&amp;"; break;
            case "<": _replace = "&lt;"; break;
            case ">": _replace = "&gt;"; break;
        }
        return `<span>${_replace}</span>`;
    });
    
    _code = _Tag(_code, /#.*(?=\n|$)/g, "c_comment");
    _code = _Tag(_code, /"(?:[^"\\]|\\.)*"/g, "c_string");
    _code = _Tag(_code, /'(?:[^'\\]|\\.)*'/g, "c_string");
    _code = _Tag(_code, /(\n|^)( )*(on|if|elif|else|while|for)/g, "c_branch");
    _code = _Tag(_code, /\w*(?=\()/g, "c_command");
    _code = _Tag(_code, /\.{0,1}\b\d*\b/g, "c_number");
    _code = _Tag(_code, /\w+/g, "c_variable");

    if (_code == "") _code = "<c_help>write your code here..</c_help>";
    _Code.innerHTML = _code;

    let _lines = "";
    for (let i = 0; i < _code.split("\n").length; i++) {
        let _line = (i + 1) % 100;
        _lines += `${String(_line).padStart(2, " ")}<br>`;
    }
    _Lines.innerHTML = _lines;
}

function _Tag(_code, _regex, _tag) {
    return _code.replace(_regex, (_match, _position) => {
        let _valid = true, _pre = _code.substring(0, _position);

        _valid = _valid && !_pre.match(/<[^>]*$/);
        _valid = _valid && !_pre.match(/<[^\/<]*>[^<]*$/);
        _valid = _valid && !_match.includes("<");

        return _valid ? `<${_tag}>${_match}</${_tag}>` : _match;
    });
}

function _UpdateCaret() {
    let _lines = _Input.value.substring(0, _Input.selectionEnd).split("\n"),
        _top = _lines.length - 1, _line = _lines[_lines.length - 1];

    _Query = _GetLast(); _Send("Search", _Query);

    _Caret.style.top = `${_top * 1.9}rem`;
    _Measure.innerText = _line;
    with (_Caret) {
        style.left = `${_ToRem(_Measure.offsetWidth)}rem`;
        style.animation = "none"; offsetHeight;
        style.animation = "";
    }
}

function _UpdateScroll() {
    let _top = _ToRem(_Input.scrollTop),
        _left = _ToRem(_Input.scrollLeft);

    _Display.style.transform = `translate(-${_left}rem, -${_top}rem)`;
    _Lines.style.transform = `translateY(-${_top}rem)`;
}

function _ToRem(_pixel) {
    let _scale = parseFloat(getComputedStyle(document.body).fontSize); 
    return (_pixel / _scale);
}