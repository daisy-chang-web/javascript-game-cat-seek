const startMenu = document.getElementById("start-menu");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const creditsDialog = document.getElementById("credits-dialog");
const pauseDialog = document.getElementById("pause-dialog");

const Allbuttons = document.querySelectorAll("button[id]");

const gameTimerOutput = document.getElementById("game-timer");
const currentScore = document.querySelector(".current-score");
const finalScore = document.querySelector(".final-score");
const gameDuration = 30;
let remainingSeconds = gameDuration;
let timerInterval = null;

function updateTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  gameTimerOutput.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function showGameScreen() {
  stopTimer();
  remainingSeconds = gameDuration;
  updateTimer();
  startMenu.hidden = true;
  gameScreen.hidden = false;
  resultScreen.hidden = true;

  timerInterval = setInterval(() => {
    if (pauseDialog.open) return;

    remainingSeconds -= 1;
    updateTimer();

    if (remainingSeconds <= 0) {
      stopTimer();
      finalScore.textContent = currentScore.textContent;
      gameScreen.hidden = true;
      resultScreen.hidden = false;
    }
  }, 1000);
}

function showStartMenu() {
  stopTimer();
  startMenu.hidden = false;
  gameScreen.hidden = true;
  resultScreen.hidden = true;
}

Allbuttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    switch (event.currentTarget.id) {
      case "start-btn":
      case "again-btn":
        showGameScreen();
        break;
      case "back-btn":
        showStartMenu();
        break;
      case "credits-btn":
      case "credits-btn-end":
        creditsDialog.showModal();
        break;
      case "close-credits-btn":
        creditsDialog.close();
        break;
      case "pause-button":
        pauseDialog.showModal();
        break;
      case "continue-btn":
        pauseDialog.close();
        break;
      case "reset-btn":
        pauseDialog.close();
        showGameScreen();
        break;
      case "pause-back-btn":
        pauseDialog.close();
        showStartMenu();
        break;
    }
  });
});

updateTimer();
