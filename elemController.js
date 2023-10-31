import Element from "./Element.js";

export default class ElemController {
  ELEMENT_INTERVAL_MIN = 500;
  ELEMENT_INTERVAL_MAX = 2000;

  nextElementInterval = null;
  elem = [];

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
    );

    this.nextElementInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createElement() {
    const index = this.getRandomNumber(0, this.elemImages.length - 1);
    const elementImages = this.elemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - elementImages.height;
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
}
