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

// ✅ NEW: 맞춘(정답) 자음 저장
let known = new Set();

const heartsEl = document.getElementById("hearts");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const bigChar = document.getElementById("bigChar");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const answerLineEl = document.getElementById("answerLine");

// ✅ NEW: remaining counter element (index.html에 id="remainingCounter" 하나 추가해야 함)
const remainingCounterEl = document.getElementById("remainingCounter");

function setHearts() {
  heartsEl.textContent = "❤️".repeat(hearts);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ✅ NEW: 남은 자음 카운터 업데이트
function updateRemainingCounter() {
  if (!remainingCounterEl) return; // index.html에 없으면 그냥 무시
  const remaining = consonants.length - known.size;
  remainingCounterEl.textContent = `Remaining consonants: ${remaining}`;
}

// ✅ NEW: 아직 안 맞춘 자음 중에서만 문제 뽑기
function pickNextConsonant() {
  const remainingList = consonants.filter(c => !known.has(c.char));
  if (remainingList.length === 0) return null;
  return remainingList[Math.floor(Math.random() * remainingList.length)];
}

function pickQuestion() {
  resultEl.textContent = "";
  resultEl.className = "result";
  answerLineEl.textContent = "";

  // ✅ NEW: 남은 것만 뽑기
  current = pickNextConsonant();

  // ✅ NEW: 다 맞췄으면 종료
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

  // ✅ NEW: 오답도 "아직 안 맞춘 것"에서만 뽑기 (더 깔끔)
  const wrongPool = consonants.filter(
    c => c.char !== current.char && !known.has(c.char)
  );

  // 만약 남은 게 적어서 wrongPool이 부족하면, 전체에서라도 뽑기
  const fallbackWrongPool = consonants.filter(c => c.char !== current.char);

  const poolToUse = wrongPool.length >= 2 ? wrongPool : fallbackWrongPool;

  const wrongs = shuffle([...poolToUse]).slice(0, 2);
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

  // ✅ NEW: 문제 보여줄 때마다 카운터 업데이트
  updateRemainingCounter();
}

function disableChoices() {
  [...choicesEl.querySelectorAll("button")].forEach(b => (b.disabled = true));
}

function handleAnswer(selected) {
  if (gameOver) return;

  const correct = selected.char === current.char;

  if (correct) {
    resultEl.textContent = "✓ Correct";
    resultEl.classList.add("ok");
    answerLineEl.textContent = `${current.char}  ${current.name}`;

    // ✅ NEW: 맞춘 자음 기록 → 다시 안 나오게 됨
    known.add(current.char);
    updateRemainingCounter();

    // 다음 문제로 넘어가고 싶으면 700ms 뒤 자동:
    setTimeout(() => {
      if (!gameOver) pickQuestion();
    }, 700);
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

  // ✅ NEW: 게임 시작할 때 known 초기화
  known = new Set();

  setHearts();
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  restartBtn.classList.add("hidden");

  // ✅ NEW: 시작 시 카운터 갱신
  updateRemainingCounter();

  pickQuestion();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// 초기 하트 표시
setHearts();
// ✅ NEW: 초기 카운터도 표시(요소가 있으면)
updateRemainingCounter();