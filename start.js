export default function startGame() {
  document
    .getElementById("start-button")
    .addEventListener("click", function () {
      document.getElementById("intro-game").style.display = "none";
      document.getElementById("in-game").style.display = "block";
    });
}
