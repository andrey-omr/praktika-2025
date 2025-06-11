//#region Глобальные переменные
const host = 'http://api-messenger.web-srv.local';
const CONTENT = document.querySelector('.content');
const INTERVAL_UPDATE_MSG =200;
const INTERVAL_UPDATE_CHATS = 200;
var CURRENT_CHAT;
var TIMER_UPDATE_MSG;
//#endregion

function getToken() {
    let token = localStorage.getItem("token")
    if (token) {
        return token
    } else {
        return ''
    }
}

function setToken(token) {
    localStorage.setItem("token", token)
}

//#region AJAX запрос
function _get(params, callback) {
    let get = new XMLHttpRequest();
    get.open('GET', `${params.url}`);
    get.setRequestHeader("Authorization", "Bearer " + getToken())
    get.send();
    get.onreadystatechange = function () {
        if (get.readyState == 4) {
            callback(get.responseText)
            if (get.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
        }
    };
}
function _post(params, callback) {
    let post = new XMLHttpRequest();
    post.open('POST', `${params.url}`);
    post.setRequestHeader("Authorization", "Bearer " + getToken())
    post.send(params.data);
    post.onreadystatechange = function () {
        if (post.readyState == 4) {
            callback(post.responseText)
            if (post.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
            if (post.status == 422) {
                alert('Пользователь с данным e-mail уже сущесвует')
                onLoadChoise()
            }
        }
    };
}
function _put(params, callback) {
    let put = new XMLHttpRequest();
    put.open('POST', `${params.url}`);
    put.setRequestHeader("Authorization", "Bearer " + getToken())
    put.send(params.data);
    put.onreadystatechange = function () {
        if (put.readyState == 4) {
            callback(put.responseText)
            if (put.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
        }
    };
}
function _delete(params, callback) {
    let del = new XMLHttpRequest();
    del.open('DELETE', `${params.url}`, false);
    del.setRequestHeader("Authorization", "Bearer " + getToken())
    del.send();
    del.onreadystatechange = function () {
        if (del.readyState == 4) {
            callback(del.responseText)
            if (del.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
        }
    };
}
//#endregion


function blinkError(selector) {
    const TIMEOUT_BLINK = 300;
    document.querySelectorAll(selector).forEach(element => {
        element.classList.toggle('error')
        setTimeout(() => {
            element.classList.toggle('error')
            setTimeout(() => {
                element.classList.toggle('error')
                setTimeout(() => {
                    element.classList.toggle('error')
                }, TIMEOUT_BLINK);
            }, TIMEOUT_BLINK);

        }, TIMEOUT_BLINK);

    });
}


//#region Функционал
function _elem(selector) {
    return document.querySelector(selector)
}

onLoadChoise()

function onLoadChoise() {
    var get_choise = new XMLHttpRequest();
    get_choise.open('GET', 'modules/choise.html');
    get_choise.send()
    get_choise.onreadystatechange = function () {
        if (get_choise.readyState == 4) {
            CONTENT.innerHTML = this.responseText

            onLoadAuthorize(), onLoadRegist()
        }
    }
}

function onLoadAuthorize() {
    _elem('.choise-auth').addEventListener('click', function () {
        let get_auth = new XMLHttpRequest();
        get_auth.open('GET', 'modules/auth.html');
        get_auth.send()
        get_auth.onreadystatechange = function () {
            if (get_auth.readyState == 4) {
                CONTENT.innerHTML = this.responseText

                onLoadAuth()
            }
        }
    });
}

function onLoadAuth() {
    _elem('.authorize').addEventListener('click', function () {
        let request_auth = new FormData();
        request_auth.append('email', _elem('input[name="email"]').value);
        request_auth.append('pass', _elem('input[name="pass"]').value);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/auth`);
        xhr.setRequestHeader("Authorization", "Bearer " + getToken())
        xhr.send(request_auth);
        xhr.onreadystatechange = function () {
        // if (xhr.readyState == 4) {
            setToken(JSON.parse(xhr.responseText).Data.token)

            let get_auth = new XMLHttpRequest();
            get_auth.open('GET', 'modules/main.html');
            get_auth.send()
            get_auth.onreadystatechange = function () {
                if (get_auth.readyState == 4) {
                    CONTENT.innerHTML = this.responseText

                    onLoadMain(response);
                    logoutMain()
                }
            }
            // _get({ url: 'modules/main.html' }, function (response) {
            //     CONTENT.innerHTML = response
            //     onLoadMain(response);
            //     logoutMain()
            // })
            if (xhr.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
            if (xhr.status == 422) {
                alert('Пользователь с данным e-mail уже сущесвует')
                onLoadChoise()
            }
        // }
        };
        // _post({ url: `${host}/auth`, data: request_auth }, function (response) {
        //     responseA = JSON.parse(response)
            // _get({ url: 'modules/main.html' }, function (response) {
            //     CONTENT.innerHTML = response
            //     onLoadMain(responseA), logoutMain()
            // })
        // })
    })
}

function onLoadRegist() {
    _elem('.choise-regist').addEventListener('click', function () {
        let get_regist = new XMLHttpRequest();
        get_regist.open('GET', 'modules/regist.html');
        get_regist.send()
        get_regist.onreadystatechange = function () {
            if (get_regist.readyState == 4) {
                CONTENT.innerHTML = this.responseText

                onLoadReg()
            }
        }
    });
}

function onLoadReg() {
    _elem('.go-reg').addEventListener('click', function () {
        const email = _elem('.regist-block input[name="email"]').value;
        const pass = _elem('.regist-block input[name="pass"]').value;
        const fam = _elem('.regist-block input[name="fam"]').value;
        const name = _elem('.regist-block input[name="name"]').value;
        const otch = _elem('.regist-block input[name="otch"]').value;

        if (email.length == 0) {
            blinkError('.regist-block input[name="email"]');
            return;
        }
        if (pass.length == 0) {
            blinkError('.regist-block input[name="pass"]');
            return;
        }

        if (fam.length == 0) {
            blinkError('.regist-block input[name="fam"]');
            return;
        }

        if (name.length == 0) {
            blinkError('.regist-block input[name="name"]');
            return;
        }

        if (otch.length == 0) {
            blinkError('.regist-block input[name="otch"]');
            return;
        }

        let request_reg = new FormData();
        request_reg.append('email', email);
        request_reg.append('pass', pass);
        request_reg.append('fam', fam);
        request_reg.append('name', name);
        request_reg.append('otch', otch);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/user`, false);
        xhr.send(request_reg)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log(xhr.responseText)
                _get({ url: 'modules/main.html' }, function (response) {
                        CONTENT.innerHTML = response
                        onLoadMain(response);
                        logoutMain()
                    })
                if (xhr.status != 200) {
                    {
                        setToken(JSON.parse(xhr.responseText).Data.token);
                    }
                    // _get({ url: 'modules/main.html' }, function (response) {
                    //     CONTENT.innerHTML = response
                    //     onLoadMain(response);
                    //     logoutMain()
                    // })
                }
            }
        }
    })
}

function onLoadMain(authdata) {
//
    console.log(authdata)
    let img = document.createElement('img');
    img.src = `${host}/files/photos/default_men.png`;
    _elem('.main-img').append(img);
    let p_text = document.createElement('p');
    p_text.append(authdata.Data.name);
    _elem('.main-name').append(p_text);
//

    let url_chats = `${host}/chats`

    let get = new XMLHttpRequest();
    get.open('GET', url_chats);
    get.setRequestHeader("Authorization", "Bearer " + getToken())
    get.send();
    get.onreadystatechange = function () {

        if (get.readyState == 4) {
            callback(get.responseText)

            response.forEach(element => {
            let chat_block = document.getElementById(`chat_${element.chat_id}`)
            if (!chat_block) {
                _elem('.chat-block').append(makeChatBlock(element))
            } else {
                if (chat_block.getAttribute('last-msg') != element.chat_last_message) {
                    chat_block.style = 'background-color:red'
                }
            }
        });

            if (get.status == 401) {
                onLoadChoise()
                alert('Ошибка входа')
            };
        }

    };
    // _get({url: url_chats}, function onLoadChats(response) {
    //     console.log(response);
        // response.forEach(element => {
        //     let chat_block = document.getElementById(`chat_${element.chat_id}`)
        //     if (!chat_block) {
        //         _elem('.chat-block').append(makeChatBlock(element))
        //     } else {
        //         if (chat_block.getAttribute('last-msg') != element.chat_last_message) {
        //             chat_block.style = 'background-color:red'
        //         }
        //     }
        // });
    // })
}

function makeChatBlock(chatdata) {
    let chatBlock = document.createElement('div');
    chatBlock.classList.add('.chat-block');
    chatBlock.id = `chat_${chatdata.chat_id}`
    let chatimg = document.createElement('img');
    chatimg.scr = host + chatdata.companion._photo_link
    chatBlock.append(chatimg);
    let chatname = document.createElement('p');
    chatname.textContent = chatdata.chat_name
    chatBlock.append(chatname)

    chatBlock.setAttribute('last-msg', chatdata.chat_last_message)

    chatBlock.onclick = function() {
        CURRENT_CHAT = chatdata.chat_id;

        this.style = ''
        if (Array.isArray(_elem('.chat-block'))) {
            _elem('.chat-block').forEach(element => {
                element.classList.remove('active')
            });
        } else {
            _elem('.chat-block').classList.remove('active')
        }

        this.classList.add('active')

        clearInterval(TIMER_UPDATE_MSG)

        _elem('.message-block').innerHTML = '';
        loadMessages(chatdata.chat_id)
        TIMER_UPDATE_MSG = setInterval(() => {
            loadMessages(chatdata.chat_id)
        }, INTERVAL_UPDATE_MSG);

        _elem('.message-block').classList.remove(hidden)
        _elem('.new-message-block').classList.remove(hidden)
    }
    return chatBlock;
}

function loadMessages(chat_id) {
    let url_chats = `${host}/chats`

    _get({url: url_chats}, function (message) {
        message.forEach(element => {
            let msg_block = document.getElementById(`msg_${element.id}`)
            if (!msg_block) {
                _elem('.message-block').append(
                    makeMsg(element)
                )
            }
        });
    })
}

function getUserID() {
    let id = localStorage.getItem("_UserID");
    if (id) {
        return id
    } else {
        return '';
    }
}

function setUserID(id) {
    localStorage.setItem("_UserID", id);
}

function makeMsg(messages) {
    log(messages)
    let msgBlock = document.createElement('div')
    msgBlock.classList.add('msg')
    messages.sender.id == getUserID() ? msgBlock.classList.add('msg-my') : msgBlock.classList.add('msg-me')
    msgBlock.id = `msg_${messages.id}`

    let msgSender = document.createElement('h4')
    msgSender.textContent = `${messages.sender.name} ${messages.sender.otch} ${messages.sender.fam}`
    msgBlock.append(msgSender)

    let msgText = document.createElement('p')
    msgText.textContent = `${messages.text}`
    msgBlock.append(msgText)

    let msgDatetime = document.createElement('p')
    msgDatetime.classList.add('datetime')
    msgDatetime.textContent = `${messages.datetime_create}`
    msgBlock.append(msgDatetime)

    return msgBlock;
}

function logoutMain() {
    _elem('.logout').addEventListener('click', function () {
        let fdata = new FormData();

        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${host}/auth`);
        xhr.setRequestHeader("Authorization", "Bearer " + getToken())
        xhr.send(fdata);
        xhr.onreadystatechange = function () {

            setToken(JSON.parse(xhr.responseText).Data.token)

            if (xhr.readyState == 4) {
                    callback(xhr.responseText)
                if (xhr.status == 401) {
                    onLoadChoise()
                    alert('Ошибка входа')
                };
            }
        };
    })
}
//#endregion