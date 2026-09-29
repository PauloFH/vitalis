// Vitalis — jogo web de hábitos saudáveis
const DAYS = [
  {
    day: "Manhã",
    icon: "🍎",
    prompt: "Seu mascote acorda. O que ele come no café da manhã?",
    choices: [
      { label: "Frutas + aveia + água", delta: 15, tip: "Energia e nutrientes para começar bem." },
      { label: "Pular o café da manhã", delta: -10, tip: "Sem energia, o dia começa fraco." },
      { label: "Só doces e salgados", delta: -15, tip: "Pico de açúcar que cai rápido." },
    ],
  },
  {
    day: "Almoço",
    icon: "🥗",
    prompt: "Hora do almoço. Qual é a escolha mais equilibrada?",
    choices: [
      { label: "Proteína + vegetais + carbos", delta: 15, tip: "Equilíbrio sustenta a energia do dia." },
      { label: "Comer só o que apetece", delta: -10, tip: "Falta de nutrientes essenciais." },
      { label: "Fast food", delta: -15, tip: "Gordura e sódio em excesso." },
    ],
  },
  {
    day: "Hidratação",
    icon: "💧",
    prompt: "Durante o dia, o que ele bebe?",
    choices: [
      { label: "Água ao longo do dia", delta: 15, tip: "Hidrata e ajuda o corpo a funcionar." },
      { label: "Esquece de beber", delta: -10, tip: "Desidratação causa cansaço." },
      { label: "Só refrigerante", delta: -15, tip: "Muito açúcar, pouco benefício." },
    ],
  },
  {
    day: "Movimento",
    icon: "🏃",
    prompt: "Como ele se mexe hoje?",
    choices: [
      { label: "Caminhada + alongamento", delta: 15, tip: "Movimento regular fortalece corpo e mente." },
      { label: "Exercício intenso sem descanso", delta: -10, tip: "Excesso sem recuperação cansa." },
      { label: "Ficar sentado o dia todo", delta: -15, tip: "Sedentarismo é ruim para a saúde." },
    ],
  },
  {
    day: "Sono",
    icon: "😴",
    prompt: "Chega a noite. Como ele descansa?",
    choices: [
      { label: "8h + rotina relaxante", delta: 15, tip: "Sono de qualidade recupera o corpo." },
      { label: "Dormir só 4h", delta: -10, tip: "Pouco sono deixa o corpo fraco." },
      { label: "Celular até 3h da manhã", delta: -15, tip: "Tela à noite atrapalha o sono." },
    ],
  },
  {
    day: "Mente & Estresse",
    icon: "🧘",
    prompt: "O dia fica estressante. Como ele cuida da mente?",
    choices: [
      { label: "Respiração + pausas conscientes", delta: 15, tip: "Cuidar da mente reduz o estresse." },
      { label: "Se deixa levar pelo mau humor", delta: -10, tip: "Tensão acumulada desgasta." },
      { label: "Evita o problema e procrastina", delta: -15, tip: "Ignorar estresse piora o dia." },
    ],
  },
  {
    day: "Fim do dia",
    icon: "🌙",
    prompt: "Encerrando o dia, o que ele faz?",
    choices: [
      { label: "Desconecta, caminha e reflete", delta: 15, tip: "Encerrar bem prepara para o próximo dia." },
      { label: "Comer tarde + dormir tarde", delta: -10, tip: "Rotina bagunçada desequilibra." },
      { label: "Maratona de telas", delta: -15, tip: "Tela em excesso cansa e atrapalha o sono." },
    ],
  },
];

const QUIZ = {
  icon: "🩺",
  prompt: "Bônus: em média, quanto sono um adulto saudável precisa por noite?",
  choices: [
    { label: "3 a 4 horas", correct: false },
    { label: "7 a 9 horas", correct: true },
    { label: "10 a 12 horas", correct: false },
  ],
};

const HIGH_KEY = "vitalis-highscore";

