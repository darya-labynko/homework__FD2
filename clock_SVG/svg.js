"use strict";

//отображение текущего времени
function setTime() {
    let time = new Date();
    let h = checkTime(time.getHours());
    let m = checkTime(time.getMinutes());
    let s = checkTime(time.getSeconds());
    document.getElementById("timer").innerHTML = h + ":" + m + ":" + s;

//задаем движение стрелок сек - мин - час
    document.getElementById("second").setAttribute("transform", "rotate(" + 6 * s + ")");
    document.getElementById("minute").setAttribute("transform", "rotate(" + (m + s / 60) * 6 + ")");
    document.getElementById("hour").setAttribute("transform", "rotate(" + (h + m / 60 + s / 3600) * 30 + ")");

    //если час/минута/ секунда - 1 цифра, добавляем "0"
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

//перезапуск функции через секунду
    setTimeout(setTime, 1000);
}


function numberSetting() {
    const r = 160; // радиус расположения цифр
    // координаты центра
    const cX = 200;
    const cY = 200;
    const svgNS = "http://www.w3.org/2000/svg";

    for (let i = 1; i <= 12; i++) {
        let a = i / 12 * Math.PI * 2;
//располагаем маленькие круги по окружности
        let centerX = cX + r * Math.sin(a);
        let centerY = cY - r * Math.cos(a);

        //контейнер для цифр
        const radSmall = 26;   //радиус круга с цифрами
        let container = document.getElementById("numbers");
        //добавляем контейнер для цифры
        let numberContainer = document.createElementNS(svgNS, "circle");
        numberContainer.setAttribute("cx", centerX);
        numberContainer.setAttribute("cy", centerY);
        numberContainer.setAttribute("r", radSmall);
        numberContainer.setAttribute("fill", '#48b382');
        container.appendChild(numberContainer);

        //добавление цифры
        let number = document.createElementNS(svgNS, "text");
        let text = document.createTextNode(i);
        let numX = (centerX - radSmall / 2.5); // центрирование цифры в маленьком круге по Х
        let numY = (centerY + radSmall / 2.5); // центрирование цифры в маленьком круге по У
        number.setAttribute("x", numX);
        number.setAttribute("y", numY);
        number.appendChild(text);
        container.appendChild(number);
    }
}

numberSetting();
setTime();