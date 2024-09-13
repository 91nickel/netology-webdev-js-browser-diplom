class DrawingMode {
    constructor(container = document.querySelector('.wrap.app'), controller) {
        this.container = container;
        this.controller = controller;
        this.newCanvas();
        this.newMask();
        this.drawingPanel = this.container.querySelector('.draw-tools');
        this.isDrawing = false;
        this.events();
    }

    events(a) {
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.mouseLeave.bind(this));

        if (a !== 1 || !a) {
            this.drawingPanel.addEventListener('click', (event) => {
                if (event.target.tagName === 'INPUT') {
                    event.target.parentElement.querySelectorAll('input').forEach(el => {
                        el.removeAttribute('checked');
                    });
                    event.target.setAttribute('checked', '');
                }
            })
        }
    }

    //Скроет, либо покажет текущий canvas
    showHide() {
        this.canvas.style.display = this.canvas.style.display === '' && this.canvas ? 'none' : '';
    }

    mouseDown(event) {
        event.preventDefault();
        this.isDrawing = true;
        this.coordinates = this.getCoordinatesOnCanvas(event);
        this.startedCanvasImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        console.log('MouseDown на канвас');
        console.log('color - ', this.color);
    }

    mouseMove(event) {
        event.preventDefault();

        requestAnimationFrame(() => {
            if (this.isDrawing && this.controller.viewStateValue === 'paint') {
                console.log('MouseMove на канвас');
                //this.ctx.putImageData(this.startedCanvasImage, 0, 0);
                this.ctx.beginPath()
                this.ctx.moveTo(this.coordinates.x, this.coordinates.y);
                this.ctx.lineTo(
                    event.clientX - event.target.getBoundingClientRect().left,
                    event.clientY - event.target.getBoundingClientRect().top
                );
                this.ctx.strokeStyle = this.color;
                this.ctx.lineWidth = 10;
                this.ctx.lineJoin = 'round';
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
                this.coordinates = {
                    x: event.clientX - event.target.getBoundingClientRect().left,
                    y: event.clientY - event.target.getBoundingClientRect().top
                }
                //ctx.beginPath();
                // this.ctx.fillStyle = this.color;
                // this.ctx.arc(event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top, 5, 0, 2 * Math.PI);
                // this.ctx.fill();
            }
        })
    }

    mouseUp(event) {
        console.log('MouseUp на канвас');
        event.preventDefault();
        this.isDrawing = false;
        this.sendCanvasIfNoDrawing();
    }

    mouseLeave(event) {
        console.log('MouseLeave на канвас');
        event.preventDefault();
        this.isDrawing = false;
    }

    sendCanvasIfNoDrawing() {
        setTimeout(() => {
            if (!this.isDrawing) {
                console.log('Отправка изображения', this.isDrawing);
                this.controller.sendCanvas();
            }
        }, 500)
    }

    //Вернет координаты мыши относительно canvas
    getCoordinatesOnCanvas(event) {
        return {
            x: event.clientX - event.target.getBoundingClientRect().left,
            y: event.clientY - event.target.getBoundingClientRect().top
        }
    }

    //Создаёт новый canvas и вставляет его в нужное место
    newCanvas() {
        console.log('DrawingMode -> newCanvas');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.classList.add('current-image');
        this.canvas.style.zIndex = '90';
        this.canvas.height = 0;
        this.canvas.width = 0;
        this.container.appendChild(this.canvas);
        this.scaleCanvas();
    }

    //Создает новую маску и вставляет её в нужное место
    newMask() {
        console.log('DrawingMode -> newMask()');
        this.mask = document.createElement('img');
        this.mask.classList.add('current-image-mask');
        //this.mask.style.display = 'none';
        this.mask.style.zIndex = '80';
        this.container.insertBefore(this.mask, this.canvas);
    }

    //Обновит маску изображения
    updateMask(src) {
        console.log('DrawingMode -> updateMask');
        this.mask.src = src;
        this.mask.style.display = src ? '' : 'none';
    }

    scaleCanvas() {
        console.log('DrawingMode -> scaleCanvas()');
        if (this.controller.currentImage) {
            setTimeout(() => {
                try {
                    this.canvas.height = this.img.clientHeight;
                    this.canvas.width = this.img.clientWidth;
                } catch (e) {
                    console.error('Ошибка', e);
                }
            }, 100)
        }
    }

    //Очищает текущий canvas
    clearCanvas() {
        console.log('DrawingMode -> clearCanvas()');
        if (this.canvas) {
            this.container.removeChild(this.canvas);
            delete this.canvas;
            delete this.ctx;
        }
        this.newCanvas();
        this.events(1);
    }

    //Удалит текущий canvas и маску
    removeCanvas() {
        console.log('DrawingMode -> removeCanvas()');
        if (this.canvas) {
            this.container.removeChild(this.canvas);
            delete this.canvas;
            delete this.ctx;
        }
        if (this.mask) {
            this.container.removeChild(this.mask);
            delete this.mask;
        }
    }

    //Преобразует текущий canvas в img и вернет ссылку на изображение
    get canvasImage() {
        return this.canvas;
    }

    //Получает текущий цвет из панели рисования
    get color() {
        return this.drawingPanel.querySelector('input[checked]').value;
    }

    get img() {
        return this.container.querySelector('img.current-image');
    }
}