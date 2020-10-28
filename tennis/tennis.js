"use strict";
//Создаем кнопку старт
var buttonStart = document.createElement("input");
buttonStart.type = "button";
buttonStart.value = "start";
buttonStart.classList.add("button");
buttonStart = document.body.insertBefore(buttonStart, document.body.children[0]); //созданную кнопку делаем дочерным элементом body
buttonStart.onclick = start; //на события onclick ставим функцию start(при клике на кнопку запускаем функцию)
//Создаем счетчик
var scoreBoard = document.createElement("div"); //сoздаём div для табло
var scoreLeft = 0; //очки первого игрока
var scoreRight = 0; //очки второго игрока
scoreBoard.classList.add("score");//устанавливаем готовый CSS класс
scoreBoardInnerHTML(); //вызываем функцию чтоб на табло вывести очки(score1 и score2) игроков
scoreBoard = document.body.insertBefore(scoreBoard, document.body.children[0]); //созданный табло делаем дочерным элементом body

//Создаем холст игры
const canvas = document.getElementById("game");
// Делаем поле двухмерным
const context = canvas.getContext("2d");
// Размер игровой клетки
const grid = 20;
// Высота платформы
const paddleHeight = grid * 6; //120
// Задаём максимальное расстояние, на которое может подняться платформа
const maxPaddleY = canvas.height - paddleHeight;
// Скорость платформы
var paddleSpeed = 6;
// Скорость мяча
var ballSpeed = 5;
const canvasX = 0.5;
const canvasY = 0.5; // толщина обводки поля

// Описываем левую платформу
const leftPaddle = {
// Ставим её по центру
    x: canvasX, // начало не из 0, а следуя из толщины обводки поля
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid / 2,
// Высоту берём из константы
    height: paddleHeight,
// Платформа на старте никуда не движется
    dy: 0

};

// Описываем правую платформу
const rightPaddle = {
// Ставим по центру с правой стороны
    x: canvas.width - grid / 2,
    y: canvas.height / 2 - paddleHeight / 2,
// Задаём такую же ширину и высоту
    width: grid / 2,
    height: paddleHeight,
// Правая платформа тоже пока никуда не двигается
    dy: 0
};

// Описываем мячик
const ball = {
// Он появляется в самом центре поля
    x: canvas.width / 2,
    y: canvas.height / 2,
    // Регулируем размер
    width: grid * 1.5,
    height: grid * 1.5,
    radius: 15,
// На старте мяч пока не забит, поэтому убираем признак того, что мяч нужно ввести в игру заново
    resetting: false,
// Подаём мяч в правый верхний угол
    dx: 0,
    dy: 0

};

//Функция запуска игры на кнопку старт
function start() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed;
    ball.dy = -ballSpeed;
    ball.resetting = false;
}

//Функция запуска счетчика
function scoreBoardInnerHTML() {
    scoreBoard.innerHTML = scoreLeft + ":" + scoreRight;
}

// Проверка на то, столкнутся ли два объекта ( мяч, платформа)
function collides(obj1, obj2) {
    return obj1.x - obj1.radius <= obj2.x + obj2.width &&
        obj1.x + obj1.radius > obj2.x &&
        obj1.y - obj1.radius <= obj2.y + obj2.height &&
        obj1.y + obj1.radius > obj2.y;
}

// Главный цикл игры
function loop() {
// Очищаем игровое поле
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
// Если платформы на предыдущем шаге куда-то двигались — пусть продолжают двигаться
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

// Если левая платформа пытается вылезти за игровое поле вниз,
    if (leftPaddle.y <= 0) {
        leftPaddle.y = canvasY;
    }

// Проверяем то же самое сверху
    else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY - canvasY;
    }

// Если правая платформа пытается вылезти за игровое поле вниз,
    if (rightPaddle.y <= 0) {
        rightPaddle.y = 0;
    }

// Проверяем то же самое сверху
    else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
    }

// Рисуем поле
    context.strokeStyle = "black";
    context.fillStyle = "#F0EE7E";
    context.fillRect(canvasX, canvasY, canvas.width, canvas.height);
    context.strokeRect(canvasX, canvasY, canvas.width - 1, canvas.height - 1);


// Рисуем платформы
    context.fillStyle = "#09AA57";
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillStyle = "#191497";
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

// Если мяч на предыдущем шаге куда-то двигался — пусть продолжает двигаться
    ball.x += ball.dx;
    ball.y += ball.dy;
// Если мяч касается стены снизу — меняем направление на противоположное
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    }
// Делаем то же самое, если мяч касается стены сверху
    else if (ball.y - ball.radius + grid > canvas.height - grid) {
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

// Если мяч улетел за игровое поле влево или вправо, добавляем счетчик
    if (ball.x - ball.radius <= 0 && !ball.resetting) {
        scoreLeft++;
        scoreBoardInnerHTML();
        ball.dx = 0;
        ball.dy = 0;
        ball.resetting = true;
    }
    if (ball.x + ball.radius >= canvas.width && !ball.resetting) {
        scoreRight++;
        scoreBoardInnerHTML();
        ball.dx = 0;
        ball.dy = 0;
        ball.resetting = true;
    }

// Если мяч коснулся левой платформы,
    if (collides(ball, leftPaddle)) {
        // то отправляем его в обратном направлении
        ball.dx *= -1;
        // увеличиваем координаты мяча на ширину платформы, чтобы не засчитался новый отскок
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    }
// Проверяем и делаем то же самое для правой платформы
    else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.radius;
    }

//  Рисуем мяч
    context.beginPath();
    context.fillStyle = "#F02137";
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.fill();
// Отслеживаем нажатия клавиш
    document.addEventListener("keydown", function (EO) {
        EO = EO || window.event;
        EO.preventDefault();
// Если нажата клавиша вверх,
        if (EO.keyCode === 38) {
// то двигаем правую платформу вверх
            rightPaddle.dy = -paddleSpeed;
        }
// Если нажата клавиша вниз,
        else if (EO.keyCode === 40) {
// то двигаем правую платформу вниз
            rightPaddle.dy = paddleSpeed;
        }

// Если нажата клавиша Ctrl,
        if (EO.keyCode === 16) {
// то двигаем левую платформу вниз
            leftPaddle.dy = -paddleSpeed;
        }

// Если нажата клавиша Shift,
        else if (EO.keyCode === 17) {
// то двигаем левую платформу вверх
            leftPaddle.dy = paddleSpeed;
        }

    });

// когда кто-то отпустит клавишу, чтобы остановить движение платформы
    document.addEventListener("keyup", function (EO) {
        EO = EO || window.event;
        EO.preventDefault();
// Если это стрелка вверх или вниз,
        if (EO.keyCode === 38 || EO.keyCode === 40) {

// останавливаем правую платформу
            rightPaddle.dy = 0;

        }
// Eсли это Shift or Ctrl,
        if (EO.keyCode === 16 || EO.keyCode === 17) {
// останавливаем левую платформу
            leftPaddle.dy = 0;

        }

    });

}

// Запускаем игру

requestAnimationFrame(loop);
