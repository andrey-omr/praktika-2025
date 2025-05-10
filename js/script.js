//#region Глобальные переменные
const HOST = 'http://api-messenger.web-srv.local';
const CONTENT = document.querySelector('.content');
//#endregion

//#region AJAX запрос
function _get(params, callback) {
    let get = new XMLHttpRequest();

    get.open('GET', `${params.url}`);
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

_get({ url: 'modules/auth.html' }, function (response) {
    CONTENT.innerHTML = response;

    onLoadAuth()
})

function onLoadAuth() {
    _elem('.authorize').addEventListener('click', function() {
        let request_auth = new FormData();
        request_auth.append('email', _elem('input[name="email"]').value);
        request_auth.append('password', _elem('input[name="password'))
    });
    onLoadRegistration();
}
function onLoadRegistration() {
    _elem('.regist').addEventListener('click', function() {
        _get({url: 'modules/regist.html'}, function(response) {
            CONTENT.innerHTML = response;
            onLoadReg()
        });
    });
}

function onLoadReg() {
    _elem('.go-reg').addEventListener('click', function() {
        let request_reg = new XMLHttpRequest();
        request_reg.append('email', _elem('input[name="email"]').value);
        request_reg.append('pass', _elem('input[name="password"]').value);
        request_reg.append('fam', _elem('input[name="last-name"]').value);
        request_reg.append('name', _elem('input[name="first-name"]').value);
        request_reg.append('otch', _elem('input[name="otch"]').value);

        _post({url: `${HOST}/user`, data: request_reg}, function(response) {
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