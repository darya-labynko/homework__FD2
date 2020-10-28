"use strict";

////////////////////////////////////////////Model////////////////////////////////////////////
class Clock {

    constructor(name, time) {
        this.name = name;
        this.time = time;
        this.view = null;
        this.date = new Date;
        this.timeZone = this.date.getTimezoneOffset();
        this.timer = null;
    }

//фнукция для связывания объектов друг с другом
    start(view) {
        this.view = view;
        this.view = view;
        this.view.clockGo(this.timeConverter());
        this.updateView();
        this.timerStart()
    }

    timeConverter() {
        let minskTime = this.timeZone * 60 * 1000; //смещение относительно локального пояса, перевод в мс
        let hours = this.time * 3600 * 1000;// смещение UTC города  в часах, перевод в мс
        let date = new Date();
        let time = date.getTime() + hours;
        // получение текущего времени, относительно назначенного города
        return new Date(time + +minskTime);
    }

    updateView() {
        if (this.view) {
            this.view.update(this.timeConverter());
            // при любых изменениях модели попадаем сюда
            // представление может быть любым
        }
    }

    // запуск времени
    timerStart() {
        let self = this;
        this.timer = window.setInterval(
            function () {
                this.date = self.timeConverter();
                self.updateView();
            }
            , 500);
    }

    //остановка времени
    timerStop() {
        window.clearInterval(this.timer)
    }
}

//////////////////////////////////View with SVG, DOM and Canvas////////////////////////////////

class ViewSVG {

    constructor() {

        //id – порядковый номер часов
        this.id = null;
        //модель с отображением конкретного часовго пояса
        this.model = null;
        this.date = "";

        this.sec = null;
        this.min = null;
        this.hr = null;

//отображаем скелет часов
        const xmlns = "http://www.w3.org/2000/svg";
        this.wrap = document.querySelector(".wrapper"); // контейнер для часов
        this.generalContainer = document.createElement("div");
        this.clockHeader = document.createElement("div");
        this.clockName = document.createElement("span");
        this.stopBtn = document.createElement("button");
        this.startBtn = document.createElement("button");
        this.clockSVG = document.createElementNS(xmlns, "svg");
        this.clock = document.createElementNS(xmlns, "circle");
        this.clockSVG.appendChild(this.clock);
        this.numbers = document.createElementNS(xmlns, "g");
        this.arrows = document.createElementNS(xmlns, "g");
        this.point = document.createElementNS(xmlns, "circle");
        this.hour = document.createElementNS(xmlns, "line");
        this.minute = document.createElementNS(xmlns, "line");
        this.second = document.createElementNS(xmlns, "line");

        //выносим константы
        this.r = 110; // радиус расположения цифр
        // координаты центра
        this.cX = 150;
        this.cY = 150;
        this.radSmall = 20;   //радиус круга с цифрами
    }

