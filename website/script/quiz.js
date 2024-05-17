const wordApiUrl = "http://localhost:3001";
const userApiUrl = "http://localhost:3000";

const answerInput = document.getElementById("answer");

let correctAnswers = [];
let userAnswers = [];
let questions = [];
let currentQuestionIndex = 0;
let userId;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  userId = urlParams.get("user_id");
  fetchQuestions(userId);
});

function fetchQuestions(userId) {
  fetch(wordApiUrl + "/questions/" + userId)
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      console.log("Sorular başarıyla getirildi:", questions);
      correctAnswers = [];
      userAnswers = [];
      closeModal();
      showNextQuestion();
    })
    .catch((error) =>
      console.error("Kelime alınırken bir hata oluştu:", error)
    );
}

function submitAnswer(wordId, userId) {
  const answer = answerInput.value.trim();
  if (!answer) {
    alert("Answer can't be empty.");
    return;
  }

  submitAnswerToApi(userId, wordId, answer);
}

async function submitAnswerToApi(userId, wordId, answer) {
  try {
    const response = await fetch(wordApiUrl + "/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        wordId,
        answer,
      }),
    });
    const result = await response.json();

    result.message === "Correct answer!"
      ? console.log("Correct answer!")
      : console.log("Incorrect answer.");
    userAnswers.push(answer);

    showNextQuestion();
  } catch (error) {
    console.error("Cevap gönderilirken bir hata oluştu:", error);
  }
}

let nextQuestion;

function showNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    nextQuestion = questions[currentQuestionIndex];
    currentQuestionIndex++;
    console.log("Sıradaki soru:", nextQuestion);
    updateHtml(nextQuestion);
  } else {
    console.log("Tüm sorular gösterildi.");
    updateHtml(null);
  }
}

const updateHtml = (question) => {
  if (question) {
    const englishParagraph = document.getElementById("questionWord");
    englishParagraph.textContent = `${question.word}`;

    const usageParagraph = document.getElementById("questionSentence");
    usageParagraph.textContent = `${question.word_in_sentence}`;

    const imageElement = document.getElementById("wordImg");
    imageElement.src = question.word_image;

    const audioElement = document.getElementById("wordAudio");
    audioElement.src = question.word_voice;

    const submitButton = document.getElementById("submitBtn");
    submitButton.addEventListener("click", () =>
      submitAnswer(question.word_id, question.user_id)
    );

    answerInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        submitAnswer(question.word_id, question.user_id);
      }
    });
  } else {
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Quiz";
    resetButton.id = "resetBtn";
    resetButton.addEventListener("click", resetQuiz);
    showResults();
  }
};

function resetQuiz() {
  correctAnswers = [];
  userAnswers = [];
  questions = [];
  currentQuestionIndex = 0;
  fetchQuestions(userId);
}

function closeModal() {
  const modal = document.getElementById("resultModal");
  modal.classList.remove("show");
  modal.style.display = "none";
}

var tbody = document.getElementById("cevaplar-tablosu");

function showResults() {
  tbody.innerHTML = "";

  for (var i = 0; i < questions.length; i++) {
    var tr = document.createElement("tr");

    var tdSoru = document.createElement("td");
    tdSoru.textContent = questions[i].word;
    tr.appendChild(tdSoru);

    var tdKullaniciCevabi = document.createElement("td");
    var kullaniciCevabi = userAnswers[i];
    kullaniciCevabi == null ? (kullaniciCevabi = "") : kullaniciCevabi;
    tr.appendChild(tdKullaniciCevabi);

    var tdDogruCevap = document.createElement("td");
    tdDogruCevap.textContent = questions[i].correct_answer;
    tr.appendChild(tdDogruCevap);

    var tdSonuc = document.createElement("td");
    var questionCheck = checkAnswer(userAnswers[i], questions[i].correct_answer);
    tdSonuc.textContent = questionCheck === 1 ? "Doğru" : "Yanlış";

    tr.appendChild(tdSonuc);

    tbody.appendChild(tr);
  }
}

function checkAnswer(userAnswer, correctAnswer) {
  return userAnswer === correctAnswer ? 1 : 0;
}
