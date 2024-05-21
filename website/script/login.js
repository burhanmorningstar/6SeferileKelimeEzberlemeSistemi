const apiUrl = "http://localhost:3000";
const wordApiUrl = "http://localhost:3001";
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

loginSubmitBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("user_email_address").value;
  const password = document.getElementById("user_password").value;

  try {
    const response = await fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email_address: email,
        user_password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // Giriş başarılı
      const userId = data.user_id; // Kullanıcı ID'sini al

      try {
        const settingResponse = await fetch(
          wordApiUrl + "/settings/" + userId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const settingData = await settingResponse.json();
        console.log("Ayarlar başarıyla getirildi:", settingData);
      } catch (error) {
        console.error("Ayarlar alınırken bir hata oluştu:", error);
      }
      console.log("Giriş başarılı, user_id:", userId);
      window.location.href = "index2.html?user_id=" + userId;
    } else {
      // Giriş başarısız, hata mesajını göster
      console.error(data.message);
      alert("Hatalı e-posta veya şifre girdiniz.");
    }
  } catch (error) {
    console.error("Giriş isteği sırasında bir hata oluştu:", error);

    alert("Hatalı e-posta veya şifre girdiniz.");
  }
});
