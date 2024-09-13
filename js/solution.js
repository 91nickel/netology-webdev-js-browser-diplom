'use strict';
console.log(`Hello World`);
const imageContainer = document.querySelector('.wrap.app');
const firstImage = imageContainer.querySelector('.current-image');
const menubarItems = imageContainer.querySelectorAll('ul li');
const preloader = document.querySelector('.image-loader');
const formatError = document.querySelector('.error');

dragDrop();

class ViewState {
    constructor(menu = 'default', comments = true, paint = false, share = false, error = false, preloader = false) {
        this.menu = menu;
        this.comments = comments;
        this.paint = paint;
        this.share = share;
        this.error = error;
        this.preloader = preloader;
        this.nodes = {
            menubar: document.querySelector('ul.menu')
        }
        this.events();
    }
    events() {
        this.commentForms.forEach((el) => {
            el.addEventListener('click', this.commentOpen.bind(this));
        })
        this.nodes.menubar.children[1].addEventListener('click', (e) => {
            this.menuSet('main');
        })
        this.nodes.menubar.children[3].addEventListener('click', (e) => {
            this.menuSet('standart');
        })
        this.nodes.menubar.children[5].addEventListener('click', (e) => {
            this.menuSet('paint');
        })
        this.nodes.menubar.children[7].addEventListener('click', (e) => {
            this.menuSet('share');
        })
    }
    //Отображает меню в зависимости от состояния
    menuSet(state = 'default') {
        this.menu = state;
        clearMenu();
        showMenu(this.menu)();

        // В зависимости от переданного параметра разворачивает меню в требуемое состояние
        function showMenu(param = 'default') {
            console.log(`Вызов Show Menu`);
            const modes = {
                'default': function () {
                    console.log(`default`);
                    menubarItems.forEach((el, i) => {
                        if (i < 3) {
                            el.style.display = 'inline-block';
                        }
                    })
                },
                'main': function () {
                    console.log('main');
                    menubarItems.forEach((el, i) => {
                        if (i === 0 || i === 2 || i === 3 || i === 5 || i === 7) {
                            el.style.display = 'inline-block';
                        }
                    })
                },
                'standart': function () {
                    console.log('standart');
                    menubarItems.forEach((el, i) => {
                        if (i < 5) {
                            el.style.display = 'inline-block';
                        }
                    })
                },
                'paint': function () {
                    console.log('paint');
                    menubarItems.forEach((el, i) => {
                        if (i < 2 || i === 5 || i === 6) {
                            el.style.display = 'inline-block';
                        }
                    })
                },
                'share': function () {
                    console.log('share');
                    menubarItems.forEach((el, i) => {
                        if (i < 2 || i > 6) {
                            el.style.display = 'inline-block';
                        }
                    })
                },
                'all': function () {
                    console.log('all');
                    menubarItems.forEach((el) => {
                        el.style.display = 'inline-block';
                    })
                }
            }

            return modes[param];
        }

        // Полностью скрывает меню
        function clearMenu() {
            console.log(`Вызов функции Clear Menu`);
            menubarItems.forEach((el) => {
                el.style.display = 'none';
            })
        }

    }
    //Отображает или скрывает комментарии
    commentsSet() {
        this.comments = this.comments ? false : true;
        showComments(this.comments, this.commentForms);

        //В зависимости от переданного параметра скрывает или отображает комментарии
        function showComments(param = false, nodelist) {
            console.log(`Вызов showComments`);
            const displayStyle = param ? null : 'none';
            nodelist.forEach((el) => {
                el.style.display = displayStyle;
            });
        }
    }
    //Откроет переданную форму и закроет все остальные
    commentOpen(event) {
        closeForms(this.commentForms);
        openForm(event.currentTarget);

        //Закроет все формы в списке
        function closeForms(nodelist) {
            console.log(`Вызов closeForms`);
            nodelist.forEach((el) => {
                el.children[1].removeAttribute('checked');
                el.children[2].style.display = 'none';
            })
        }
        //Откроет переданную форму
        function openForm(node) {
            console.log(`Вызов openForm`);
            const input = node.children[1];
            const div = node.children[2];
            if (input.hasAttribute('checked')) {
                input.removeAttribute('checked');
            } else {
                input.setAttribute('checked', '');
            }

            if (div.style.display === 'block') {
                div.style.display = '';
            } else {
                div.style.display = '';
            }
        }
    }
    //На три секунды вызовет показ сообщения об ошибке в зависимости от параметра
    errorSet(type) {
        this.error = type;
        showError(this.error);
        //В зависимости от переданного параметра отображает одно из двух возможных уведомлений об ошибке
        function showError(param = true) {
            console.log(`Вызов showError`);
            let displayStyle = 'inherit';
            const p = formatError.querySelector('p');
            let innerText = param ? `Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.` : `Чтобы загрузить новое изображение, пожалуйста воспользуйтесь пунктом "Загрузить новое" в меню.`;

            p.innerText = innerText;
            formatError.style.display = displayStyle;

            setTimeout(() => {
                formatError.style.display = 'none';
                console.log('Блок ошибки скрыт');
            }, 3000);
        }
    }
    //Отображает и скрывает прелоадер
    preloaderSet() {

        this.preloader = this.preloader ? false : true;
        showPreloader(this.preloader);

        function showPreloader(param = true) {
            console.log(`Вызов showPreloader`);
            let displayValue = param ? null : 'none';
            preloader.style.display = displayValue;
        }
    }
    get commentForms() {
        return document.querySelectorAll('.wrap .comments__form');
    }
}

