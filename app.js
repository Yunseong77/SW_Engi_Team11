const consonants = [
  { char: "ก", name: "gor gai" },
  { char: "ข", name: "khor khai" },
  { char: "ฃ", name: "khor khuat" },
  { char: "ค", name: "khor khwai" },
  { char: "ฅ", name: "khor khon" },
  { char: "ฆ", name: "khor rakhang" },
  { char: "ง", name: "ngor ngu" },
  { char: "จ", name: "jor jan" },
  { char: "ฉ", name: "chor ching" },
  { char: "ช", name: "chor chang" },
  { char: "ซ", name: "sor so" },
  { char: "ฌ", name: "chor choe" },
  { char: "ญ", name: "yor ying" },
  { char: "ฎ", name: "dor chada" },
  { char: "ฏ", name: "tor patak" },
  { char: "ฐ", name: "thor than" },
  { char: "ฑ", name: "thor montho" },
  { char: "ฒ", name: "thor phuthao" },
  { char: "ณ", name: "nor nen" },
  { char: "ด", name: "dor dek" },
  { char: "ต", name: "tor tao" },
  { char: "ถ", name: "thor thung" },
  { char: "ท", name: "thor thahan" },
  { char: "ธ", name: "thor thong" },
  { char: "น", name: "nor nu" },
  { char: "บ", name: "bor baimai" },
  { char: "ป", name: "por pla" },
  { char: "ผ", name: "phor phueng" },
  { char: "ฝ", name: "for fa" },
  { char: "พ", name: "phor phan" },
  { char: "ฟ", name: "for fan" },
  { char: "ภ", name: "phor samphao" },
  { char: "ม", name: "mor ma" },
  { char: "ย", name: "yor yak" },
  { char: "ร", name: "ror ruea" },
  { char: "ล", name: "lor ling" },
  { char: "ว", name: "wor waen" },
  { char: "ศ", name: "sor sala" },
  { char: "ษ", name: "sor ruesi" },
  { char: "ส", name: "sor suea" },
  { char: "ห", name: "hor hip" },
  { char: "ฬ", name: "lor chula" },
  { char: "อ", name: "or ang" },
  { char: "ฮ", name: "hor nokhuk" }
];

let hearts = 3;
let current = null;
let gameOver = false;
let known = new Set();

let playerName = "";
let startCount = 0;

const heartsEl = document.getElementById("hearts");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const bigChar = document.getElementById("bigChar");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const answerLineEl = document.getElementById("answerLine");
const remainingCounterEl = document.getElementById("remainingCounter");

const nicknameInput = document.getElementById("nicknameInput");
const playerNicknameEl = document.getElementById("playerNickname");
const playerStartsEl = document.getElementById("playerStarts");

function setHearts() {
  heartsEl.textContent = "❤️".repeat(hearts);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function updateRemainingCounter() {
  if (!remainingCounterEl) return;
  const remaining = consonants.length - known.size;
  remainingCounterEl.textContent = `Remaining: ${remaining}`;
}

function updatePlayerInfo() {
  if (playerNicknameEl) {
    playerNicknameEl.textContent = playerName || "player";
  }

  if (playerStartsEl) {
    playerStartsEl.textContent = ` — Starts: ${startCount}`;
  }
}

function pickNextConsonant() {
  const remainingList = consonants.filter((c) => !known.has(c.char));
  if (remainingList.length === 0) return null;
  return remainingList[Math.floor(Math.random() * remainingList.length)];
}

function disableChoices() {
  [...choicesEl.querySelectorAll("button")].forEach((b) => {
    b.disabled = true;
  });
}

function pickQuestion() {
  resultEl.textContent = "";
  resultEl.className = "result";
  answerLineEl.textContent = "";

  current = pickNextConsonant();

  if (!current) {
    gameOver = true;
    bigChar.textContent = "🎉";
    resultEl.textContent = "All consonants completed!";
    resultEl.classList.add("ok");
    answerLineEl.textContent = `Score: ${known.size} / ${consonants.length}`;
    choicesEl.innerHTML = "";
    restartBtn.classList.remove("hidden");
    updateRemainingCounter();
    return;
  }

  bigChar.textContent = current.char;

  const wrongPool = consonants.filter(
    (c) => c.char !== current.char && !known.has(c.char)
  );

  const fallbackWrongPool = consonants.filter((c) => c.char !== current.char);
  const poolToUse = wrongPool.length >= 2 ? wrongPool : fallbackWrongPool;

  const wrongs = shuffle(poolToUse).slice(0, 2);
  const options = shuffle([current, ...wrongs]);

  choicesEl.innerHTML = "";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = opt.name;
    btn.disabled = gameOver;

    btn.addEventListener("click", () => handleAnswer(opt));
    choicesEl.appendChild(btn);
  });

  updateRemainingCounter();
}

function handleAnswer(selected) {
  if (gameOver) return;

  const correct = selected.char === current.char;

  if (correct) {
    resultEl.textContent = "✓ Correct";
    resultEl.className = "result ok";
    answerLineEl.textContent = `${current.char} — ${current.name}`;

    known.add(current.char);
    updateRemainingCounter();

    setTimeout(() => {
      if (!gameOver) {
        pickQuestion();
      }
    }, 700);
  } else {
    hearts -= 1;
    setHearts();
    resultEl.textContent = "✗ Incorrect";
    resultEl.className = "result bad";

    if (hearts <= 0) {
      gameOver = true;
      answerLineEl.textContent = "Game Over";
      disableChoices();
      restartBtn.classList.remove("hidden");
    }
  }
}

function startGame() {
  playerName = nicknameInput && nicknameInput.value.trim()
    ? nicknameInput.value.trim()
    : "player";

  startCount += 1;
  updatePlayerInfo();

  hearts = 3;
  gameOver = false;
  known = new Set();

  setHearts();
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  restartBtn.classList.add("hidden");

  updateRemainingCounter();
  pickQuestion();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

setHearts();
updateRemainingCounter();
updatePlayerInfo();