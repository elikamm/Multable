function _Initialize() {
    
}

function _HandleOpen(_first) {
    if (_first) {
        _ShowLoad(false);
    } else window.location.reload();
}

function _HandleMessage(_key, _value) {
    
}

function _HandleClose(_first) {
    _ShowLoad(true);
}