    draw() {
        this.clockSVG.appendChild(this.numbers);
        this.clockSVG.appendChild(this.arrows);

//главные структурные элементы
        this.generalContainer.id = this.id;
        this.generalContainer.appendChild(this.clockHeader);
        this.generalContainer.appendChild(this.clockSVG);
        this.wrap.appendChild(this.generalContainer);

        //кнопки
        this.stopBtn.classList.add("stop-button");
        this.stopBtn.type = "button";
        this.stopBtn.innerHTML = "Стоп";

        this.startBtn.classList.add("start-button");
        this.startBtn.type = "button";
        this.startBtn.innerHTML = "Старт";

//название
        this.clockName.innerHTML = this.model.name;

//добавление названия + кнопок в шапку
        this.clockHeader.appendChild(this.stopBtn);
        this.clockHeader.appendChild(this.startBtn);
        this.clockHeader.appendChild(this.clockName);

//размеры контейнера svg
        this.clockSVG.style.width = "300px";
        this.clockSVG.style.height = "300px";

//стилизация крупного циферблата
        this.clock.setAttribute("cx", "150");
        this.clock.setAttribute("cy", "150");
        this.clock.setAttribute("r", "150");
        this.clock.setAttribute("fill", "#fcca66");


//стилизация стрелок и кружка

        //кружок
        this.point.setAttribute("cx", "150");
        this.point.setAttribute("cy", "150");
        this.point.setAttribute("r", "5");
        this.point.setAttribute("fill", "black");
        this.point.style.transformOrigin = "50% 50%";
        this.point.style.stroke = "black";
        this.point.style.strokeLinecap = "round";

//часовая стрелка
        this.hour.setAttribute("x1", "150");
        this.hour.setAttribute("y1", "150");
        this.hour.setAttribute("x2", "150");
        this.hour.setAttribute("y2", "100");
        this.hour.setAttribute("stroke-width", "10");
        this.hour.setAttribute("fill", "black");
        this.hour.style.transformOrigin = "50% 50%";
        this.hour.style.stroke = "black";
        this.hour.style.strokeLinecap = "round";

// минутная стрелка
        this.minute.setAttribute("x1", "150");
        this.minute.setAttribute("y1", "150");
        this.minute.setAttribute("x2", "150");
        this.minute.setAttribute("y2", "60");
        this.minute.setAttribute("stroke-width", "6");
        this.minute.setAttribute("fill", "black");
        this.minute.style.transformOrigin = "50% 50%";
        this.minute.style.stroke = "black";
        this.minute.style.strokeLinecap = "round";

//секундная стрелка
        this.second.setAttribute("x1", "150");
        this.second.setAttribute("y1", "150");
        this.second.setAttribute("x2", "150");
        this.second.setAttribute("y2", "20");
        this.second.setAttribute("stroke-width", "2");
        this.second.setAttribute("fill", "black");
        this.second.style.transformOrigin = "50% 50%";
        this.second.style.stroke = "black";
        this.second.style.strokeLinecap = "round";

        this.arrows.appendChild(this.point);
        this.arrows.appendChild(this.hour);
        this.arrows.appendChild(this.minute);
        this.arrows.appendChild(this.second);

        //цикл для создания внутренних кружков с цифрами и их расположение по окружности
        for (let i = 1; i <= 12; i++) {
            let a = i / 12 * Math.PI * 2;

//располагаем маленькие круги по окружности
            let centerX = this.cX + this.r * Math.sin(a);
            let centerY = this.cY - this.r * Math.cos(a);
            let container = this.numbers;

            //добавляем контейнер для цифры
            let numberContainer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            numberContainer.setAttribute("cx", centerX);
            numberContainer.setAttribute("cy", centerY);
            numberContainer.setAttribute("r", this.radSmall);
            numberContainer.setAttribute("fill", '#48b382');
            container.appendChild(numberContainer);

            //добавление цифры
            let number = document.createElementNS("http://www.w3.org/2000/svg", "text");
            let text = document.createTextNode(i);
            let numX = (centerX - this.radSmall / 2.5); // центрирование цифры в маленьком круге по Х
            let numY = (centerY + this.radSmall / 2.5); // центрирование цифры в маленьком круге по У
            number.setAttribute("x", numX);
            number.setAttribute("y", numY);
            number.appendChild(text);
            container.appendChild(number);
        }

    }

    start(model, wrap, id) {
        this.model = model;
        this.date = this.model.timeConverter();
        this.id = id.toString();
        this.wrap = wrap;
        this.draw();
        this.update(this.date);
    }

//задаем движение
    clockGo(date) {
        this.sec = 6 * date.getSeconds();
        this.min = 6 * (date.getMinutes() + (1 / 60) * date.getSeconds());
        this.hr = 30 * (date.getHours() + (1 / 60) * date.getMinutes());
    }

//трансформация стрелок
    update(date) {
        this.clockGo(date);
        this.second.style.transform = "rotate(" + this.sec + "deg)";
        this.minute.style.transform = "rotate(" + this.min + "deg)";
        this.hour.style.transform = "rotate(" + this.hr + "deg)";
    }
}

class ViewDOM {
    constructor() {
        this.model = null;
        this.wrap = null;
        this.id = null;
        this.date = "";
        this.sec = null;
        this.min = null;
        this.hr = null;
//отображаем скелет часов
        this.wrap = document.querySelector(".wrapper");
        this.clockContainer = document.createElement("div");
        this.clockHeader = document.createElement("div");
        this.clockName = document.createElement("span");
        this.stopBtn = document.createElement("button");
        this.startBtn = document.createElement("button");
        this.clockDOM = document.createElement("div");
        this.hour = document.createElement("div");
        this.minute = document.createElement("div");
        this.second = document.createElement("div");

        //выносим константы
        this.radius = 120; // радиус

    }

