const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
const showPlayerPoints = document.querySelector('.playerPoints');
const showAiPoints = document.querySelector('.aiPoints');
const start = document.querySelector('.start');
const stop = document.querySelector('.stop');
const restart = document.querySelector('.restart');

// Interface
canvas.width = 1000;
canvas.height = 500;
let paddleWidth = 20;
let paddleHeight = 120;
let paddleDistanceFromSide = 10;
let ballSize = 10;
let backgroundColor = '#111';
let ballStartSpeed = 2;
let paddleSpeed = 3;
let difficult = 0.5;

// Implementation

let gameWidth = canvas.width;
let gameHeight = canvas.height;
let playerPoints = 0;
let aiPoints = 0;
let multiplayer = true;
let isGameWork = 0;

//Fixed object positions if canvas' size change
const updateGameWindow = () => {
  gameWidth = canvas.width;
  aiPaddle.positionX = canvas.width - paddleDistanceFromSide - paddleWidth;
  ball.positionX = canvas.width / 2 - ballSize / 2;
  gameHeight = canvas.height;
  playerPaddle.positionY = aiPaddle.positionY = canvas.height / 2 - paddleHeight / 2;
  ball.positionY = canvas.height / 2 - ballSize / 2;
}

const clearScreen = () => {
  canvasContext.fillStyle = backgroundColor;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

const ballMove = ballsGame => {
  ballsGame.forEach(ballGame => {
    ballGame.move(collisionObjects);
  })
}

const keyboardSupport = (event) => {
  if (event.keyCode == 87) {
    playerPaddle.moveUp(collisionObjects);
  } else if (event.keyCode == 83) {
    playerPaddle.moveDown(collisionObjects);
  }
  if (multiplayer) {
    if (event.keyCode == 38) {
      aiPaddle.moveUp(collisionObjects);
    } else if (event.keyCode == 40) {
      aiPaddle.moveDown(collisionObjects);
    }
  }
}

const restartGame = () => {
  playerPoints = aiPoints = 0;
  showPlayerPoints.textContent = showAiPoints.textContent = 0;
  ball.resetBall();
  clearScreen();
  drawObject(collisionObjects, canvasContext);
  cancelAnimationFrame(repeatID);
  isGameWork = 0;
}

class Paddle {
  constructor(width, height, color, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.positionX = positionX;
    this.positionY = positionY;
    this.speed = paddleSpeed;
    this.middleHeight = height / 2;
    this.moveUp = collisionObjects => {
      this.positionY -= this.speed;
    }
    this.moveDown = collisionObjects => {
      this.positionY += this.speed;
    }
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
    this.speedX = ballStartSpeed;
    this.speedY = ballStartSpeed;
    this.directionX = true; //true => right
    this.directionY = true; //true => bottom
    this.resetBall = () => {
      if (Math.round(Math.random())) {
        this.directionX = !this.directionX;
      }
      if (Math.round(Math.random())) {
        this.directionY = !this.directionY;
      }
      this.speedX = ballStartSpeed;
      this.speedY = ballStartSpeed;
      this.positionX = canvas.width / 2 - this.width / 2;
      this.positionY = canvas.height / 2 - this.height / 2;
    }

    this.move = collisionObjects => {
      let collision = 0;
      const ballLeft = this.positionX;
      const ballRight = this.positionX + this.width;
      const ballTop = this.positionY;
      const ballBottom = this.positionY + this.height;

      //Set type of collision
      if (this.directionX && this.directionY) { //right bottom
        for (let i = 0; i < collisionObjects.length; i++) {
          let objectLeft = collisionObjects[i].positionX;
          let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
          let objectTop = collisionObjects[i].positionY;
          let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

          if (this === collisionObjects[i]) {
            continue;
          } else if (((objectLeft <= ballLeft && objectRight >= ballLeft) || (objectLeft <= ballRight && objectRight >= ballRight)) && ((objectTop <= ballBottom && objectBottom >= ballBottom) || (objectBottom >= ballTop && objectTop <= ballTop))) {
            this.directionX = !this.directionX;
            break;
          }

          if ((ballLeft < objectRight && ((objectLeft <= ballLeft + this.speedX && objectRight >= ballLeft + this.speedX) || (objectLeft <= ballRight + this.speedX && objectRight >= ballRight + this.speedX))) && (ballTop < objectBottom && ((objectTop <= ballBottom + this.speedY && objectBottom >= ballBottom + this.speedY) || (objectBottom >= ballTop + this.speedY && objectTop <= ballTop + this.speedY)))) {
            collision = 1;
            break;
          } else if (ballBottom + this.speedY > canvas.height) {
            collision = 2;
            break;
          } else if (ballRight + this.speedX > canvas.width) {
            collision = 3;
            playerPoints++;
            showPlayerPoints.textContent = playerPoints;
            break;
          }
        }
      } else if (this.directionX && !this.directionY) { //right top
        for (let i = 0; i < collisionObjects.length; i++) {
          let objectLeft = collisionObjects[i].positionX;
          let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
          let objectTop = collisionObjects[i].positionY;
          let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

          if (this === collisionObjects[i]) {
            continue;
          } else if (((objectLeft <= ballLeft && objectRight >= ballLeft) || (objectLeft <= ballRight && objectRight >= ballRight)) && ((objectTop <= ballBottom && objectBottom >= ballBottom) || (objectBottom >= ballTop && objectTop <= ballTop))) {
            this.directionX = !this.directionX;
            break;
          }

          if ((ballLeft < objectRight && ((objectLeft <= ballLeft + this.speedX && objectRight >= ballLeft + this.speedX) || (objectLeft <= ballRight + this.speedX && objectRight >= ballRight + this.speedX))) && (ballBottom > objectTop && ((objectTop <= ballBottom - this.speedY && objectBottom >= ballBottom - this.speedY) || (objectBottom >= ballTop - this.speedY && objectTop <= ballTop - this.speedY)))) {
            collision = 1;
            break;
          } else if (ballTop - this.speedY < 0) {
            collision = 2;
            break;
          } else if (ballRight + this.speedX > canvas.width) {
            collision = 3;
            playerPoints++;
            showPlayerPoints.textContent = playerPoints;
            break;
          }
        }
      } else if (!this.directionX && this.directionY) { //left bottom
        for (let i = 0; i < collisionObjects.length; i++) {
          let objectLeft = collisionObjects[i].positionX;
          let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
          let objectTop = collisionObjects[i].positionY;
          let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

          if (this === collisionObjects[i]) {
            continue;
          } else if (((objectLeft <= ballLeft && objectRight >= ballLeft) || (objectLeft <= ballRight && objectRight >= ballRight)) && ((objectTop <= ballBottom && objectBottom >= ballBottom) || (objectBottom >= ballTop && objectTop <= ballTop))) {
            this.directionX = !this.directionX;
            break;
          }

          if ((ballRight > objectLeft && ((objectLeft <= ballLeft - this.speedX && objectRight >= ballLeft - this.speedX) || (objectLeft <= ballRight - this.speedX && objectRight >= ballRight - this.speedX))) && (ballTop < objectBottom && ((objectTop <= ballBottom + this.speedY && objectBottom >= ballBottom + this.speedY) || (objectBottom >= ballTop + this.speedY && objectTop <= ballTop + this.speedY)))) {
            collision = 1;
            break;
          } else if (ballBottom + this.speedY > canvas.height) {
            collision = 2;
            break;
          } else if (ballLeft - this.speedX < 0) {
            collision = 3;
            aiPoints++;
            showAiPoints.textContent = aiPoints;
            break;
          }
        }
      } else { //left top
        for (let i = 0; i < collisionObjects.length; i++) {
          let objectLeft = collisionObjects[i].positionX;
          let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
          let objectTop = collisionObjects[i].positionY;
          let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

          if (this === collisionObjects[i]) {
            continue;
          } else if (((objectLeft <= ballLeft && objectRight >= ballLeft) || (objectLeft <= ballRight && objectRight >= ballRight)) && ((objectTop <= ballBottom && objectBottom >= ballBottom) || (objectBottom >= ballTop && objectTop <= ballTop))) {
            this.directionX = !this.directionX;
            break;
          }

          if ((ballRight > objectLeft && ((objectLeft <= ballLeft - this.speedX && objectRight >= ballLeft - this.speedX) || (objectLeft <= ballRight - this.speedX && objectRight >= ballRight - this.speedX))) && (ballBottom > objectTop && ((objectTop <= ballBottom - this.speedY && objectBottom >= ballBottom - this.speedY) || (objectBottom >= ballTop - this.speedY && objectTop <= ballTop - this.speedY)))) {
            collision = 1;
            break;
          } else if (ballTop - this.speedY < 0) {
            collision = 2;
            break;
          } else if (ballLeft - this.speedX < 0) {
            collision = 3;
            aiPoints++;
            showAiPoints.textContent = aiPoints;
            break;
          }
        }
      }
      if (collision) {
        if (Math.round(Math.random())) {
          this.speedX += difficult + Math.round(Math.random()) / 10;
        } else {
          this.speedY += difficult + Math.round(Math.random()) / 10;
        }
        if (collision == 1) {
          this.directionX = !this.directionX;
          if (Math.round(Math.random())) {
            this.directionY = !this.directionY;
          }
        } else if (collision == 2) {
          this.directionY = !this.directionY;
        } else { //collision == 3
          this.resetBall();
        }
      } else {
        if (this.directionX) {
          this.positionX += this.speedX;
        } else {
          this.positionX -= this.speedX;
        }
        if (this.directionY) {
          this.positionY += this.speedY;
        } else {
          this.positionY -= this.speedY;
        }
      }
    }
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

const playerPaddle = new Paddle(paddleWidth, paddleHeight, 'blue', paddleDistanceFromSide, canvas.height / 2 - paddleHeight / 2);
const aiPaddle = new Paddle(paddleWidth, paddleHeight, 'yellow', canvas.width - paddleDistanceFromSide - paddleWidth, canvas.height / 2 - paddleHeight / 2);
const ball = new Ball(ballSize, 'green', canvas.width / 2 - ballSize / 2, canvas.height / 2 - ballSize / 2);

collisionObjects.push(playerPaddle, aiPaddle, ball);
ballsGame.push(ball);

drawObject(collisionObjects, canvasContext);

let repeatID;

const repeatOften = () => {
  if ((gameWidth !== canvas.width) || (gameHeight !== canvas.height)) {
    updateGameWindow();
  }
  clearScreen();
  ballMove(ballsGame);
  drawObject(collisionObjects, canvasContext);
  repeatID = requestAnimationFrame(repeatOften);

  if (playerPoints == 10 || aiPoints == 10) {
    window.alert('Won!')
    restartGame();
  }
}

start.addEventListener('click', () => {
  restartGame();
  if (isGameWork == 0 || isGameWork == 2) {
    repeatID = requestAnimationFrame(repeatOften);
  }
  isGameWork = 1;
})

stop.addEventListener('click', () => {
  isGameWork = 2;
  cancelAnimationFrame(repeatID);
})

restart.addEventListener('click', restartGame)

window.addEventListener('keydown', keyboardSupport);