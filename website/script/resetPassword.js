const resetForm = document.getElementById("resetForm");
const messageDiv = document.getElementById("message");
const apiUrl = "http://localhost:3000";
const sendEmailForm = document.getElementById("sendEmailForm");
const wrongEmail = document.getElementById("wrongEmail");
const wrongCode = document.getElementById("wrongCode");
const loader = document.getElementById("loader");

sendEmailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.style.display = "block";
  

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
    if (response.status !== 200) {
      openAlert(wrongEmail);
      throw new Error("E-mail kayıtlı değil.");
    }
    const data = await response.json();

    resetForm.style.display = "block";
    sendEmailForm.style.display = "none";
  } catch (error) {
    console.error("E-mail kayıtlı değil:", error);
  }
});

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
      openAlert(wrongCode);
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
  } catch (error) {
    console.error("Şifre sıfırlama işlemi sırasında bir hata oluştu:", error);
  }
});
function closeAlert(element) {
  setTimeout(function () {
    element.style.display = "none";
  }, 100);
}

function openAlert(element) {
  element.style.display = "block";

  if (document.documentElement.classList.contains("lt-ie9")) {
    var speed = 300;
    var times = 3;
    var loop = setInterval(anim, speed);

    function anim() {
      times--;
      if (times === 0) {
        clearInterval(loop);
      }

      var alertBox = element;
      alertBox.style.left = "450px";
      setTimeout(function () {
        alertBox.style.left = "440px";
      }, speed);
    }

    anim();
  }
}

document.querySelectorAll(".close-ot-alert").forEach(function (closeButton) {
  closeButton.addEventListener("click", function () {
    closeAlert(closeButton.parentElement);
  });
});
