const form = document.querySelector("form");
const apiUrl = "http://localhost:3002";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const englishWord = document.getElementById("englishWord").value;
  const turkishWord = document.getElementById("turkishWord").value;
  const wordImage = document.getElementById("wordImage").files[0];
  const wordAudio = document.getElementById("wordAudio").files[0];
  const wordSentence = document.getElementById("wordSentence").value;

  const formData = new FormData();
  formData.append("wordMeaning", turkishWord);
  formData.append("word", englishWord);
  formData.append("wordImage", wordImage);
  formData.append("wordAudio", wordAudio);
  formData.append("wordSentence", wordSentence);

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
      document.getElementById("imagePreview").classList.add("d-none");
      // Ses öğesini gizle
      const audioPreview = document.getElementById("audioPreview");
      audioPreview.classList.add("d-none");
      // Ses dosyasını temizle
      audioPreview.src = "";
    } else {
      throw new Error("Kelime eklenirken bir hata oluştu.");
    }
  } catch (error) {
    console.error(error);
    alert("Kelime eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
});
const goToMainMenu = document.getElementById("goToMainMenu");
goToMainMenu.addEventListener("click", () => {
  window.location.href = "index.html?user_id=" + userId;
});
