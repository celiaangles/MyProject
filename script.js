//board
let board;
let boardWidth = 900;
let boardHeight = 440;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 9;
let birdY = 350;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let bottomPipeImg;

//coin
let coinArray = [];
let coinWidth = 64; //width/height ratio = 384/3072 = 1/8
let coinHeight = 64; // i want to change the hight!
let coinX = boardWidth / 2; // com puc canviar alsada
let coinY = 0;

let coinImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //load images
  birdImg = new Image();
  birdImg.src = "./images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./images/bottompipe.pngbottompipe.png";

  coinImg = new Image();
  coinImg.src = "./images/5a39d716527a49.42077263151374005433784147.png";

  //PA QUE ESTO

  requestAnimationFrame(update);

  //Math.random() * (pipeHeight / 2)pipeHeight / 4 - Math.random()

  setInterval(placePipes, Math.random() * window.innerWidth + "300"); //every 1.5 seconds
  setInterval(placeCoin, 6000 - Math.random() * 3000); //neeed to define placeCoin
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  //apply gravity to current bird.y, limit the bird.y to top of the canvas
  // create a math max so te bird it can be "running"
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //removes first element from the array
  }

  //coins
  for (let i = 0; i < coinArray.length; i++) {
    let coin = coinArray[i];
    coin.x += velocityX;
    context.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height);
  }

  // clear coins

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  //(0-1) * pipeHeight/2.
  // 0 -> -128 (pipeHeight/4)
  // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 2;

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function placeCoin() {
  let coinCo = {
    img: coinImg,
    x: coinX,
    y: coinY,
    width: coinWidth,
    height: coinHeight,
    passed: false,
  };
  coinArray.push(coinCo);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}
