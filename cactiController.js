//IMPORTING THE CACTUS JS
import Cactus from "./Cactus.js";

//DEFINE THE OBSTACLE SETTINGS
export default class CactiController {
  //INTERVAL WHERE THE CACTUS WILL BE LOADED RANDOMLY AND CALLING THE OBSTACLES EMPTY ARRAY
  CACTUS_INTERVAL_MIN = 700;
  CACTUS_INTERVAL_MAX = 3000;
  nextCactusInterval = null;
  cacti = [];

  //CREATE CONSTRUCTOR WITH THE SETTINGS THE ARRAY OF OBSTACLES WILL HAVE
  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactusTime();
  }

  //SETTING THE TIME THE NEXT CACTUS WILL APPEAR USING THE RANDOM NUMBER
  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );
    this.nextCactusInterval = num;
  }

  //CREATING THE RANDOM NUMBER FUNCTION
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //CREATING A FUNCTION THAT GENERATE THE OBSTACLES
  createCactus() {
    const index = this.getRandomNumber(0, this.cactiImages.length - 1);
    const cactusImage = this.cactiImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImage.height;
    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image
    );

    this.cacti.push(cactus);
  }

  //UPDATING THE OBSTACLES WITH THE FOLLOWING SETTINGS
  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;
    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width); //ni puta idea, esta filtrant algo
  }

  //DRAWING EVERY OBSTACLE FROM THE ARRAY TO SCREEN
  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  //IF OBSTACLE COLLIDES WITH PLAYER
  collideWith(sprite) {
    return this.cacti.some((cactus) => cactus.collideWith(sprite));
  }

  //WHEN RESET TURN THE OBSTACLES ARRAY BACK TO 0
  reset() {
    this.cacti = [];
  }
}
