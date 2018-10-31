const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;
let gameWidth = canvas.width;

const updateGameWindow = () => {
  gameWidth = canvas.width;
  aiPaddle.positionX = canvas.width - 30;
}

const clearScreen = () => {
  canvasContext.fillStyle = '#111';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

const ballMove = ballsGame => {
  ballsGame.forEach(ballGame => {
    ballGame.move(collisionObjects);
  })
}

class Paddle {
  constructor(width, height, color, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.speed = 3; //speed of paddle
    this.middleHeight = height / 2;
  }
}

class Ball {
  constructor(size, color, positionX, positionY) {
    this.width = size;
    this.height = size;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.middle = size / 2;
    this.speedX = 2; //X speed of ball
    this.speedY = 2; //Y speed of ball
    this.directionX = true; //true => right
    this.directionX = true; //true => bottom
  }
}

const collisionObjects = [];
const ballsGame = [];

const drawObject = (collisionObjects, context) => {
  collisionObjects.forEach(collisionObject => {
    context.fillStyle = collisionObject.color;
    context.fillRect(collisionObject.positionX, collisionObject.positionY, collisionObject.width, collisionObject.height);
  })
}

const playerPaddle = new Paddle(20, 120, 'blue', 10, 50);
const aiPaddle = new Paddle(20, 120, 'yellow', canvas.width - 30, 100);
const ball = new Ball(10, 'green', canvas.width / 2 - 5, canvas.height / 2 - 5);

collisionObjects.push(playerPaddle, aiPaddle, ball);
ballsGame.push(ball);

drawObject(collisionObjects, canvasContext);

let repeatID;

const repeatOften = () => {
  if (gameWidth !== canvas.width) {
    updateGameWindow();
  }
  clearScreen();
  ballMove(ballsGame);
  drawObject(collisionObjects, canvasContext);
  repeatID = requestAnimationFrame(repeatOften);
}

repeatID = requestAnimationFrame(repeatOften);

// let repeatID = setInterval(repeatOften, 1000 / 60);