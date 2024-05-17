var _Dragging = null;

function _Clear() {
    _Items.innerHTML = "";
}

function _Update(_data) {
    let _found = false;

    $("._Item", _Items).forEach(_item => {
        if (_item.getAttribute("_id") == _data.ID) {
            _Position(_item, _data);
            _found = true;
        }
    });

    if (!_found) {
        let _item = document.createElement("div");
        _item.classList.add("_Item");
        _item.addEventListener("mousedown", (_event) => {
            if (_event.button == 0) {
                _Dragging = _item;
                with (_item.style) {
                    transition = "none";
                    zIndex = "2";
                }
                _Drag(_Convert(_event));
            }
        });

        _item.innerHTML = `<img src="/assets/item/${_data.Type}.png">`;
        _item.setAttribute("_id", _data.ID);
        _Position(_item, _data);

        _Items.appendChild(_item);
    }
}

function _Change(_data) {
    let _id = _data[0],
        _type = _data[1];
    $("._Item", _Items).forEach(_item => {
        if (_item.getAttribute("_id") == _id) {
            let _img = $("img", _item)[0], _path = `/assets/item/${_type}.png`;
            if (!_img.src.endsWith(_path)) {
                with (_img) {
                    style.animation = ""; offsetHeight;
                    style.animation = "_Turn var(--_Fast)";
                }
                setTimeout(() => { _img.src = _path; }, 100);
            }
        }
    });
}

function _Position(_item, _data) {
    let _left = `${(_data.Position[0] / 100) * 92 + 4}%`,
        _top = `${(_data.Position[1] / 100) * 92 + 4}%`;
    _item.setAttribute("_x", _left); _item.setAttribute("_y", _top);
    with (_item.style) {
        transform = `translate(-50%,-50%) rotate(${_data.Rotation}deg)`;
        if (_Dragging != _item) {
            left = _left; top = _top;
        }
    }
}

function _Remove(_id) {
    $("._Item", _Items).forEach(_item => {
        if (_item.getAttribute("_id") == _id) {
            if (_item == _Dragging) _Dragging = null;
            _item.remove();
        }
    });
}