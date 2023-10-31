import Cactus from "./Cactus.js";

export default class CactiController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000; //ammount of time where the cactus are created and then stored to adjudicated a random number

  //place the interval between the time the cactus are appearing

  nextCactusInterval = null;
  cacti = [];

  constructor(ctx, cactiImages, scaleRatio, speed) {
    //create a constructor
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.getRandomNumber(
      //indicate that i want a random number
      //set a random number that will act in between the interval max/min
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );

    this.nextCactusInterval = num;
  }

  getRandomNumber(min, max) {
    // here the random number
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {
    const index = this.getRandomNumber(0, this.cactiImages.length - 1); //it mix all the images about cactuses with the random  number previously created
    const cactusImage = this.cactiImages[index]; // cactusImage will mean all the images of cactuses collected
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImage.height; // space that the cactus are p
    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image
    );

    this.cacti.push(cactus); // push images from the java file cactus
  }

  update(gameSpeed, frameTimeDelta) {
    //setting the velocity of the cactus
    if (this.nextCactusInterval <= 0) {
      // need to add a new cactus
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    this.cacti.forEach((cactus) => {
      // on every cactus element apply the following variables
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width); //ni puta idea, esta filtrant algo
  }

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  collideWith(sprite) {
    // saying that it must collide using the fucnction created befpre
    return this.cacti.some((cactus) => cactus.collideWith(sprite));
  }

  reset() {
    this.cacti = []; // when reset turn the cactus into 0 array
  }
}
