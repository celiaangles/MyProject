export default function winner() {
  document
    .getElementById("restart-button")
    .addEventListener("click", function () {
      document.getElementById("intro-game").style.display = "block";
      document.getElementById("in-game").style.display = "none";
      document.getElementById("winner").style.display = "none";
    });
}

// try to link the new page js winner to the start-button so when u win u have the possibility to be redirected to main page
