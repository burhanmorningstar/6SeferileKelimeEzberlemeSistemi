const wordApiUrl = "http://localhost:3001";
const userApiUrl = "http://localhost:3000";

let correctAnswers = [];
let userAnswers = [];
let questions = [];
let resultQuestions = [];
let correctAnswerCount = 0;
let wrongAnswerCount = 0;
let currentQuestionIndex = 0;
let userId;
const answerInput = document.getElementById("answer");

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
  submitAnswerToApi(userId, wordId, answer);
  answerInput.value = "";
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

    if (result.message === "Correct answer!") {
      console.log("Correct answer!");
      correctAnswerCount++;
    } else {
      console.log("Incorrect answer.");
      wrongAnswerCount++;
    }
    userAnswers.push(answer);
    console.log("Kullanıcı cevapları:", userAnswers);

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
const submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", () =>
  submitAnswer(nextQuestion.word_id, nextQuestion.user_id)
);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitAnswer(nextQuestion.word_id, nextQuestion.user_id);
  }
});

const updateHtml = (question) => {
  if (question) {
    const englishParagraph = document.getElementById("questionWord");
    englishParagraph.textContent = `${question.word}`;
    resultQuestions.push(question.word);
    correctAnswers.push(question.word_meaning);

    const usageParagraph = document.getElementById("questionSentence");
    usageParagraph.textContent = `${question.word_in_sentence}`;

    const imageElement = document.getElementById("wordImg");
    imageElement.src = question.word_image;

    const audioElement = document.getElementById("wordAudio");
    audioElement.src = question.word_voice;
  } else {
    showResults();
  }
};
const closeModalBtn = document.getElementById("closeModalBtn");
closeModalBtn.addEventListener("click", closeModal);

function closeModal() {
  const modal = document.getElementById("resultModal");
  modal.style.display = "none";
  modal.classList.remove("show");
}

var tbody = document.getElementById("cevaplar-tablosu");

function showResults() {
  tbody.innerHTML = "";

  const correctAnswerCountElement = document.getElementById("correctAnswer");
  const wrongAnswerCountElement = document.getElementById("wrongAnswer");
  correctAnswerCountElement.textContent = correctAnswerCount;
  wrongAnswerCountElement.textContent = wrongAnswerCount;
  for (var i = 0; i < resultQuestions.length; i++) {
    var tr = document.createElement("tr");

    var tdSoru = document.createElement("td");
    tdSoru.textContent = resultQuestions[i];
    tr.appendChild(tdSoru);

    var tdKullaniciCevabi = document.createElement("td");
    tdKullaniciCevabi.textContent = userAnswers[i];
    tr.appendChild(tdKullaniciCevabi);

    var tdDogruCevap = document.createElement("td");
    tdDogruCevap.textContent = correctAnswers[i];
    tr.appendChild(tdDogruCevap);

    var tdSonuc = document.createElement("td");
    var questionCheck = checkAnswer(userAnswers[i], correctAnswers[i]);
    tdSonuc.textContent = questionCheck === 1 ? "Doğru" : "Yanlış";

    tr.appendChild(tdSonuc);
    tbody.appendChild(tr);
    const modal = document.getElementById("resultModal");
    modal.style.display = "block";
    modal.classList.add("show");
  }
}

function checkAnswer(userAnswer, correctAnswer) {
  return userAnswer === correctAnswer ? 1 : 0;
}
