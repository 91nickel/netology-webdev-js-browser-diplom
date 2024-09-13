class WS {
    constructor(controller) {
        this.controller = controller;
        if (localStorage.currentImage) {
            this.create();
        }
    }

    events() {
        this.connection.addEventListener('open', (event) => {
            console.log('WS соединение установлено');
        });
        this.connection.addEventListener('message', (event) => {
            console.log('Получено сообщение по WebSocket');
            console.log(event);
            console.log(JSON.parse(event.data));
            if (JSON.parse(event.data).event === 'comment' || JSON.parse(event.data).event === 'pic') {
                console.log('Comments refresh');
                this.controller.comments.parse(JSON.parse(event.data).pic);
            }
            if (JSON.parse(event.data).event === 'pic' || JSON.parse(event.data).event === 'mask') {
                console.log('Mask refresh');
                console.log(event);
                let link;
                if (JSON.parse(event.data).event === 'pic') {
                    link = JSON.parse(event.data).pic.mask;
                }
                if (JSON.parse(event.data).event === 'mask') {
                    link = JSON.parse(event.data).url;
                }
                this.controller.updateMask(link);
            }
            if (!localStorage.canvasNoFirstLoad || localStorage.canvasNoFirstLoad === 'false' && JSON.parse(event.data).event === 'mask') {
                console.log('Это первая отправка canvas');
                localStorage.canvasNoFirstLoad = true;
                this.create();
            }
        })
    }

    create() {
        this.getConnectionLink().then((data) => {
            console.log('Ссылка получена');
            this.createConnection(data);
        });
    }

    //Создает WebSocket соединение
    createConnection(link) {
        if (link) {
            this.connection = new WebSocket(link);
            this.events();
        }
    }

    //Получает id из localStorage до тех пор пока не получит. Возвращает полную ссылку
    getConnectionLink() {
        console.log('getImageId');
        return new Promise((resolve, reject) => {
            getLink();

            function getLink() {
                requestAnimationFrame(() => {
                    if (localStorage.currentImage) {
                        resolve('wss://neto-api.herokuapp.com/pic/' + JSON.parse(localStorage.currentImage).id);
                    } else {
                        console.log('Повторный запуск');
                        setTimeout(getLink(), 500);
                    }
                });
            }
        });
    }
}