const startMenu = document.getElementById("start-menu");
const gameScreen = document.getElementById("game-screen");
const pauseScreen = document.getElementById("pause-screen");
const resultScreen = document.getElementById("result-screen");
const creditsScreen = document.getElementById("credits-screen");

const startButton = document.getElementById("start-btn");
const startCreditsButton = document.getElementById("credits-btn");
const pauseButton = document.getElementById("pause-button");
const playAgainButton = document.getElementById("again-btn");
const backToMenuButton = document.getElementById("back-btn");
const resultCreditsButton = document.getElementById("credits-btn-end");

const gameTimerOutput = document.getElementById("game-timer");
const gameScoreOutput = document.getElementById("game-score");
const currentScore = document.querySelector(".current-score");
const maxScore = document.querySelector(".max-score");
const finalScore = document.querySelector(".final-score");

function startGame() {
    startMenu.hidden = true;
    gameScreen.hidden = false;
    resultScreen.hidden = true;
 // resetGameState();
}

function backToMenu() {
    startMenu.hidden = false;
    gameScreen.hidden = true;
    resultScreen.hidden = true;
}

function pauseGame() {
    startMenu.hidden = true;
    gameScreen.hidden = true;
    resultScreen.hidden = false;
}

function resultGame() {
    startMenu.hidden = true;
    gameScreen.hidden = true;
    resultScreen.hidden = false;
}

startButton.addEventListener("click", startGame);
//startCreditsButton.addEventListener("click", showCredits);
pauseButton.addEventListener("click", resultGame);
playAgainButton.addEventListener("click", startGame);
backToMenuButton.addEventListener("click", backToMenu);
//resultCreditsButton.addEventListener("click", showCredits);