window.onload = () => {
    _Initialize();
    _Connect();
}

var _Socket = null, _First = true;
function _Connect() {
    let _url = window.location.origin;
    _url = _url.replace("http", "ws");

    _Socket = new WebSocket(_url);
    _Socket.onopen = () => {
        _HandleOpen(_First);
    }

    _Socket.onclose = () => {
        _HandleClose(_First);
        setTimeout(_Connect, 1000);
        _Socket = null, _First = false;
    }

    _Socket.onmessage = _ => {
        let _key, _value = _.data;
        _value = JSON.parse(
            _value.replace(/^\w*/, _match => {
                _key = _match; return "";
            })
        );

        _HandleMessage(_key, _value);
    }
}

function _Send(_key, _value) {
    if (_Socket && _Socket.readyState == WebSocket.OPEN) {
        let _data = `${_key} ${JSON.stringify(_value)}`;
        _Socket.send(_data);
    }
}