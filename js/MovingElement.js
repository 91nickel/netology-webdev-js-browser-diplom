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
        if (this.position) {
            this.container.style.left = this.position.x;
            this.container.style.top = this.position.y;
        } else {
            this.container.style.left = '0px';
            this.container.style.top = '0px';
        }
        this.events();
    }
    events() {
        //console.log(this.container);
        this.container.addEventListener('mousedown', (e) => {
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
        this.container.addEventListener('mouseup', (e) => {
            console.log(`MouseUp`);
            this.onMoving = false;
            this.movingElement = null;
            this.position = true;
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
    set position(data) {
        console.log('set position');
        localStorage.menuPosition = JSON.stringify({
            x: this.container.style.left,
            y: this.container.style.top
        })
    }
    get position() {
        console.log('get position');
        if (localStorage.menuPosition) {
            return JSON.parse(localStorage.menuPosition);
        }
    }
}