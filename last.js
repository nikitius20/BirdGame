const canvas = document.querySelector("canvas");
const scoreText = document.querySelector("#score");
const startBtn = document.querySelector("#start");
const bird = document.querySelector("#bird");
const overlay = document.querySelector("#overlay");
const restartBtn = document.querySelector("#restart");
const context = canvas.getContext("2d");

console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", goUp);

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  //obj.x = mouse.x;
  //obj.y = mouse.y;
});

function drawCircle(x, y, r, color = "blue") {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, 200);
  context.fill();
}

function drawRact(obst) {
  if (obst.type === "wall") {
    context.beginPath();
    context.fillStyle = "green";
    context.rect(obst.x, obst.y, obst.w, obst.h);
    context.stroke();
    context.fill();
  } /* else if (obst.type === "window" || obst.type === "done") {
    context.beginPath();
    context.fillStyle = "lightblue";
    context.rect(obst.x, obst.y, obst.w, obst.h);
    context.stroke();
    context.fill();
  } */
}
let obj = {
  x: 200,
  y: 300,
  r: 50,
  speedY: -15,
};

let score = 0;
const obsticles = [];

function generateObst() {
  if (
    obsticles.length === 0 ||
    obsticles[obsticles.length - 1].x < canvas.width - 400
  ) {
    let height = Math.floor(Math.random() * 300 + 20);
    obsticles.push({ x: canvas.width, y: 0, w: 100, h: height, type: "wall" });
    obsticles.push({
      x: canvas.width,
      y: height,
      w: 100,
      h: 400,
      type: "window",
    });
    obsticles.push({
      x: canvas.width,
      y: height + 400,
      w: 100,
      h: 800,
      type: "wall",
    });
  }
}
function updateObst() {
  obsticles.map((el) => {
    el.x -= 3;
  });
}

function gameOver() {
  overlay.style.display = "block";
}
function deleteObsticle() {
  if (obsticles[0].x + obsticles[0].width < 0) {
    obsticles.shift();
    obsticles.shift();
    obsticles.shift();
  }
}

function goUp() {
  obj.speedY = -20;
}

function calcCollision(obsticle) {
  let center = {
    x: obsticle.x + obsticle.w / 2,
    y: obsticle.y + obsticle.h / 2,
  };
  let k = (obj.y - center.y) / (obj.x - center.x);
  //console.log(k);
  let gipotenusa = Math.sqrt(
    Math.pow(center.x - obj.x, 2) + Math.pow(center.y - obj.y, 2)
  );
  //console.log(gipotenusa);

  let pointX = obj.x - obj.r / (gipotenusa / (obj.x - center.x));
  let pointY = obj.y - obj.r / (gipotenusa / (obj.y - center.y));

  //drawCircle(pointX, pointY, 6, "green");
  //console.log(`pointX = ${pointX} ,pointY= ${pointY}`);

  if (
    pointX > obsticle.x &&
    pointX < obsticle.x + obsticle.w &&
    pointY > obsticle.y &&
    pointY < obsticle.y + obsticle.h &&
    obsticle.type == "wall"
  ) {
    game = false;
  } else if (
    pointX > obsticle.x &&
    pointX < obsticle.x + obsticle.w &&
    pointY > obsticle.y &&
    pointY < obsticle.y + obsticle.h &&
    obsticle.type == "window"
  ) {
    score++;
    obsticle.type = "done";
    scoreText.textContent = "Score : " + score;
  }
}

function updateObj() {
  obj.y = obj.y + obj.speedY;
  obj.speedY = obj.speedY + 1;
  if (obj.y >= canvas.height || obj.y <= 0) {
    game = false;
  }
  bird.style.left = obj.x - obj.r - 25 + "px";
  bird.style.top = obj.y - obj.r + "px";
}

let game = true;

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  updateObj();
  // drawCircle(obj.x, obj.y, obj.r);
  generateObst();
  updateObst();
  deleteObsticle();
  obsticles.map((el) => {
    calcCollision(el);
    drawRact(el);
  });

  if (game) {
    requestAnimationFrame(animate);
  } else {
    gameOver();
  }
}

startBtn.addEventListener("click", start);
function start() {
  animate();
  bird.style.display = "block";
  startBtn.style.display = "none";
}

restartBtn.addEventListener("click", restart);

function restart() {
  game = true;
  overlay.style.display = "none";
  obj = {
    x: 200,
    y: 300,
    r: 50,
    speedY: -15,
  };
  obsticles.splice(0, obsticles.length);
  score = 0;
  animate();
}
