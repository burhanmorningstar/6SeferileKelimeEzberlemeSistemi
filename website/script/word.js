const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user_id");

const form = document.querySelector("form");
const apiUrl = "http://localhost:3002";

// Kelimeyi veritabanına ekleme
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const englishWord = document.getElementById("englishWord").value;
  const turkishWord = document.getElementById("turkishWord").value;
  const wordImage = document.getElementById("wordImage").files[0];
  const wordAudio = document.getElementById("wordAudio").files[0];
  const wordSentence = document.getElementById("word-sentence").value;

  const formData = new FormData();
  formData.append("wordMeaning", turkishWord);
  formData.append("word", englishWord);
  formData.append("wordImage", wordImage);
  formData.append("wordAudio", wordAudio);
  formData.append("wordSentence", wordSentence);
  formData.append("userId", userId);

  try {
    const response = await fetch(apiUrl + "/addWord", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Kelime başarıyla eklendi.");
      // İsteği gönderdikten sonra formu temizle
      form.reset();
      // Önizleme resmini gizle
      document.getElementById("image-preview").classList.add("d-none");
      // Ses öğesini gizle
      const audioPreview = document.getElementById("audioPreview");
      audioPreview.classList.add("d-none");
      // Ses dosyasını temizle
      audioPreview.src = "";
    } else {
      return Promise.reject("Kelime eklenirken bir hata oluştu.");
    }
  } catch (error) {
    console.error(error);
    alert("Kelime eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
});
const goToMainMenu = document.getElementById("go-to-main-menu");
goToMainMenu.addEventListener("click", () => {
  window.location.href = "index.html?user_id=" + userId;
});
