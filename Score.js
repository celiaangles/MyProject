export default class Score {
  score = 0;
  //HIGH_SCORE_KEY = "highScore";

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // update (score){
  // if (collideWith === true) {
  // score ++
  //}}

  //update(frameTimeDelta) {
  //this.score += frameTimeDelta * 0.01; // must add instead of framwe delta LINK TO WHen the dinosour collides element
  // }

  reset() {
    this.score = 0;
  }

  incrementScore() {
    this.score++;
    if (this.score > 2) {
      document.getElementById("in-game").style.display = "none";
      document.getElementById("intro-game").style.display = "none";
      document.getElementById("winner").style.display = "block";

      //THE PROBLEM IS THAT THIS IS INVOKING GAME OVER, FOR INSTANCE ACTIVATE THE 5000 RESTART
    }
  }

  //setHighScore() {
  //const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
  //if (this.score > highScore) {
  //localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
  //}
  //}

  draw() {
    //const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 40 * this.scaleRatio;

    const fontSize = 30;
    this.ctx.font = `${fontSize}px serif`;

    this.ctx.fillStyle = "#df1726"; //JULIA
    const scoreX = this.canvas.width - 585 * this.scaleRatio;
    this.ctx.font = `${fontSize}px  Bebas Neue`;
    //const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(1, 2);
    //const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`${scorePadded} KATANA`, scoreX, y);
    //this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    //const fontSize = 30;
    //ctx.font = `${fontSize}px  Bebas Neue`;
    //ctx.fillStyle = "red";
    //const x = canvas.width - 260;
    //const y = canvas.height / 7;
    //ctx.fillText("PRESS SPACE TO RESTART", x, y);
  }
}
