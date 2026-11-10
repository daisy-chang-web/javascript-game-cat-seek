const Allbuttons = document.querySelectorAll("button[id]");

const startMenu = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const levelDialog = document.getElementById("level-dialog");
const creditsDialog = document.getElementById("credits-dialog");
const pauseDialog = document.getElementById("pause-dialog");
const countdownDisplay = document.getElementById("countdown");

const gameTimerOutput = document.getElementById("game-timer");
const currentScore = document.querySelector(".current-score");
const finalScore = document.querySelector(".final-score");
const resultMessage = document.getElementById("game-result-title");
const spots = document.querySelectorAll(".spot");

const gameDuration = 30;
let remainingSeconds = gameDuration;
let timerID = null;
let countdownID = null;

let score = 0;
let total = 0;
let lastSpot = null;
let isPetted = false;

let catSpawnTimerID = null;
let catSpawnInterval = 700;
let duration = 950;
let stayTime = 200;

const levels = [
  { difficulty: "easy", catSpawnInterval: 1000, duration: 1500, stayTime: 300 },
  {
    difficulty: "medium",
    catSpawnInterval: 900,
    duration: 1000,
    stayTime: 250,
  },
  { difficulty: "hard", catSpawnInterval: 700, duration: 950, stayTime: 200 },
];

const cats = [
  {
    emotion: "Energetic",
    breed: "orange",
    pet: "feels very happy",
    miss: "make a funny face",
  },
  {
    emotion: "grumpy",
    breed: "tabby",
    pet: "feels happy",
    miss: "feels upset",
  },
  { emotion: "shy", breed: "calico", pet: "feels happy", miss: "feels sad" },
  { emotion: "angry", breed: "black", pet: "feels furious", miss: "hates you" },
];

// level selection logic----------------
function setLevel(levelName) {
  const level = levels.find((lvl) => lvl.difficulty === levelName);
  if (level) {
    catSpawnInterval = level.catSpawnInterval;
    duration = level.duration;
    stayTime = level.stayTime;
  }
}

// timer settings---------------
function updateTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  gameTimerOutput.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
  clearInterval(timerID);
  timerID = null;
}

// countdown logic----------
function startCountdown(onComplete) {
  let count = 3;

  clearInterval(countdownID);
  countdownDisplay.hidden = false;
  countdownDisplay.textContent = count;

  countdownID = setInterval(() => {
    count--;

    if (count > 0) {
      countdownDisplay.textContent = count;
    } else if (count === 0) {
      countdownDisplay.textContent = "GO!";
    } else {
      clearInterval(countdownID);
      countdownID = null;
      countdownDisplay.hidden = true;
      onComplete();
    }
  }, 1000);
}

// game logic-----------------------------------------------------------------------------

function getRandomCat() {
  const randomIndex = Math.floor(Math.random() * cats.length);
  return cats[randomIndex];
}

function getRandomSpot() {
  const randomIndex = Math.floor(Math.random() * spots.length);
  const selectedSpot = spots[randomIndex];
  if (selectedSpot === lastSpot) {
    return getRandomSpot();
  }
  lastSpot = selectedSpot;
  return selectedSpot;
}

function removeCat(spot) {
  setTimeout(() => {
    spot.classList.remove("show");
    isPetted = false;
  }, stayTime);
}

function showSingleCat() {
  if (remainingSeconds < duration / 1000) return;
  const spot = getRandomSpot();
  const CurrentCat = getRandomCat();
  const catImg = spot.querySelector(".cat");

  spot.classList.add("show");
  catImg.src = `images/cat-${CurrentCat.emotion}-idle.png`;
  catImg.alt = `${CurrentCat.emotion} ${CurrentCat.breed} cat peeking out`;

  catImg.onclick = () => {
    if (!isPetted && spot.classList.contains("show")) {
      isPetted = true;
      catImg.src = `images/cat-${CurrentCat.emotion}-pet.png`;
      catImg.alt = `${CurrentCat.emotion} ${CurrentCat.breed} cat ${CurrentCat.pet}`;
      removeCat(spot);

      score++;
      currentScore.textContent = score;
    }
  };

  setTimeout(() => {
    if (!isPetted && spot.classList.contains("show")) {
      catImg.src = `images/cat-${CurrentCat.emotion}-miss.png`;
      catImg.alt = `${CurrentCat.emotion} ${CurrentCat.breed} cat ${CurrentCat.miss}`;
      removeCat(spot);
    }
  }, duration);

  total++;
  document.querySelectorAll(".total-cats").forEach((element) => {
    element.textContent = total;
  });
}

function stopCatSpawner() {
  clearInterval(catSpawnTimerID);
  catSpawnTimerID = null;
}

function updateResultMessage() {
  if (score / total >= 4 / 5) {
    resultMessage.textContent = "You caught us! Fine, you win! 😸";
  } else if (score / total >= 1 / 2) {
    resultMessage.textContent = "Is that all? I wasn't even trying! 😼";
  } else if (score / total >= 1 / 4) {
    resultMessage.textContent = "You gotta be quicker next time~ 🐾";
  } else {
    resultMessage.textContent = "Don't you like cats...? 😿";
  }
}

//screen switching functions-----------------------------------------------------------------------------
function showGameScreen() {
  stopTimer();
  stopCatSpawner();
  remainingSeconds = gameDuration;
  updateTimer();

  score = 0;
  total = 0;
  currentScore.textContent = score;
  document.querySelectorAll(".total-cats").forEach((element) => {
    element.textContent = total;
  });

  startMenu.hidden = true;
  gameScreen.hidden = false;
  resultScreen.hidden = true;

  startCountdown(() => {
    timerID = setInterval(() => {
      if (pauseDialog.open) return;

      remainingSeconds -= 1;
      updateTimer();

      if (remainingSeconds <= 0) {
        stopTimer();
        stopCatSpawner();
        finalScore.textContent = currentScore.textContent;
        document.querySelectorAll(".total-cats").forEach((element) => {
          element.textContent = total;
        });
        gameScreen.hidden = true;
        resultScreen.hidden = false;
        updateResultMessage();
      }
    }, 1000);

    catSpawnTimerID = setInterval(() => {
      if (pauseDialog.open || remainingSeconds <= 0) return;
      showSingleCat();
    }, catSpawnInterval);
  });
}

function showStartMenu() {
  stopTimer();
  stopCatSpawner();
  clearInterval(countdownID);
  countdownID = null;
  countdownDisplay.hidden = true;
  startMenu.hidden = false;
  gameScreen.hidden = true;
  resultScreen.hidden = true;
}

// button event listeners-----------------------------------------------------------------------------
Allbuttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    switch (event.currentTarget.id) {
      case "start-btn":
        levelDialog.showModal();
        break;
      case "easy-btn":
        setLevel("easy");
        levelDialog.close();
        showGameScreen();
        break;
      case "medium-btn":
        setLevel("medium");
        levelDialog.close();
        showGameScreen();
        break;
      case "hard-btn":
        setLevel("hard");
        levelDialog.close();
        showGameScreen();
        break;
      case "close-level-btn":
        levelDialog.close();
        break;
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
