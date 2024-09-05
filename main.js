/*
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
*/

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

/* Since these balls will all behave in the same way, it makes sense to represent them with an object. */
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }
  /* Using this function, we can tell the ball to draw itself onto the screen */
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  /* to actually move the ball 
  The first four parts of the function check whether the ball has reached the edge of the canvas. If it has, we reverse the polarity of the relevant velocity to make the ball travel in the opposite direction.
  */
  update() {

    //if the x coordinate is greater than the width of the canvas (the ball is going off the right edge).
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    //if the x coordinate is smaller than 0 (the ball is going off the left edge).
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    //if the y coordinate is greater than the height of the canvas (the ball is going off the bottom edge).
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    //if the y coordinate is smaller than 0 (the ball is going off the top edge).
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }
  /* collision detection 
  so our balls know when they have hit another ball.
  https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  */
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }  
}

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
  );

  balls.push(ball);
}

function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";

  /*This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving!  */
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    /* you'll see your balls change color when they collide! */
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();
