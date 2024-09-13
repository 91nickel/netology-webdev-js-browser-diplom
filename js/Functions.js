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
            controller.viewState.errorSet();
        }

        if (file) {
            controller.viewState.addImage(file);
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
        //xhr.setRequestHeader('Content-type', 'multipart/formdata');
        const form = new FormData();
        form.append('title', file.name)
        form.append('image', file);

        console.log(file);
        for (const [k, v] of form) {
            console.log(k + ': ' + v);
        }

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

function sendFileFetch(file, resource = 'https://neto-api.herokuapp.com/pic') {

    const form = new FormData();
    form.append('title', file.name);
    form.append('image', file);
    /*
        console.log(file);
        for (const [k, v] of form) {
            console.log(k + ': ' + v);
        }
    */
    return fetch(resource, {
        body: form,
        credentials: 'same-origin',
        method: 'POST',
    }).then((res) => {
        return res.json();
    })
}

const addClass = (className, context) => context.classList.add(className),
    removeClass = (className, context) => context.classList.remove(className),
    hasClass = (className, context) => context.classList.contains(className);

//Создает новый элемент с указанным списком классов через пробел
function createNewElement(name, classes, type, innerText) {
    //console.log('Create New Element');
    const result = document.createElement(name);
    if (classes) {
        classes = classes.split(' ').forEach((el) => {
            result.classList.add(el);
        })
    }
    if (type) {
        console.log(type);
        result.type = type;
    }
    if (innerText) {
        result.innerText = innerText;
    }
    return result;
}