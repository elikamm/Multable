var _Game = null, _Changed = false, _Window = null;

function _Initialize() {
    _Edit.addEventListener("click", () => _Show("_Edit"));
    _Upload.addEventListener("click", () => _Show("_Upload"));
    _Run.addEventListener("click", () => _SendDebug());
    
    _InitModal();

    let _sync = $("[_sync]");
    _sync.forEach(_node => {
        let _name = _node.getAttribute("_sync"),
            _other = _sync.filter(_ => _.getAttribute("_sync") == _name && _ != _node);

        if (_name == "_game")
            _node.addEventListener("keydown", _event => {
                setTimeout(() => _Send("Exist", _node.value), 0);
            });
    
        _node.addEventListener("input", () => {
            _other.forEach(_ => { _.value = _node.value; });
        });
    });
    _Hide.addEventListener("keydown", _ => {
        if (_.code == "Enter") _Hide.checked ^= 1;
    });

    window.addEventListener("keydown", _ => {
        if (_.metaKey || _.ctrlKey) {
            let _prevent = true;

            switch (_.code) {
                case "KeyE": _Show("_Edit"); break;
                case "KeyU": (_Game && _Changed) ? _SendUpload() : _Show("_Upload"); break;
                case "KeyR": _SendDebug(); break;
                default: _prevent = false;
            }

            if (_prevent) _.preventDefault();
            _Shortcuts(true);
        }
    });
    window.addEventListener("blur", () => _Shortcuts(false));
    window.addEventListener("keyup", _ => {
        if (!_.metaKey && !_.ctrlKey) _Shortcuts(false);
    });
    window.onbeforeunload = () => {
        if (_Changed) return "latest changes weren't uploaded";
    };

    _OnInitialize();
}

function _Shortcuts(_show) {
    $("u").forEach(_ => {
        _.style.textDecoration = _show ? "underline" : "";
    });
}

function _HandleModal(_name, _data) {
    switch (_name) {
        case "_Edit": _SendEdit(_data); break;
        case "_Upload": _SendUpload(); break;
    }
}

function _Change(_changed, _game = _Game) {
    _Edited.style.display = _changed ? "inline-block" : "";
    _Changed = _changed;
    if (_game) {
        _Name.innerText = _game; _Game = _game;
    }
}