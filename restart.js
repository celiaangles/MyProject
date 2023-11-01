export default function restartGame() {
  document
    .getElementById("restart-button")
    .addEventListener("click", function () {
      document.getElementById("intro-game").style.display = "none";
      document.getElementById("in-game").style.display = "none";
      document.getElementById("end-game").style.display = "block";
    });
}

//i think whis page is useless
