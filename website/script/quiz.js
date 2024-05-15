const wordApiUrl = "http://localhost:3001";
const userApiUrl = "http://localhost:3000";

// Kullanıcı cevaplarını saklayacak diziler
let correctAnswers = [];
let userAnswers = [];
let resultQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let userId;

// Event listener'ları güncelle
document.addEventListener("DOMContentLoaded", () => {
  // Kullanıcı kimliğiyle soruları getir
  const urlParams = new URLSearchParams(window.location.search);
  userId = urlParams.get("user_id");
  fetchQuestions(userId);
});

/// fetchQuestions fonksiyonunu güncelle
function fetchQuestions(userId) {
  fetch(wordApiUrl + "/questions/" + userId)
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      console.log("Sorular başarıyla getirildi:", questions);
      // Doğru ve kullanıcı cevaplarını sıfırla
      correctAnswers = [];
      userAnswers = [];
      closeModal();
      showNextQuestion(); // fetch işlemi tamamlandığında ilk soruyu göster
    })
    .catch((error) =>
      console.error("Kelime alınırken bir hata oluştu:", error)
    );
}

function submitAnswer() {
  const answerInput = document.getElementById("answer");
  const answer = answerInput.value.trim(); // Trim whitespace
  if (!answer) {
    alert("Answer can't be empty.");
    return;
  }

  const currentQuestion = questions[currentQuestionIndex - 1];
  const wordId = currentQuestion.word_id;
  const userId = currentQuestion.user_id;

  submitAnswerToApi(userId, wordId, answer);
}
// submitAnswerToApi fonksiyonunu güncelle
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

    // Doğru veya yanlış cevaba göre işlem yap
    result.message === "Correct answer!"
      ? console.log("Correct answer!")
      : console.log("Incorrect answer.");
    userAnswers.push(answer); // Kullanıcının cevabını ekleyin

    // Sonraki soruyu göster
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
  const questionContainer = document.getElementById("question-container");
  if (question) {
    // Yeni bir div öğesi oluştur
    const newQuestionDiv = document.createElement("div");

    // İngilizce kelimeyi ve cümleyi ekle
    const englishParagraph = document.createElement("p");
    englishParagraph.textContent = `English: ${question.word}`;
    newQuestionDiv.appendChild(englishParagraph);

    const usageParagraph = document.createElement("p");
    usageParagraph.textContent = `Sentence: ${question.word_in_sentence}`;
    newQuestionDiv.appendChild(usageParagraph);

    // Resim ve ses öğelerini ekleyin
    const imageElement = document.createElement("img");
    imageElement.src = question.word_image;
    imageElement.alt = "Image";
    newQuestionDiv.appendChild(imageElement);

    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    const audioSource = document.createElement("source");
    audioSource.src = question.word_voice;
    audioSource.type = "audio/mpeg"; // MP3 dosyaları için tip
    audioElement.appendChild(audioSource);
    newQuestionDiv.appendChild(audioElement);

    // Cevap giriş alanını ve düğmesini ekleyin
    const answerInput = document.createElement("input");
    answerInput.id = "answer";
    answerInput.type = "text";
    answerInput.placeholder = "Enter your answer";
    newQuestionDiv.appendChild(answerInput);

    const submitButton = document.createElement("button");
    submitButton.id = "submitBtn";
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () =>
      submitAnswer(question.word_id, question.user_id)
    );
    newQuestionDiv.appendChild(submitButton);

    // Listen for "Enter" key press event
    answerInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        submitAnswer(question.word_id, question.user_id);
      }
    });

    // Önceki soruyu temizle ve yeni soruyu ekle
    questionContainer.innerHTML = "";
    questionContainer.appendChild(newQuestionDiv);
  } else {
    questionContainer.innerHTML = "";
    questionContainer.innerHTML = "<p>No more questions available.</p>";
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Quiz";
    resetButton.id = "resetBtn";
    resetButton.addEventListener("click", resetQuiz);
    questionContainer.appendChild(resetButton);
    showResults();
  }
};

function resetQuiz() {
  correctAnswers = [];
  userAnswers = [];
  resultQuestions = [];
  questions = [];
  currentQuestionIndex = 0;
  fetchQuestions(userId);
}

function closeModal() {
  modal.classList.remove("show");
  modal.style.display = "none";
}

var tbody = document.getElementById("cevaplar-tablosu");

function showResults() {
  tbody.innerHTML = "";

  for (var i = 0; i < resultQuestions.length; i++) {
    var tr = document.createElement("tr");

    var tdSoru = document.createElement("td");
    tdSoru.textContent = resultQuestions[i];
    tr.appendChild(tdSoru);

    var tdKullaniciCevabi = document.createElement("td");
    var kullaniciCevabi = userAnswers[i];
    kullaniciCevabi == null ? (kullaniciCevabi = "") : kullaniciCevabi;
    tr.appendChild(tdKullaniciCevabi);

    var tdDogruCevap = document.createElement("td");
    tdDogruCevap.textContent = correctAnswers[i];
    tr.appendChild(tdDogruCevap);

    var tdSonuc = document.createElement("td");
    var questionCheck = checkAnswer(userAnswers[i], correctAnswers[i]);
    tdSonuc.textContent = questionCheck === 1 ? "Doğru" : "Yanlış";

    tr.appendChild(tdSonuc);

    tbody.appendChild(tr);
  }
}

function checkAnswer(userAnswer, correctAnswer) {
  if (userAnswer === correctAnswer) {
    return 1;
  } else {
    return 0;
  }
}

document.getElementById("closeModalBtn").addEventListener("click", function () {
  closeModal();
  resetQuiz();
});

var modal = document.getElementById("resultModal");
