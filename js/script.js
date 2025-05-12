//#region Глобальные переменные
const host = 'http://api-messenger.web-srv.local ';
const CONTENT = document.querySelector('.content');
//#endregion

var token = ''

//#region AJAX запрос
function _get(params, callback) {
    let get = new XMLHttpRequest();
    get.open('GET', `${params.url}`);
    get.setRequestHeader( "Authorization", "bearer" + token )
    get.send();
    get.onreadystatechange = function () {
        if (get.readyState == 4) {
            callback(get.responseText);
        }
    };
}
function _post(params, callback) {
    let post = new XMLHttpRequest();
    post.open('POST', `${params.url}`);
    post.setRequestHeader( "Authorization", "bearer" + token )
    post.send(params.data);
    post.onreadystatechange = function () {
        if (post.readyState == 4) {
            callback(post.responseText);
        }
    };
}
//#endregion

//#region Функционал
function _elem(selector) {
    return document.querySelector(selector)
}

var get_auth = new XMLHttpRequest();
get_auth.open('GET', 'modules/auth.html');
get_auth.send()
get_auth.onreadystatechange = function() {
    if (get_auth.readyState == 4) {
        CONTENT.innerHTML = this.responseText

        onLoadAuth()
    }
}

function onLoadAuth() {
    _elem('.authorize').addEventListener('click', function() {
        let request_auth = new FormData();
        request_auth.append('email', _elem('input[name="email"]').value);
        request_auth.append('pass', _elem('input[name="password"]').value);

        _post({url: `${host}/auth/`, data: request_auth}, function(response) {
        response = JSON.parse(response);
        console.log(response);

        if(response.success) {
            _get({ url: '/modules/main.html' }, function (response) {
                CONTENT.innerHTML = response;
                onLoadMain()
                });
            };
        });
    });
    _elem('.regist').addEventListener('click', function() {
    var get_reg = new XMLHttpRequest();
    get_reg.open('GET', 'modules/regist.html');
    get_reg.send()
    get_reg.onreadystatechange = function() {
        if (get_reg.readyState == 4) {
            CONTENT.innerHTML = this.responseText

            onLoadReg()
        }
    }
    });
}

function onLoadReg() {
    _elem('.go-reg').addEventListener('click', function() {
        let request_reg = new FormData();
        request_reg.append('email', _elem('input[name="email"]').value);
        request_reg.append('pass', _elem('input[name="password"]').value);
        request_reg.append('fam', _elem('input[name="fam"]').value);
        request_reg.append('name', _elem('input[name="name"]').value);
        request_reg.append('otch', _elem('input[name="otch"]').value);

        _post({url: `${host}/user`, data: request_reg}, function(response) {
            response = JSON.parse(response);
            console.log(response);

            if(response.success) {
                _get({ url: '/modules/main.html' }, function (response) {
                    CONTENT.innerHTML = response;
                    onLoadMain()
                });
            };
        });
    });
}
//#endregion