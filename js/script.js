//#region Глобальные переменные
const host = 'http://api-messenger.web-srv.local';
const CONTENT = document.querySelector('.content');
//#endregion

var token = ''

//#region AJAX запрос
function _get(params, callback) {
    let get = new XMLHttpRequest();
    get.open('GET', `${params.url}`);
    get.setRequestHeader("Authorization", "bearer" + token)
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
    post.setRequestHeader("Authorization", "bearer" + token)
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

var get_choise = new XMLHttpRequest();
get_choise.open('GET', 'modules/choise.html');
get_choise.send()
get_choise.onreadystatechange = function() {
    if (get_choise.readyState == 4) {
        CONTENT.innerHTML = this.responseText

        onLoadAuthorize(), onLoadRegist()
    }
}

function onLoadAuthorize() {
    _elem('.choise-auth').addEventListener('click', function() {
        let get_auth = new XMLHttpRequest();
        get_auth.open('GET', 'modules/auth.html');
        get_auth.send()
        get_auth.onreadystatechange = function() {
            if (get_auth.readyState == 4) {
                CONTENT.innerHTML = this.responseText

                onLoadAuth()
            }
        }
    });
}

function onLoadAuth() {
    _elem('.authorize').addEventListener('click', function() {
        let request_auth = new FormData();
        request_auth.append('email', _elem('input[name="email"]').value);
        request_auth.append('pass', _elem('input[name="pass"]').value);

        _post({url: `${host}/auth`, data: request_auth}, function(response) {
            response = JSON.parse(response);
            console.log(response);

            _get({url: 'modules/main.html'}, function(response) {
                CONTENT.innerHTML = response
                onLoadMain()
            })
        })
    })
}

function onLoadRegist() {
    _elem('.choise-regist').addEventListener('click', function() {
        let get_regist = new XMLHttpRequest();
        get_regist.open('GET', 'modules/regist.html');
        get_regist.send()
        get_regist.onreadystatechange = function() {
            if (get_regist.readyState == 4) {
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
        request_reg.append('pass', _elem('input[name="pass"]').value);
        request_reg.append('fam', _elem('input[name="fam"]').value);
        request_reg.append('name', _elem('input[name="name"]').value);
        request_reg.append('otch', _elem('input[name="otch"]').value);

        _post({url: `${host}/user`, data: request_reg}, function(response) {
            response = JSON.parse(response);
            console.log(response);

            if(response.success) {
                _get({url: 'modules/main.html'}, function(response) {
                    CONTENT.innerHTML = response
                    onLoadMain()
                })
            }
        })
    })
}

function onLoadMain() {
    _elem('.chats').addEventListener('click', function() {
    })
}
//#endregion