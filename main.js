//board
var canvas;
var canvasWidth = 600;
var canvasHeight = 650;
var ctx;

//bird
var birdWidth = 40;
var birdHeight = 30;
var birdX = canvasWidth / 8;
var birdY = canvasHeight / 2;

var bird = {
  X: birdX,
  Y: birdY,
  width: birdWidth,
  height: birdHeight,
};
//images
var birdImage;
//properties
var velocityX = -2;
var velocity = 0;
var gravity = 0.3;

//columns
var columArray = [],
  columWidth = 100,
  columHeight = 400,
  columX = canvasWidth,
  columY = 0;

// images colum
var topImage;
var bottomImage;

//GameOver
let gamerOver = false;

//score
var score = 0;

window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  //draw bird
  birdImage = new Image();
  birdImage.src = "./bird.png";

  //top colum
  topImage = new Image();
  topImage.src = "./toppipe.png";

  bottomImage = new Image();
  bottomImage.src = "./bottompipe.png";

  topImage.onload = function () {
    ctx.drawImage(topImage, columX, columY, columWidth, columHeight);
  };
  update();
  setInterval(displacement, 2000);
};

function jump(e) {
  if (e.key === "w" || e.keyCode === 32) {
    velocity = -6;
  }

  if (
    (gamerOver === true && e.keyCode === 32) ||
    (gamerOver === true && e.key === "w") ||
    ("click" && gamerOver === true)
  ) {
    location.reload();
  }
}

//update
function update() {
  if (gamerOver) {
    var musicOver = new Audio("gameover.mp3");
    musicOver.play();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(birdImage, bird.X, bird.Y, bird.width, bird.height);

  //generate columns
  for (let i = 0; i < columArray.length; i++) {
    let columns = columArray[i];
    ctx.drawImage(
      columns.image,
      columns.X,
      columns.Y,
      columns.width,
      columns.height
    );
    columns.X += velocityX;
    //Collition
    if (
      bird.Y < columns.Y + columns.height &&
      bird.Y + bird.height > columns.Y &&
      bird.X + bird.width > columns.X &&
      bird.X < columns.X + columns.width
    ) {
      gamerOver = true;
    }

    if (!columns.past && bird.X > columns.X + columns.width) {
      columns.past = true;
      score += 0.5;
    }
  }
  if (bird.Y > canvas.height) {
    gamerOver = true;
  }
  //fallingDown
  velocity += gravity;

  bird.Y = Math.max(bird.Y + velocity, 0);
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText(score, 20, 50);
  requestAnimationFrame(update);
}

function displacement() {
  var randomColumnY =
    columY - columHeight / 4 - (Math.random() * columHeight) / 2;

  var space = 150;
  let topColum = {
    image: topImage,
    X: columX,
    Y: randomColumnY,
    width: columWidth,
    height: columHeight,
    past: false,
  };
  columArray.push(topColum);

  let bottomColumn = {
    image: bottomImage,
    X: columX,
    Y: randomColumnY + columHeight + space,
    width: columWidth,
    height: columHeight,
    past: false,
  };
  columArray.push(bottomColumn);
}

window.addEventListener("keypress", jump);
window.addEventListener("click", () => {
  velocity = -6;
});
