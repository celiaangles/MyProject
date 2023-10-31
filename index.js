import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import ElemController from "./ElemController.js"; //link the java file with the instructions of element controller
import Score from "./Score.js";

const canvas = document.getElementById("game"); // reference to canvas
const ctx = canvas.getContext("2d"); // to draw the context here

const GAME_SPEED_START = 0.8; // 1.0
const GAME_SPEED_INCREMENT = 0.0001;

const GAME_WIDTH = 600;
const GAME_HEIGHT = 300; // ORIGINAL NUMBER WAS 200 (when i changed the obstacles changed as well)
const PLAYER_WIDTH = 88 / 1.2;
const PLAYER_HEIGHT = 94 / 1.2;
const MAX_JUMP_HEIGHT = GAME_HEIGHT / 1.2;
const MIN_JUMP_HEIGHT = GAME_HEIGHT / 2;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.3;

const CACTI_CONFIG = [
  // array of objects which will be the images that will appear
  { width: 48 / 0.8, height: 100 / 0.8, image: "images/cactus_1.png" }, //set the siye and load the image linked
  { width: 98 / 1.2, height: 100 / 1.2, image: "images/cactus_2.png" },
  { width: 68 / 2, height: 70 / 2, image: "images/cactus_3.png" },
];

//PLACE IMAGES FROM COINS
const ELEM_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/element_01.jpg" },
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/element_02.png" },
];

//Game Objects
let player = null;
let ground = null;
let cactiController = null;
let elemController = null; //element
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false; // creating game over
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );

  //elements

  const elemImages = ELEM_CONFIG.map((element) => {
    //iterate over every element from array
    const image = new Image();
    image.src = element.image;
    return {
      // object that we are returning
      image: image,
      width: element.width * scaleRatio,
      height: element.height * scaleRatio,
    };
  });

  elemController = new ElemController(
    ctx,
    elemImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED //must change
  );

  //THE PROBLEM IS HERE!

  //load images
  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController( //call the cacti controller function
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
  //number that we are using to multiply every high and width on our screen
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "red";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("TUT MIR LEID", x, y);
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  elemController.reset(); //added new be careful
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

function showStartGameText() {
  const fontSize = 30 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "blue";
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("What are u waiting for you idiot", x, y);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = "aquamarine";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameOver && !waitingToStart) {
    //Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    elemController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (
    !gameOver &&
    cactiController.collideWith(player)
    //ACTIVATE THIS IF U WANT TO COLLIDE WITH COINS
    //||
    // (!gameOver && elemController.collideWith(player))
  ) {
    //here i am adding something new
    gameOver = true;
    setupGameReset();
    score.setHighScore();
  }

  //When colliding with coin

  //Draw game objects
  ground.draw();
  cactiController.draw();
  elemController.draw(); //disapearing other elements
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
