var _Count = 0, _Current = "";
function _Slide(_name) {
    if (_Current == _name) return;
    _Current = _name;
    let _slides = $("[_name]"),
        _slide = $(`[_name=${_name}]`)[0],
        _visible = _Center.offsetParent;

    if (_name == "Game") _Send("Games", _Search.value);

    if (_slide) {
        _slides = _slides.filter(_ => _ != _slide);
        _Page.innerText = _slide.getAttribute("_page");

        with (_slide.style) {
            animation = `_Slide ${_visible ? "var(--_Slow)" : "0s"}`;
            display = "block";
            left = "";
        }
        with (_Center.style) {
            transition = "height var(--_Slow)";
            display = "block";
            animation = ""; 
            
            let _scale = parseFloat(getComputedStyle(document.body).fontSize); 
            height = `${_slide.offsetHeight / _scale}rem`;
        }
    } else _Center.style.display = "";
    _slides.forEach(_ => {
        with (_.style) {
            transition = "left var(--_Slow)";
            left = "calc(-100% + 1.6rem)";
        }
    });

    _Count++;
    setTimeout((_, _Center, _slides, _slide, _visible) => {
        if (_ == _Count) {
            if (_visible) _Focus(_slide);
            _Center.style.transition = "";
            _slides.forEach(_ => {
                with (_.style) {
                    transition = "";
                    display = "";
                }
            });
        }
    }, 250, _Count, _Center, _slides, _slide, _visible);
    if (!_visible) _Focus(_slide);
}

function _Reset(_name) {
    let _slide = $(`[_name=${_name}]`)[0];

    _Slide(_name);
    _Center.style.animation = "";
    _Center.offsetHeight;
    _Center.style.animation = "_Shake var(--_Slow)";
    $("input", _slide).forEach(_ => {
        _.value = "";
    });

    _Focus(_slide);
}

function _Focus(_slide) {
    $("[_focus]", _slide)[0].select();
}

function _ListGames(_list) {
    _Games.innerHTML = "";

    _list.forEach(_ => {
        let _game = document.createElement("button"),
            _name = document.createElement("h1"),
            _info = document.createElement("h2"),
            _plays = document.createElement("h3");
        
        _game.classList.add("_Game");
        _game.addEventListener("click", () => {
            _Send("Game", _.Name); _ShowLoad(true);
        });

        _name.innerText = _.Name;
        _info.innerText = _.Info;
        _plays.innerText = `${_.Plays} time${_.Plays == 1 ? "" : "s"} played`;
        _game.append(_name, _info, _plays);

        _Games.appendChild(_game);
    });
}