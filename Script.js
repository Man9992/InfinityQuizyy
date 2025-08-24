let score = 0;
let wrong = 0;
let currentQuestion = 0;
const TOTAL = 10;

const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');

async function fetchQuestion() {
  try {
    const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
    const data = await res.json();
    if (!data.results || !data.results.length) throw "No API data";
    const q = data.results[0];
    const question = decodeHTML(q.question);
    const correct = decodeHTML(q.correct_answer);
    const incorrect = q.incorrect_answers.map(decodeHTML);
    return { question, correct, incorrect };
  } catch (e) {
    // fallback local math question
    const a = Math.floor(Math.random()*50)+1;
    const b = Math.floor(Math.random()*50)+1;
    return {
      question: `What is ${a} + ${b}?`,
      correct: String(a+b),
      incorrect: [String(a+b+1), String(a+b-1), String(a+b+2)]
    };
  }
}

function decodeHTML(str){
  const t = document.createElement('textarea');
  t.innerHTML = str;
  return t.value;
}

async function showQuestion() {
  nextBtn.disabled = true;
  optionsEl.innerHTML = '';
  const q = await fetchQuestion();
  currentQuestion++;
  questionEl.innerText = q.question;
  const choices = shuffle([q.correct, ...q.incorrect]);
  choices.forEach(opt => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.classList.add('option-btn');
    btn.onclick = () => selectAnswer(opt, q.correct);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selected, correct) {
  [...optionsEl.children].forEach(btn=>{
    btn.disabled = true;
    if(btn.innerText===correct) btn.style.background='#2ecc71';
    if(btn.innerText===selected && selected!==correct) btn.style.background='#e74c3c';
  });
  if(selected===correct) score++;
  else wrong++;
  nextBtn.disabled = false;
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]]=[arr[j], arr[i]];
  }
  return arr;
}

function showResult(){
  quizBox.classList.add('hidden');
  resultBox.classList.remove('hidden');
  scoreEl.innerText = `✅ Correct: ${score} | ❌ Wrong: ${wrong}`;
}

nextBtn.onclick = () => {
  if(currentQuestion>=TOTAL) showResult();
  else showQuestion();
}

function startQuiz(){
  score = 0;
  wrong = 0;
  currentQuestion = 0;
  quizBox.classList.remove('hidden');
  resultBox.classList.add('hidden');
  showQuestion();
}

// start infinite quiz
startQuiz();