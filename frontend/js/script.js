const apiBase = "http://localhost:5000/api";

let questions = [];
let currentIndex = 0;
let userAnswers = [];

let timeLeft = 60; // total seconds for the quiz
const timerEl = document.getElementById("timeLeft");

const timerInterval = setInterval(() => {
  timeLeft--;
  timerEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    alert("Time's up! Submitting your quiz automatically.");
    submitQuiz();
  }
}, 1000);


const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

// Fetch questions from backend
fetch(`${apiBase}/questions`)
  .then(res => res.json())
  .then(data => {
    questions = data;
    userAnswers = Array(questions.length).fill(null);
    showQuestion();
  })
  .catch(err => console.error("Error fetching questions:", err));

function showQuestion() {
  const q = questions[currentIndex];
  questionEl.innerText = q.question;

  optionsEl.innerHTML = "";

  ["A", "B", "C", "D"].forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = q[`option${opt}`];
    btn.classList.add("option-btn");

    if (userAnswers[currentIndex] === opt) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => selectOption(opt));
    optionsEl.appendChild(btn);
  });

  prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
  nextBtn.style.display = currentIndex === questions.length - 1 ? "none" : "inline-block";
  submitBtn.style.display = currentIndex === questions.length - 1 ? "inline-block" : "none";
}

function selectOption(opt) {
  userAnswers[currentIndex] = opt;
  showQuestion();
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

submitBtn.addEventListener("click", submitQuiz);

function submitQuiz() {
  clearInterval(timerInterval);

  const payload = {
    answers: questions.map((q, i) => ({
      id: q.id,
      selected: userAnswers[i],
    })),
  };

  fetch(`${apiBase}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
      .then(result => {
        // Merge correct answers with questions
        const updatedQuestions = questions.map(q => {
          const correct = result.correctAnswers.find(a => a.id === q.id);
          return { ...q, correctOption: correct.correctOption };
        });

        localStorage.setItem(
          "quizResult",
          JSON.stringify({
            score: result.score,
            total: result.total,
            questions: updatedQuestions,
            userAnswers: userAnswers,
          })
        );
        window.location.href = "result.html";
      })

    .catch(err => console.error("Error submitting:", err));
}
