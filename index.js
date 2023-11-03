//LOADING THE JS FILES
import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import ElemController from "./ElemController.js";
import Score from "./Score.js";
import startGame from "./start.js";
import winner from "./winner.js";

//CALLING THE WINNER PAGE
winner();

//CALLING THE START GAME AND LINKNG THE GAME INTRO BY ITS ID
startGame();
const gameIntro = document.getElementById("game-intro");

//CREATING CONSTANT CANVAS OVER ID GAME AND ALLOWING RENDERING ON 2D BY CONTEXT
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//PRESETTINGS OF THE GAME
const GAME_SPEED_START = 0.75;
const GAME_SPEED_INCREMENT = 0.00001;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 300;
const PLAYER_WIDTH = 88 / 1.2;
const PLAYER_HEIGHT = 94 / 1.2;
const MAX_JUMP_HEIGHT = GAME_HEIGHT / 1.2;
const MIN_JUMP_HEIGHT = GAME_HEIGHT / 2;
const GROUND_WIDTH = 570;
const GROUND_HEIGHT = 60;
const GROUND_AND_CACTUS_SPEED = 0.3;

//DISPLAYING THE OBSTACLES
const CACTI_CONFIG = [
  { width: 100 / 1, height: 100 / 1, image: "images/sakura.png" },
  { width: 150 / 1.5, height: 120 / 1.5, image: "images/japan.png" },
];

//DISPLAYING THE ELEMENTS
const ELEM_CONFIG = [
  {
    width: 100 / 1.5,
    height: 100 / 1.5,
    image: "images/sword Background Removed.png",
  },
];

//PREPARING CONDITIONALS TO NULL, IN ORDER TO ACTIVATE LATER AS A RESULT OF FUTURE ACTIONS
let player = null;
let ground = null;
let cactiController = null;
let elemController = null;
let score = null;
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;
let waitingTotReset = false;

//CREATING PLAYER SETTINGS RELATED TO THE SCALE RATIO OF THE SCREEN (KINDA MEDIA QUERY THINGY)
function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  //GIVING STRUCTURE AND BODY (CTX) TO THE PLAYER
  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  //GIVING STRUCTURE AND BODY (CTX) TO THE GROUND
  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );

  //CALLING THE ELEMENT ARRAY AND ADAPTING IT TO THE SCREEN
  const elemImages = ELEM_CONFIG.map((element) => {
    const image = new Image();
    image.src = element.image;
    return {
      image: image,
      width: element.width * scaleRatio,
      height: element.height * scaleRatio,
    };
  });

  //DEFINING THE ELEMENT CONTROLLER SETTINGS
  elemController = new ElemController(
    ctx,
    elemImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  //CALLING THE OBSTACLES ARRAY AND ADAPTING IT TO THE SCREEN
  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  //DEFINING THE OBSTACLES CONTROLLER SETTINGS
  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );
  //HERE I AM SETTING THE SCORE PARAMETER
  score = new Score(ctx, scaleRatio);
}

//CREATING A FUNCTION THAT LOADS THE SCREEN WHERE THE ACTION WHOULD TAKE PLACE
function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

//USE SET TIMEOUT ON SAFARI MOBILE ROATION
setScreen();
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

//MAKING THE GRAPHICS ADAPTATIVE TO DIFFERENT SCREEN SIZES (RESPONSIVE)
function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

//CREATING A FUNCTION THAT WILL BE DISPLAYED WHEN THE GAME ENDS
function showGameOver() {
  const fontSize = 30 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "red";
  const x = canvas.width / 2.5;
  const y = canvas.height / 2;
  ctx.fillText("press space to restart the game", x, y);
}

//POSSIBILITY TO RESTART PRESSING SPACE AFTER ONE SECOND DELAY
function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;
    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

//REINICIATE THE GAME SETTINGS TO 0 AFTER ACTIVATING RESET
function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  waitingTotReset = false;
  ground.reset();
  cactiController.reset();
  elemController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

//SHOWING THE INDICATION TO START THE GAME PRESSING SPACE
function showStartGameText() {
  const fontSize = 30;
  ctx.font = `${fontSize}px  Bebas Neue`;
  ctx.fillStyle = "red";
  const x = canvas.width - 240;
  const y = canvas.height / 7;
  ctx.fillText("PRESS SPACE TO START", x, y);
}

//SHOWING THE INDICATION TO RESTART THE GAME PRESSING SPACE
function showEndGameText() {
  const fontSize = 30;
  ctx.font = `${fontSize}px Bebas Neue`;
  ctx.fillStyle = "red";
  const x = canvas.width - 260;
  const y = canvas.height / 7;
  ctx.fillText("PRESS SPACE TO RESTART", x, y);
}

//PROGRAMMING THE INCREMENTION OF THE SPEED GAME
function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

//ACTION TO CLEAN THE DRAWINGS ON CANVAS AFTER APPEARENCE
function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//
function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    console.log("loopTime");
    return;
  }

  //FRAME TIME DELTA REPRESENTS TIME ELAPSED BETWEEN TWO CONSECUTIVE FRAMES IN A LOOP
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  //CALLING THE CLEAN SCREEN FUNCTION IN ORDER TO BE ABLE TO REDRAW
  clearScreen();

  //IF THE GAME IS STILL RUNNING AND WE ARE NOT WAITING TO START AGAIN, THE FOLLOWING ITEMS WILL BE ACTUALIZED WITH FT DELTA AND THE GAME SPEED
  if (!gameOver && !waitingToStart) {
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    elemController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  //IF THE GAME IS NOT OVER AND THE PLAYER COLLIDES WITH OBSTACLE ACTIVATE THE RESET AND INICIATES THE "GAME OVER"
  if (!gameOver && cactiController.collideWith(player)) {
    waitingTotReset = true;
    console.log("collision");
    gameOver = true;
    setupGameReset();
  }

  //IF THE GAME IS RUNNING AND THE PLAYER COLLIDES WITH AN ELEMENT, THEN INCREMENT THE SCORE TO 0NE
  if (!gameOver && elemController.collideWith(player)) {
    gameOver = false;
    console.log("collision");
    score.incrementScore();
  }

  //CALLING THE OBJECTS TO BE DRAWN ON SCREEN
  ground.draw();
  cactiController.draw();
  elemController.draw();
  player.draw();
  score.draw();

  //IF WAITING TO START IS TRUE, SHOW THE START TEXT
  if (waitingToStart) {
    showStartGameText();
  }

  //IF WAITING TO RESET IS TRUE, SHOW THE RESTART TEXT
  if (waitingTotReset) {
    showEndGameText();
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

//CALLING ACTIONS THAT CAN HAPPEN ON THE SCREEN
window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
