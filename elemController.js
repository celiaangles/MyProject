import Element from "./Element.js";

export default class ElemController {
  ELEMENT_INTERVAL_MIN = 500;
  ELEMENT_INTERVAL_MAX = 2000;

  nextElementInterval = null;
  elem = []; // INTERVAL FOR APPEARENCE

  ///ACHTUNG THIS IS NEW
  ELEMENT_INTERVAL_MIN02 = 350;
  ELEMENT_INTERVAL_MAX02 = 200;

  nextElementInterval02 = null;
  elem = [];

  //ACHTUNG THIS IS NEW

  constructor(ctx, elemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.elemImages = elemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.setNextElementTime();
  }

  setNextElementTime() {
    const num = this.getRandomNumber(
      this.ELEMENT_INTERVAL_MIN,
      this.ELEMENT_INTERVAL_MAX
    ); // INTERVAL APPEARENCE

    this.nextElementInterval = num;
  }

  ///ACHTUNG THIS IS NEW
  setNextElementTime02() {
    const num = this.getRandomNumber02(
      this.ELEMENT_INTERVAL_MIN02,
      this.ELEMENT_INTERVAL_MAX02
    );

    this.nextElementInterval02 = num;
  }
  //ACHTUNG THIS IS NEW

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } // RANDOM NUMBER FOR COINS APPEARING

  //ACHTUNG THIS IS NEW
  getRandomNumber02(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  //ACHTUNG THIS IS NEW

  createElement() {
    const index = this.getRandomNumber(0, this.elemImages.length - 1);
    const elementImages = this.elemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber02(25, 150);
    const element = new Element(
      this.ctx,
      x,
      y,
      elementImages.width,
      elementImages.height,
      elementImages.image
    );
    this.elem.push(element);
    console.log(this.elem);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextElementInterval <= 0) {
      this.createElement();
      this.setNextElementTime();
    }
    this.nextElementInterval -= frameTimeDelta;

    this.elem.forEach((e) => {
      e.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });
    this.elem = this.elem.filter((e) => e.x > -e.width);
  }

  draw() {
    this.elem.forEach((e) => e.draw());
  }

  collideWith(sprite) {
    // saying that it must collide using the fucnction created befpre
    return this.elem.some((element) => element.collideWith(sprite));
  }

  reset() {
    this.elem = []; // when reset turn the cactus into 0 array
  } // MAYBE CHANGE THIS WHEN COLLIDE
}
