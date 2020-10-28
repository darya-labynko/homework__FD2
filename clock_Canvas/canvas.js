"use strict";


const canvas = document.getElementById("clock");
const context = canvas.getContext("2d");
const radius = 210; //радиус циферблата
const radiusNum = 30;   //радиус круг с цифрами
const r = 160; // радиус расположения цифр
const centerX = canvas.width/2; //центр окружности по X
const centerY = canvas.height/2; //центр окружности по Y

//отображаем часы и стрелки
function setTime(){
    const time = new Date();
    const h = checkTime(time.getHours());
    const m = checkTime(time.getMinutes());
    const s = checkTime(time.getSeconds());

    //рисуем циферблат
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
    context.fillStyle = "#fcca66";
    context.fill();

    //угол поворота часа
    const hour = (h + m / 60 + s / 3600) * 30;
    const minute = (m + s / 60) * 6;
    const second = 6*s;


    for (let i = 1; i <= 12; i++) {
        let a=i/12*Math.PI*2;
        let numCenterX = centerX + r * Math.sin(a);
        let numCenterY = centerY - r * Math.cos(a);
        context.beginPath();
        context.fillStyle = "#48b382";
        context.arc(numCenterX,numCenterY, radiusNum, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "black";
        context.font = "30px April";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(i, numCenterX, numCenterY);
    }



    //часы
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineWidth = 12;
    context.lineCap = "round";
    context.lineTo(centerX+Math.sin(hour*Math.PI/180)*radius*0.4, centerY-Math.cos(hour*Math.PI/180)*radius*0.4);
    context.stroke();

    //минуты
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineWidth = 8;
    context.lineCap = "round";
    context.lineTo(centerX+Math.sin(minute*Math.PI/180)*radius*0.6, centerY-Math.cos(minute*Math.PI/180)*radius*0.6);
    context.stroke();

    //секунды
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineTo(centerX+Math.sin(second*Math.PI/180)*radius*0.8, centerY-Math.cos(second*Math.PI/180)*radius*0.8);
    context.stroke();
    //центруем цифровые часы
    context.fillStyle = "black";
    context.font = "40px April";
    context.fillText(( h+":"+m+":"+s),radius,160);

    //перезапуск функции
    const ms = time.getMilliseconds();
    const timeout = setTimeout(setTime, 1020-ms);

}

//если час/минута/ секунда - 1 цифра, добавляем "0"
function checkTime(i){
    if (i<10){
        i="0" + i;
    }
    return i;
}
setTime();