const state = {
  day: 0,
  health: 100,
  score: 0,
  streak: 0,
  gameOver: false,
  quizDone: false,
};

const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function loadHigh() {
  const v = Number(localStorage.getItem(HIGH_KEY));
  return Number.isFinite(v) ? v : 0;
}

function saveHigh() {
  const h = loadHigh();
  if (state.score > h) {
    localStorage.setItem(HIGH_KEY, String(state.score));
    return state.score;
  }
  return h;
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
  $(screenId).classList.remove("hidden");
}

function updateHud() {
  const health = state.health;
  $("healthfill").style.width = health + "%";
  $("healthfill").style.background = health > 60 ? "var(--accent)" : health > 30 ? "var(--warn)" : "var(--bad)";
  $("score").textContent = String(state.score);
  $("day").textContent = state.day + "/7";
}

function renderStart() {
  show("screen-start");
  updateHud();
}

function renderDay() {
  const d = DAYS[state.day];
  show("screen-day");
  $("day-icon").textContent = d.icon;
  $("day-title").textContent = d.day;
  $("day-prompt").textContent = d.prompt;
  const list = $("day-choices");
  list.innerHTML = "";
  d.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.innerHTML =
      '<span class="choice-label"></span><span class="choice-tip"></span>';
    btn.querySelector(".choice-label").textContent = c.label;
    btn.querySelector(".choice-tip").textContent = c.tip;
    btn.addEventListener("click", () => onChoice(c));
    list.appendChild(btn);
  });
  updateHud();
}

function onChoice(choice) {
  const delta = choice.delta;
  state.health = clamp(state.health + delta, 0, 100);
  if (delta > 0) {
    state.score += 20;
    if (state.streak > 0) state.score += 10;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  updateHud();

  if (state.health <= 0) {
    state.gameOver = true;
    renderGameOver();
    return;
  }

  state.day += 1;
  if (state.day === DAYS.length) {
    renderQuiz();
  } else {
    renderDay();
  }
}

function renderQuiz() {
  show("screen-quiz");
  $("quiz-icon").textContent = QUIZ.icon;
  $("quiz-prompt").textContent = QUIZ.prompt;
  const list = $("quiz-choices");
  list.innerHTML = "";
  QUIZ.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = c.label;
    btn.addEventListener("click", () => onQuiz(c));
    list.appendChild(btn);
  });
  updateHud();
}

function onQuiz(choice) {
  if (choice.correct) {
    state.score += 30;
    state.quizDone = true;
  }
  updateHud();
  renderResult();
}

function renderResult() {
  show("screen-result");
  const health = state.health;
  const grade = health >= 85 ? "A" : health >= 70 ? "B" : health >= 55 ? "C" : "D";
  const best = saveHigh();
  $("res-health").textContent = String(health);
  $("res-score").textContent = String(state.score);
  $("res-grade").textContent = grade;
  $("res-best").textContent = String(best);
  $("res-msg").textContent =
    grade === "A"
      ? "Impecável! Você cuidou bem da saúde."
      : grade === "B"
      ? "Muito bem — quase tudo certo."
      : grade === "C"
      ? "Razoável, mas dá para melhorar."
      : "Precisa cuidar mais dos hábitos.";
  updateHud();
}

function renderGameOver() {
  show("screen-gameover");
  $("go-score").textContent = String(state.score);
  updateHud();
}

function startGame() {
  state.day = 0;
  state.health = 100;
  state.score = 0;
  state.streak = 0;
  state.gameOver = false;
  state.quizDone = false;
  renderDay();
}

document.querySelector("#btn-start").addEventListener("click", startGame);
document.querySelector("#btn-again").addEventListener("click", startGame);
document.querySelector("#btn-again2").addEventListener("click", startGame);
document.querySelector("#btn-menu").addEventListener("click", renderStart);
document.querySelector("#btn-menu2").addEventListener("click", renderStart);

renderStart();
