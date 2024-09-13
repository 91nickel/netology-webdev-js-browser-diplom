'use strict';
console.log(`Hello World`);
const imageContainer = document.querySelector('.wrap.app');
const firstImage = imageContainer.querySelector('img.current-image');
const menubarItems = imageContainer.querySelectorAll('ul li');
const preloader = document.querySelector('.image-loader');
const formatError = document.querySelector('.error');

dragDrop();

class Controller {
    constructor(container = document.querySelector('.wrap.app')) {
        this.container = container;

        this.viewState = new ViewState(this.container, this);
        this.menubarMotion = new MovingElement(this.container.querySelector('.menu'));
        this.HTTP = new HTTP(this);
        this.WS = new WS(this);
        this.comments = new Comments(this.container, this);
        this.canvas = new DrawingMode(this.container, this);
        this.defaultStart();
        if (this.currentImage) {
            this.standartStart();
        }
        this.events();
    }

    events() {
        document.addEventListener('click', (event) => {
            console.log(event);
            if (this.viewStateValue !== 'standart'
                || event.target.classList.contains('comments__marker-checkbox')
                || event.target.classList.contains('comments__body')
                || event.target.classList.contains('comment')
                || event.target.tagName === 'INPUT'
                || event.target.tagName === 'TEXTAREA'
                || event.target.tagName === 'FORM') {
                console.log('Отказ');
            } else {
                console.log('Событие сработало');
                this.comments.closeFormAll();
                this.comments.removeEmptyForms();

                if (!event.target.classList.contains('menu__item-title')
                    && !event.target.classList.contains('menu__item')) {
                    this.comments.openCloseForm(this.comments.createForm(
                        event.clientY - this.currentImage.getBoundingClientRect().top,
                        event.clientX - this.currentImage.getBoundingClientRect().left
                    ));
                }
            }
        })
    }

    //Возвратит текущее состояние меню
    get viewStateValue() {
        return this.viewState.menu;
    }

    //Возвратит текущее изображение на странице
    get currentImage() {
        console.log('get .current-image');
        let image = this.container.querySelector('img.current-image');
        if (image) {
            return image;
        } else if (this.hasImageInStorage()) {
            image = document.createElement('img');
            image.height = 638
            image.classList.add('current-image');
            image.src = JSON.parse(localStorage.currentImage).url;
            this.container.insertBefore(image, this.container.querySelector('.comments__form'));
            return this.container.querySelector('img.current-image');
        }
    }

    //Управление canvas и масками
    //Отправит содержимое canvas на сервер
    sendCanvas() {
        console.log('Controller -> sendCanvas()');

        let data = this.canvas.canvasImage;
        data.toBlob(blob => {
            console.log(blob);
            this.WS.connection.send(blob);
        })
    }

    //Обновит маску изображения
    updateMask(link) {
        console.log('Controller -> updateMask()');
        this.canvas.updateMask(link);
        this.canvas.clearCanvas();
    }

    //Удалит canvas и маску
    removeCanvas() {
        this.canvas.removeCanvas();
    }

    //Управление комментариями
    sendComment(data) {
        console.log('Controller -> sendComment');

        const link = 'https://neto-api.herokuapp.com/pic/' + JSON.parse(localStorage.currentImage).id + '/comments';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.HTTP.send(data, link, headers).then((data) => {
            console.log('Получен ответ по HTTP');
            console.log(data);
            this.comments.parse(data);
        });
    }

    //Скрывает либо отображает комментарии
    showHideComments(value = false) {
        this.comments.viewHideFormAll(value);
    }

    //Задаст стартовые параметры
    defaultStart() {
        this.viewState.menuSet('default');
        if (this.hasImageIdInLink()) {
            console.log('Найдено изображение в теле ссылки');
            const data = this.hasImageIdInLink();
            console.log(data);

            const currentImage = {
                'id': data.id,
                'url': decodeURIComponent(data.url)
            };

            console.log(currentImage);
            localStorage.currentImage = JSON.stringify(currentImage);
            window.location.href = 'index.html';
        } else {
            console.log('Не найден ID изображения в теле ссылки');
        }
    }

    //Задаст стартовые параметры если данные в системе уже есть
    standartStart() {
        this.WS.create();
        this.viewState.menuSet('main');
        this.canvas.scaleCanvas();
    }

    //Проверит есть ли данные об изображении в теле ссылки
    hasImageIdInLink() {
        console.log('Controller -> hasImageIdInLink');
        const link = window.location.href;
        let array = link.split('?');
        if (array.length === 1) {
            return false;
        }
        if (array.length > 1) {
            array.splice(0, 1);
            array = array[0].split('&');

            array = array.map((el) => {
                const keyValue = el.split('=');
                const result = {};
                result[keyValue[0]] = keyValue[1];
                return result;
            });

            console.log(array);
            const result = {};
            array.forEach((el) => {
                for (let key in el) {
                    result[key] = el[key];
                }
            });
            return result;
        }
    }

    //Проверяет есть ли данные об изображении в localStorage
    hasImageInStorage() {
        if (localStorage.currentImage) {
            return true;
        }
    }

    //Очистит localStorage
    clearStorage() {
        console.log('ClearStorage');
        localStorage.clear();
    }
}

const controller = new Controller();