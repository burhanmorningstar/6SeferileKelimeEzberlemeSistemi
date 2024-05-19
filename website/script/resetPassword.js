const resetForm = document.getElementById("resetForm");
const messageDiv = document.getElementById("message");
const apiUrl = "http://localhost:3000";
const sendEmailForm = document.getElementById("sendEmailForm");

sendEmailForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("user_email_address").value;

  try {
    const response = await fetch(apiUrl + "/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email_address: email,
      }),
    });

    const data = await response.json();
    messageDiv.textContent = data.message;
    messageDiv.style.display = "block";
  } catch (error) {
    console.error("Şifre sıfırlama işlemi sırasında bir hata oluştu:", error);
    messageDiv.textContent =
      "Şifre sıfırlama işlemi sırasında bir hata oluştu.";
    messageDiv.style.display = "block";
  }
});

//asdasdad

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const verificationCode = document.getElementById("verification_code").value;
  const newPassword = document.getElementById("new_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  try {
    if (!verificationCode || !newPassword || !confirmPassword) {
      throw new Error("Doğrulama kodu ve yeni parolaları giriniz.");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Girilen parolalar uyuşmuyor.");
    }

    const response1 = await fetch(apiUrl + "/verifyCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verification_code: verificationCode,
      }),
    });

    const data1 = await response1.json();
    if (response1.status !== 200) {
      throw new Error("Doğrulama kodu yanlış.");
    }

    const response2 = await fetch(apiUrl + "/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verification_code: verificationCode,
        user_password: confirmPassword,
      }),
    });

    const data2 = await response2.json();
    messageDiv.textContent = data2.message;
    messageDiv.style.display = "block";
  } catch (error) {
    console.error("Şifre sıfırlama işlemi sırasında bir hata oluştu:", error);
    messageDiv.textContent =
      "Şifre sıfırlama işlemi sırasında bir hata oluştu: " + error.message;
    messageDiv.style.display = "block";
  }
});
