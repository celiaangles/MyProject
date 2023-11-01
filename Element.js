export default class Element {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    // create a new method that will program when i am collidding with thw elements
    const adjustBy = 1.4; // programs when is colliding
    if (
      sprite.x < this.x + this.width / adjustBy &&
      sprite.x + sprite.width / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.height + sprite.y / adjustBy > this.y
    ) {
      // score += 10; // Increase the score
      // scoreElement.textContent = score;
      return true;
    } else {
      return false;
    }
  }
}

// update score
// if (collideWith === true) {
// score ++
//}
