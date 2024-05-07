const apiUrl = "http://localhost:3000";
const registerSubmitBtn = document.getElementById("registerSubmitBtn");

registerSubmitBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("user_email_address").value;
  const password = document.getElementById("user_password").value;
  const fullname = document.getElementById("user_fullname").value;
  
  try {
    const response = await fetch(apiUrl + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email_address: email,
        user_password: password,
        user_fullname: fullname,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // Giriş başarılı
      console.log("Kayit başarılı.");

      // Kullanıcıyı yönlendir (örneğin ana sayfaya)
      window.location.href = "/index.html";
    } else {
      // Giriş başarısız, hata mesajını göster
      console.error(data.message);
      alert(data.message); // Kullanıcıya göstermek için bir uyarı penceresi aç
    }
  } catch (error) {
    //console.error("Bir hata oluştu:", error);
    alert("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
});
