function $(_query, _element = document) {
    return [..._element.querySelectorAll(_query)];
}

function _Log(_message, _error) {
    let _log = document.createElement("div"), _time = 2500;
    _log.classList.add("_Pane");
    if (_error) {
        _log.classList.add("_LogError");
        _time = 4000;
    }

    _log.innerText = _message;
    _Logs.appendChild(_log);

    setTimeout(_ => {
        _.style.animation = "_LogHide var(--_Fast) forwards";
        setTimeout(_ => { _.remove(); }, 100, _);
    }, _time, _log);
}

var _Loading = true;
function _ShowLoad(_show) {
    _Loading = _show;
    if (_Loading)
        setTimeout(() => {
            if (_Loading) _Load.style.display = "";
        }, 100);
    else _Load.style.display = "none";
}

function _URL(_url, _push = false) {
    if (_push) window.history.pushState({}, "%Name%", _url);
    else window.history.replaceState({}, "%Name%", _url);
}
window.addEventListener("popstate", () => {
    window.location.reload();
});

function _InitModal() {
    $("[_name]").forEach(_ => {
        let _flows = $("[_flow]", _);
        _flows.forEach((_flow, _index) => {
            let _next = _flows[_index + 1];
            _flow.addEventListener("keydown", (_event) => {
                if (_event.key == "Enter" && _next && _flow.tagName != "BUTTON") {
                    _event.preventDefault();
                    if (_next.tagName == "BUTTON") _next.click();
                    else _next.select();
                }
            });
        });
        $("[_exit]", _)[0].addEventListener("click", _event => {
            _.close();
        });
        $("button[_flow]", _)[0].addEventListener("click", _event => {
            _HandleModal(
                _.getAttribute("_name"),
                $("input[_flow],textarea[_flow]", _).map(_ => _.value)
            );
        });
    });
}

function _Show(_name) {
    $("[_name]").forEach(_ => {
        if (_.open) _.close();
    });
    if (_name) {
        let _modal = $(`[_name=${_name}]`)[0];
        _modal.showModal();
        $("[_focus]", _modal)[0].select();
    }
}