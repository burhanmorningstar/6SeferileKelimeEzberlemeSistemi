const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("user_id");
const apiUrl = "http://localhost:3003";
const detailedAnalysis = document.getElementById("detailedAnalysis");
const showModal = document.getElementById("show-modal");
const goToMainMenu = document.getElementById("go-to-main-menu");

showModal.addEventListener("click", () => showResults());

document
  .getElementById("settings-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const wordLimitSetting = document.getElementById("wordLimitSetting").value;

    const settingsData = {
      wordLimit: wordLimitSetting,
      userId: userId,
    };

    try {
      const response = await fetch(apiUrl + "/save-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        alert("Ayarlar başarıyla kaydedildi.");
      } else {
        await Promise.reject("Ayarlar kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("Ayarlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  });

async function fetchAnalysisReport() {
  try {
    const response = await fetch(apiUrl + "/get-analysis?user_id=" + userId);
    const data = await response.json();

    const analysisChartCanvas = document.getElementById("analysisChart");
    const analysisReportDiv = document.getElementById("analysis-report");
    // Grafik oluşturma
    const ctx = analysisChartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Doğru Cevaplar", "Yanlış Cevaplar"],
        datasets: [
          {
            label: "Cevaplar",
            data: [data.totalCorrect, data.totalWrong],
            backgroundColor: [
              "rgba(75, 192, 192, 0.9)", // Daha canlı renkler
              "rgba(255, 99, 132, 0.9)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
            hoverBackgroundColor: [
              "rgba(75, 192, 192, 1)", // Üzerine gelindiğinde daha belirgin renkler
              "rgba(255, 99, 132, 1)",
            ],
            hoverBorderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
            ],
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
      },
    });

    analysisReportDiv.innerHTML += `<p>Toplam Kelime Sayısı: ${data.totalAsked}</p><p>Başarı Yüzdesi: ${data.percentage}%</p> <p>Yanlış Sayısı: ${data.totalWrong}</p> <p>Doğru Sayısı: ${data.totalCorrect}</p>`;

    window.analysisData = data;
  } catch (error) {
    console.error("Analiz raporu alınırken bir hata oluştu:", error);
  }
}

function showResults() {
  const data = window.analysisData; // Veriyi global değişkenden alın
  var tbody = document.getElementById("analysisTable");
  tbody.innerHTML = "";
  for (var i = 0; i < data.words.length; i++) {
    var tr = document.createElement("tr");

    var tdWord = document.createElement("td");
    tdWord.textContent = data.words[i].word;
    tr.appendChild(tdWord);

    var tdLevel = document.createElement("td");
    tdLevel.textContent = data.words[i].word_counter;
    tr.appendChild(tdLevel);

    var tdDogruCevap = document.createElement("td");
    tdDogruCevap.textContent = data.words[i].how_many_correct_answers;
    tr.appendChild(tdDogruCevap);

    var tdYanlisCevap = document.createElement("td");
    tdYanlisCevap.textContent = data.words[i].how_many_wrong_answers;
    tr.appendChild(tdYanlisCevap);

    tbody.appendChild(tr);
  }
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  modal.classList.add("show");
}

// Sayfa yüklendiğinde analiz raporunu al
window.onload = fetchAnalysisReport;

$(document).on("click", ".print", function () {
  const section = $("section");
  const modalBody = $(".modal-body");
  modalBody.detach();
  const content = $(".content").detach();
  goToMainMenu.style.display = "none";
  section.append(modalBody);

  modalBody[0].style.paddingTop = "3500px";
  window.print();

  section.empty();
  section.append(content);
  $(".modal-body-wrapper").append(modalBody);
  goToMainMenu.style.display = "block";
  goToMainMenu.style.margin = "27px";
  modalBody[0].style.paddingTop = "0px";
});
goToMainMenu.addEventListener("click", () => {
  window.location.href = "index.html?user_id=" + userId;
});
