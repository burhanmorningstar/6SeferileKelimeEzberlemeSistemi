const apiUrl = "http://localhost:3000";
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
      console.log("Giriş başarılı, token:", data.token);

      // Token'i sakla (örneğin local storage'da)
      localStorage.setItem("token", data.token);

      // Kullanıcıyı yönlendir (örneğin ana sayfaya)
      //window.location.href = "/anasayfa.html";
    } else {
      // Giriş başarısız, hata mesajını göster
      console.error(data.message);
      alert(data.message); // Kullanıcıya göstermek için bir uyarı penceresi aç
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    alert("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
});