    draw() {
        //главные структурные элементы
        this.clockContainer.id = this.id;
        this.wrap.appendChild(this.clockContainer);
        this.clockContainer.appendChild(this.clockHeader);
        this.clockContainer.appendChild(this.clockDOM);

//кнопки
        this.stopBtn.classList.add("stop-button");
        this.stopBtn.type = "button";
        this.stopBtn.innerHTML = "Стоп";

        this.startBtn.classList.add("start-button");
        this.startBtn.type = "button";
        this.startBtn.innerHTML = "Старт";

        this.clockName.innerHTML = this.model.name;

        this.clockHeader.appendChild(this.stopBtn);
        this.clockHeader.appendChild(this.startBtn);
        this.clockHeader.appendChild(this.clockName);

//добавляем стили к часам
        this.clockDOM.classList.add("clock");
        this.hour.classList.add("hour");
        this.minute.classList.add("minute");
        this.second.classList.add("second");


        this.centerX = this.clockDOM.offsetLeft + this.clockDOM.offsetWidth / 2;
        this.centerY = this.clockDOM.offsetTop + this.clockDOM.offsetHeight / 2;

//цикл отрисовки внутренних кружков и их расположение
        for (let i = 1; i <= 12; i++) {
            let childCircle = document.createElement("div");// контейнер для цифр
            let angle = i / 12 * Math.PI * 2; // расположение цифр по окружности

            childCircle = this.clockDOM.appendChild(childCircle);//кладем дочерний элемент в clock
            childCircle.classList.add("child");//класс для маленьких кругов
            childCircle.innerHTML = i;//значением каждого дочерного элемента будет равен i

            let childCenterX = this.centerX + this.radius * Math.sin(angle); // узнаем центр маленького круга по X
            let childCenterY = this.centerY - this.radius * Math.cos(angle); // узнаем центр маленького круга по Y

            childCircle.style.left = Math.round(childCenterX - childCircle.offsetWidth / 2) + "px";
            childCircle.style.top = Math.round(childCenterY - childCircle.offsetHeight / 2) + "px";
        }
        this.clockDOM.appendChild(this.hour);
        this.clockDOM.appendChild(this.minute);
        this.clockDOM.appendChild(this.second);


        // положение стрелки часа
        this.hour.style.top = this.centerY - this.hour.offsetHeight + 10 + "px";
        this.hour.style.left = this.centerX - this.hour.offsetWidth / 2 + "px";
        // положение стрелки минут
        this.minute.style.top = this.centerY - this.minute.offsetHeight + 10 + "px";
        this.minute.style.left = this.centerX - this.minute.offsetWidth / 2 + "px";
        // положение стрелки секунд
        this.second.style.top = this.centerY - this.second.offsetHeight + 10 + "px";
        this.second.style.left = this.centerX - this.second.offsetWidth / 2 + "px";
        //точка трансформации стрелок
        this.hour.style.transformOrigin = "center 50px";
        this.minute.style.transformOrigin = "center 110px";
        this.second.style.transformOrigin = "center 135px";


    }

    start(model, wrap, id) {
        this.model = model;
        this.date = this.model.timeConverter();
        this.id = id.toString();
        this.wrap = wrap;
        this.draw();
        this.update(this.date);
    }

//задаем движение
    clockGo(date) {
        this.sec = 6 * date.getSeconds();
        this.min = 6 * (date.getMinutes() + (1 / 60) * date.getSeconds());
        this.hr = 30 * (date.getHours() + (1 / 60) * date.getMinutes());
    }

//трансформация стрелок
    update(date) {
        this.clockGo(date);
        this.second.style.transform = "rotate(" + this.sec + "deg)";
        this.minute.style.transform = "rotate(" + this.min + "deg)";
        this.hour.style.transform = "rotate(" + this.hr + "deg)";
    }

}

class ViewCanvas {
    constructor() {
        this.model = null;
        this.wrap = null;
        this.id = null;
        this.date = "";
        this.sec = null;
        this.min = null;
        this.hr = null;

//отображаем скелет часов
        this.wrap = document.querySelector(".wrapper");
        this.clockContainer = document.createElement("div");
        this.clockHeader = document.createElement("div");
        this.clockName = document.createElement("span");
        this.stopBtn = document.createElement("button");
        this.startBtn = document.createElement("button");
        this.clockCanvas = document.createElement("canvas");
        this.clockCanvas.id = "clock";

        //выносим константы
        this.canvas = this.clockCanvas;
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");

        this.radius = 150; //радиус циферблата
        this.radiusNum = 20;   //радиус круг с цифрами
        this.r = 120; // радиус расположения цифр
        this.centerX = 150; //центр окружности по X
        this.centerY = 150; //центр окружности по Y
    }

    draw() {
        this.clockContainer.id = this.id;
        this.wrap.appendChild(this.clockContainer);
        this.clockContainer.appendChild(this.clockHeader);
        this.clockHeader.appendChild(this.stopBtn);
        this.clockHeader.appendChild(this.startBtn);
        this.clockHeader.appendChild(this.clockName);
        this.clockContainer.appendChild(this.canvas);

        this.stopBtn.classList.add("stop-button");
        this.stopBtn.type = "button";
        this.stopBtn.innerHTML = "Стоп";

        this.startBtn.classList.add("start-button");
        this.startBtn.type = "button";
        this.startBtn.innerHTML = "Старт";

//название
        this.clockName.innerHTML = this.model.name;
    }

