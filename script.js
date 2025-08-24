const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");

let currentQuestion = {};
let correctCount = 0;
let wrongCount = 0;
let totalQuestions = 0;

async function fetchQuestion() {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("No questions found");
    }
    return data.results[0];
  } catch (error) {
    questionEl.textContent = "⚠️ Failed to load question.";
    optionsEl.innerHTML = "";
    nextBtn.disabled = true;
  }
}

function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

async function loadQuestion() {
  nextBtn.disabled = true;
  optionsEl.innerHTML = "Loading...";
  const q = await fetchQuestion();
  if (!q) return;

  currentQuestion = q;
  totalQuestions++;

  questionEl.textContent = decodeHTML(q.question);

  const answers = [...q.incorrect_answers, q.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  optionsEl.innerHTML = "";
  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = decodeHTML(ans);
    btn.onclick = () => selectAnswer(ans);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selected) {
  const correct = currentQuestion.correct_answer;
  Array.from(optionsEl.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === decodeHTML(correct)) {
      btn.style.background = "green";
    } else if (btn.textContent === selected) {
      btn.style.background = "red";
    }
  });

  if (selected === correct) {
    correctCount++;
  } else {
    wrongCount++;
  }

  nextBtn.disabled = false;
}

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent = `✅ Correct: ${correctCount} | ❌ Wrong: ${wrongCount} | Total: ${totalQuestions}`;
}

function startQuiz() {
  correctCount = 0;
  wrongCount = 0;
  totalQuestions = 0;
  quizBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  loadQuestion();
}

nextBtn.addEventListener("click", () => {
  if (totalQuestions >= 10) {
    showResult();
  } else {
    loadQuestion();
  }
});

startQuiz();