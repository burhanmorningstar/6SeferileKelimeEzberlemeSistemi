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
const goToMainMenu = document.getElementById("go-to-main-menu");

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  userId = urlParams.get("user_id");
  fetchQuestions(userId);
});

// Soruları API'den getirme
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

// Kullanıcının cevabını API'ye gönderme
async function submitAnswer(wordId, userId) {
  const answer = answerInput.value.trim();
  if (answer.length === 0) {
    openAlert();
    return;
  }
  try {
    await submitAnswerToApi(userId, wordId, answer);
    answerInput.value = ""; // Cevap API'ye başarıyla gönderildikten sonra input'u temizle
  } catch (error) {
    console.error("Cevap gönderilirken bir hata oluştu:", error);
  }
}

// Cevabı API'ye gönderme (async/await kullanarak)
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
      let correctSound = new Audio("sounds/true.mp3");
      await correctSound.play();
    } else {
      console.log("Incorrect answer.");
      wrongAnswerCount++;
      let wrongSound = new Audio("sounds/false.mp3");
      await wrongSound.play();
    }
    userAnswers.push(answer);
    console.log("Kullanıcı cevapları:", userAnswers);

    showNextQuestion();
  } catch (error) {
    console.error("Cevap gönderilirken bir hata oluştu:", error);
  }
}

let nextQuestion;

// Bir sonraki soruyu gösterme
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

const submitButton = document.getElementById("submit-btn");
submitButton.addEventListener("click", () =>
  submitAnswer(nextQuestion.word_id, nextQuestion.user_id)
);

answerInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    try {
      await submitAnswer(nextQuestion.word_id, nextQuestion.user_id);
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  }
});

// HTML'i güncelleme
const updateHtml = (question) => {
  if (question) {
    const questionSentenceElement = document.getElementById("question-sentence");
    questionSentenceElement.innerHTML = "";
    const sentence = question.word_in_sentence
      .split(".")
      .map((sentence) => sentence.trim());
    sentence.forEach((sentence) => {
      const pElement = document.createElement("p");
      pElement.textContent = sentence;
      questionSentenceElement.appendChild(pElement);
    });
    const englishParagraph = document.getElementById("question-word");
    englishParagraph.textContent = `${question.word
      .charAt(0)
      .toUpperCase()}${question.word.slice(1)}`;

    resultQuestions.push(question.word);
    correctAnswers.push(question.word_meaning);

    const imageElement = document.getElementById("wordImg");
    imageElement.src = question.word_image;

    const audioElement = document.getElementById("wordAudio");
    audioElement.src = question.word_voice;
  } else {
    const answerInput = document.getElementById("answer");
    answerInput.disabled = true;
    showResults();
  }
};

// Sonuçları gösterme
const closeModalBtn = document.getElementById("closeModalBtn");
closeModalBtn.addEventListener("click", () => {
  closeModal();
  location.reload();
});

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

// Cevabı kontrol etme
function checkAnswer(userAnswer, correctAnswer) {
  return userAnswer === correctAnswer ? 1 : 0;
}

function closeAlert() {
  setTimeout(function () {
    document.querySelector(".more-ot-alert").style.display = "none";
  }, 100);
}

function openAlert() {
  document.querySelector(".more-ot-alert").style.display = "block";

  if (document.documentElement.classList.contains("lt-ie9")) {
    var speed = 300;
    var times = 3;
    var loop = setInterval(anim, speed);

    function anim() {
      times--;
      if (times === 0) {
        clearInterval(loop);
      }

      var alertBox = document.querySelector(".more-ot-alert");
      alertBox.style.left = "450px";
      setTimeout(function () {
        alertBox.style.left = "440px";
      }, speed);
    }

    anim();
  }
}

goToMainMenu.addEventListener("click", () => {
  window.location.href = "index.html?user_id=" + userId;
});


document
  .querySelector(".close-ot-alert")
  .addEventListener("click", function () {
    closeAlert();
  });

