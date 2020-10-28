"use strict";
var clock = document.getElementById("clock"),
    //центр clock
    centerX = clock.offsetLeft + clock.offsetWidth / 2,
    centerY = clock.offsetTop + clock.offsetHeight / 2,
    // контейнер для цифровых часов
    digital = document.createElement("div"),
    radius = 120, // радиус
    radiusDigital = 72, // радиус  для электронных часов
    //контейнеры для стрелок
    hours = document.createElement("div"),
    minute = document.createElement("div"),
    second = document.createElement("div");


for (let i = 1; i <= 12; i++) {
    let childCircle = document.createElement("div");// контейнер для цифр
    let angle = i / 12 * Math.PI * 2; // расположение цифр по окружности

    childCircle = clock.appendChild(childCircle);//кладем дочерний элемент в clock
    childCircle.classList.add("child");//класс для маленьких кругов
    childCircle.innerHTML = i;//значением каждого дочерного элемента будет равен i

    let childCenterX = centerX + radius * Math.sin(angle); // узнаем центр маленького круга по X
    let childCenterY = centerY - radius * Math.cos(angle); // узнаем центр маленького круга по Y

    childCircle.style.left = Math.round(childCenterX - childCircle.offsetWidth / 2) + "px";
    childCircle.style.top = Math.round(childCenterY - childCircle.offsetHeight / 2) + "px";
}

// вставляем созданные элементы в конец дочерных элементов clock
digital = clock.appendChild(digital);
hours = clock.appendChild(hours);
minute = clock.appendChild(minute);
second = clock.appendChild(second);

// устанавливаем класс для электронных часов и к каждой стрелке
digital.classList.add("digitalWatch");
hours.classList.add("hour");
minute.classList.add("minutes");
second.classList.add("seconds");

// положение цифровых часов
digital.style.left = centerX - digital.offsetWidth / 2 + "px";
digital.style.top = centerY - radiusDigital + "px";
// положение стрелки часа
hours.style.top = centerY - hours.offsetHeight + 10 + "px";
hours.style.left = centerX - hours.offsetWidth / 2 + "px";
// положение стрелки минут
minute.style.top = centerY - minute.offsetHeight + 10 + "px";
minute.style.left = centerX - minute.offsetWidth / 2 + "px";
// положение стрелки секунд
second.style.top = centerY - second.offsetHeight + 10 + "px";
second.style.left = centerX - second.offsetWidth / 2 + "px";
//точка трансформации стрелок
hours.style.transformOrigin = "center 50px";
minute.style.transformOrigin = "center 110px";
second.style.transformOrigin = "center 135px";

// функция текущего времени
function setTime() {
    let time = new Date();
    let h = checkTime(time.getHours());
    let m = checkTime(time.getMinutes());
    let s = checkTime(time.getSeconds());
    digital.innerHTML = h + ":" + m + ":" + s;

//задаем движение стрелок сек - мин - час
    second.style.transform = "rotate(" + 6 * s + "deg)";
    minute.style.transform = "rotate(" + (m + s / 60) * 6 + "deg)";
    hours.style.transform = "rotate(" + (h + m / 60 + s / 3600) * 30 + "deg)";

    //если час/минута/ секунда - 1 цифра, добавляем "0"
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}

setTime();
window.setInterval(setTime, 1000);