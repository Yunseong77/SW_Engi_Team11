// ✅ 너가 python에 적어둔 44개를 여기로 옮겨서 완성하면 됨
// 형식: { char: "ก", name: "gor gai" }
const consonants = [
  { char: "ก", name: "gor gai" },
  { char: "ข", name: "khor khai" },
  { char: "ค", name: "khor khwai" },
  // ... 나머지 44개 채우기
];

let hearts = 3;
let current = null;
let gameOver = false;

const heartsEl = document.getElementById("hearts");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const bigChar = document.getElementById("bigChar");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const answerLineEl = document.getElementById("answerLine");

function setHearts() {
  heartsEl.textContent = "❤️".repeat(hearts);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function pickQuestion() {
  resultEl.textContent = "";
  resultEl.className = "result";
  answerLineEl.textContent = "";

  current = consonants[Math.floor(Math.random() * consonants.length)];
  bigChar.textContent = current.char;

  // pick 2 wrong
  const wrongPool = consonants.filter(c => c.char !== current.char);
  const wrongs = shuffle(wrongPool).slice(0, 2);

  const options = shuffle([current, ...wrongs]);

  choicesEl.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = opt.name;
    btn.disabled = gameOver;

    btn.addEventListener("click", () => handleAnswer(opt));
    choicesEl.appendChild(btn);
  });
}

function disableChoices() {
  [...choicesEl.querySelectorAll("button")].forEach(b => b.disabled = true);
}

function handleAnswer(selected) {
  if (gameOver) return;

  const correct = selected.char === current.char;

  if (correct) {
    resultEl.textContent = "✓ Correct";
    resultEl.classList.add("ok");
    answerLineEl.textContent = `${current.char}  ${current.name}`;
    // 다음 문제로 넘어가고 싶으면 700ms 뒤 자동:
    setTimeout(() => { if (!gameOver) pickQuestion(); }, 700);
  } else {
    hearts -= 1;
    setHearts();
    resultEl.textContent = "✗ Incorrect";
    resultEl.classList.add("bad");

    if (hearts <= 0) {
      gameOver = true;
      resultEl.textContent = "✗ Incorrect";
      answerLineEl.textContent = "Game Over";
      disableChoices();
      restartBtn.classList.remove("hidden");
    }
  }
}

function startGame() {
  hearts = 3;
  gameOver = false;
  setHearts();
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  pickQuestion();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// 초기 하트 표시
setHearts();