    start(model, wrap, id) {
        this.model = model;
        this.date = this.model.timeConverter();
        this.id = id.toString();
        this.wrap = wrap;
        this.draw();
        this.update(this.date);
    }

//задаем движение
    clockGo(date) {
        this.sec = 6 * date.getSeconds();
        this.min = 6 * (date.getMinutes() + (1 / 60) * date.getSeconds());
        this.hr = 30 * (date.getHours() + (1 / 60) * date.getMinutes());
    }

//трансформация стрелок
    update(date) {
        this.clockGo(date);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawClock();
        //часы
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineWidth = 10;
        this.context.lineCap = "round";
        this.context.lineTo(this.centerX + Math.sin(this.hr * Math.PI / 180) * this.radius * 0.4, this.centerY - Math.cos(this.hr * Math.PI / 180) * this.radius * 0.4);
        this.context.stroke();

        //минуты
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineWidth = 7;
        this.context.lineCap = "round";
        this.context.lineTo(this.centerX + Math.sin(this.min * Math.PI / 180) * this.radius * 0.6, this.centerY - Math.cos(this.min * Math.PI / 180) * this.radius * 0.6);
        this.context.stroke();

        //секунды
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineWidth = 2;
        this.context.lineCap = "round";
        this.context.lineTo(this.centerX + Math.sin(this.sec * Math.PI / 180) * this.radius * 0.8, this.centerY - Math.cos(this.sec * Math.PI / 180) * this.radius * 0.8);
        this.context.stroke();
    }

    drawClock() {
        //рисуем циферблат
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = "#fcca66";
        this.context.fill();


        for (let i = 1; i <= 12; i++) {
            let a = i / 12 * Math.PI * 2;
            let numCenterX = this.centerX + this.r * Math.sin(a);
            let numCenterY = this.centerY - this.r * Math.cos(a);
            this.context.beginPath();
            this.context.fillStyle = "#48b382";
            this.context.arc(numCenterX, numCenterY, this.radiusNum, 0, Math.PI * 2);
            this.context.fill();
            this.context.fillStyle = "black";
            this.context.font = "20px Times New Roman";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillText(i, numCenterX, numCenterY);
        }
    }
}

/////////////////////////////////////////////Controller////////////////////////////////
class ClockControllerButtons {
    constructor() {
        this.model = null;
        this.wrap = null;
        this.startBtn = null;
        this.stopBtn = null;
    }

    start(model, elementId) {
        let self = this;
        this.model = model;
        this.wrap = document.getElementById(elementId.toString());
        this.startBtn = this.wrap.querySelector('.start-button');
        this.startBtn.addEventListener('click', self.startClock.bind(this));
        this.stopBtn = this.wrap.querySelector('.stop-button');
        this.stopBtn.addEventListener('click', self.stopClock.bind(this));

        console.log(this.model);
    }

    stopClock() {
        this.model.timerStop();

    }

    startClock() {
        this.model.timerStart();
    }
}

/////////////////////////Main/////////////////////////////////////////////
window.addEventListener('load', function () {
    let wrap = document.querySelector(".wrapper");

    // часы Берлин SVG
    let model = new Clock('Берлин (UTC / GMT +2)', '2');
    let view = new ViewSVG();
    let controller = new ClockControllerButtons();

    model.start(view);
    view.start(model, wrap, 1);
    controller.start(model, 1);

    // часы Токио SVG
    let model2 = new Clock('Токио (UTC / GMT +9)', '9');
    let view2 = new ViewSVG();
    let controller2 = new ClockControllerButtons();

    model2.start(view2);
    view2.start(model2, wrap, 2);
    controller2.start(model2, 2);

//часы Нью-Йорк DOM
    let model3 = new Clock('Нью-Йорк (UTC / GMT -5)', '-5');
    let view3 = new ViewDOM();
    let controller3 = new ClockControllerButtons();

    model3.start(view3);
    view3.start(model3, wrap, 3);
    controller3.start(model3, 3);

//часы Лондон DOM
    let model4 = new Clock('Лондон (UTC / GMT)', '1');
    let view4 = new ViewDOM();
    let controller4 = new ClockControllerButtons();

    model4.start(view4);
    view4.start(model4, wrap, 4);
    controller4.start(model4, 4);

    //часы Минск Canvas
    let model5 = new Clock('Минск (UTC / GMT +5)', '+5');
    let view5 = new ViewCanvas();
    let controller5 = new ClockControllerButtons();

    model5.start(view5);
    view5.start(model5, wrap, 5);
    controller5.start(model5, 5);

//часы Владивосток Canvas
    let model6 = new Clock('Владивосток (UTC / GMT +10)', '+10');
    let view6 = new ViewCanvas();
    let controller6 = new ClockControllerButtons();

    model6.start(view6);
    view6.start(model6, wrap, 6);
    controller6.start(model6, 6);

});