class MovingElement {
    constructor(container = document.querySelector('.menu')) {
        this.container = container;
        this.movingElement = null;
        this.onMoving = false;
        this.left = this.container.getBoundingClientRect().left;
        this.top = this.container.getBoundingClientRect().top;
        this.shift = {
            x: this.container.children[0].getBoundingClientRect().width / 2,
            y: this.container.children[0].getBoundingClientRect().height / 2
        }
        this.events();
    }
    events() {
        console.log(this.container);
        document.addEventListener('mousedown', (e) => {
            if (e.target === this.container.children[0]) {
                console.log(`MouseDown`);
                this.onMoving = true;
                this.movingElement = this.container;
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (this.onMoving) {
                console.log(`MouseMove`);
                //console.log(`Регистрация движения`);
                this.changePosition(this.container, this.shift, e);
            }
        });
        document.addEventListener('mouseup', (e) => {
            console.log(`MouseUp`);
            this.onMoving = false;
            this.movingElement = null;
            //console.log(this);
        });
    }
    changePosition(element = this.container, shift = {
        x: 0,
        y: 0
    }, event) {
        let left = event.clientX - shift.x;
        let top = event.clientY - shift.y;
        left = left < 0 ? 0 : left;
        top = top < 0 ? 0 : top;
        left = left + element.getBoundingClientRect().width > window.innerWidth ? window.innerWidth - element.getBoundingClientRect().width : left;
        top = top + element.getBoundingClientRect().height > window.innerHeight ? window.innerHeight - element.getBoundingClientRect().height : top;
        requestAnimationFrame(() => {
            element.style.left = left + 'px';
            element.style.top = top + 'px';
        })
    }
}

//Задает параметры получения файла через drag&drop
function dragDrop() {
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        console.log(file);
        const imageTypeRegExp = /^image\//;

        try {
            if (!imageTypeRegExp.test(file.type)) {
                throw ('Ошибка типа файла!');
            }
            console.log('Файл прошел проверку');
        } catch (e) {
            file = null;
            console.error(e);
            viewState.errorSet();
        }

        if (file) {
            const img = document.createElement('img');
            addClass('current-image', img);
            img.src = URL.createObjectURL(file);
            imageContainer.appendChild(img);
            menubarItems.forEach(el => {
                el.classList.display = 'inherit';
            })
            sendFile(file).then((request) => {
                console.log(request);
                viewState.menuSet('full');
            });
        }
    });
}

//Принимает файл и отправляет его на сервер
function sendFile(file) {
    return new Promise(function (resolve, reject) {

        const xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "https://neto-api.herokuapp.com/pic",
            true
        );
        xhr.setRequestHeader('Content-type', 'multipart/formdata');
        const form = new FormData();
        form.append('title', 'Image from 91nickel')
        form.append('image', file);
        setTimeout(() => {
            xhr.send(form);
        }, 20)

        xhr.addEventListener('loadstart', () => {
            console.log(`Загрузка началась`);
            viewState.preloaderSet();
        });

        xhr.addEventListener('load', () => {
            viewState.preloaderSet();
            //console.log(xhr.responseText);
            resolve(xhr.responseText);
        });
    });

}

const addClass = (className, context) => context.classList.add(className),
    removeClass = (className, context) => context.classList.remove(className),
    hasClass = (className, context) => context.classList.contains(className);

const viewState = new ViewState();
const movingMenu = new MovingElement();

imageContainer.removeChild(firstImage);

if (!imageContainer.querySelector('img')) {
    console.log(`Загрузка по умолчанию`);
    viewState.menuSet('default');
}

//Переключение события комментария
imageContainer.querySelectorAll('input.menu__toggle').forEach((el) => {
    el.addEventListener('click', (e) => {
        viewState.commentsSet();
    })
})