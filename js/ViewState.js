class ViewState {
    constructor(container, controller) {
        this.container = container;
        this.controller = controller;
        this.menu = 'default';
        this.comments = true;
        this.paint = false;
        this.share = false;
        this.error = false;
        this.preloader = false;
        this.nodes = {
            menubar: this.container.querySelector('ul.menu'),
            fileInput: document.createElement('input')
        };
        this.nodes.fileInput.type = 'file';
        this.nodes.fileInput.accept = 'image/*';
        this.events();
    }

    events() {
        this.nodes.menubar.addEventListener('click', (event) => {
            this.controller.comments.removeEmptyForms();
        });
        this.nodes.menubar.children[1].addEventListener('click', (e) => {
            this.menuSet('main');
        });
        this.nodes.menubar.children[3].addEventListener('click', (e) => {
            this.menuSet('standart');
        });
        this.nodes.menubar.children[5].addEventListener('click', (e) => {
            this.menuSet('paint');
        });
        this.nodes.menubar.children[7].addEventListener('click', (e) => {
            this.menuSet('share');
            this.createShareLink();
        });
        this.nodes.menubar.children[8].children[1].addEventListener('click', (e) => {
            const inputValue = e.target.parentElement.children[0].value;
            const input = document.createElement('span');
            input.innerText = inputValue;
            document.querySelector('body').appendChild(input);
            console.log(input);

            let range = document.createRange();
            range.selectNode(input);
            console.log(range);

            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                document.execCommand('copy');
            } catch (err) {
                console.log('Can`t copy');
            }
            document.querySelector('body').removeChild(input);
        });
        this.nodes.menubar.querySelectorAll('input.menu__toggle').forEach((el) => {
            el.addEventListener('click', (event) => {
                this.comments = !this.comments;
                this.controller.showHideComments(this.comments);
            })
        });
        this.nodes.menubar.children[2].addEventListener('click', (e) => {
            this.nodes.fileInput.click();
        });
        this.nodes.fileInput.addEventListener('change', (e) => {
            console.log('Добавлен новый файл через fileInput');
            const file = Array.from(this.nodes.fileInput.files)[0];
            console.log(file);
            this.addImage(file);
        })
    }

    //Добавит новое изображение в дерево
    addImage(file) {
        console.log('ViewState -> addImage');

        if (this.controller.currentImage) {
            const img = this.controller.currentImage;
            img.height = 638;
            img.src = URL.createObjectURL(file);
        } else {
            const img = document.createElement('img');
            this.controller.container.insertBefore(img, this.controller.container.children[3]);
            addClass('current-image', img);
            img.height = 638;
            img.src = URL.createObjectURL(file);
        }

        this.preloaderSet();
        sendFileFetch(file).then((data) => {
            this.preloaderSet();
            this.menuSet('main');
            console.log(data);
            localStorage.currentImage = JSON.stringify(data);
            this.controller.currentImage.src = data.url;
            localStorage.canvasNoFirstLoad = false;
            this.controller.standartStart();
        });
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
            };
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

        this.preloader = !this.preloader;
        showPreloader(this.preloader);

        function showPreloader(param = true) {
            console.log(`Вызов showPreloader`);
            let displayValue = param ? null : 'none';
            preloader.style.display = displayValue;
        }
    }

    //Вернет ссылку для поделиться
    createShareLink() {
        console.log('ViewState -> createShareLink');
        const link = window.location.href;
        const imageLink = encodeURIComponent(this.controller.currentImage.src);
        const imageId = JSON.parse(localStorage.currentImage).id;
        const result = link + '?' + 'id=' + imageId + '&' + 'url=' + imageLink;
        this.nodes.menubar.children[8].children[0].value = result;
        console.log(result);
        return result;
    }
}