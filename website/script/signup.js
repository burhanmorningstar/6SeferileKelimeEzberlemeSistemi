const apiUrl = "http://localhost:3000";
const registerForm = document.getElementById("form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("user_email_address").value;
  const password = document.getElementById("user_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const fullname = document.getElementById("user_fullname").value;

  try {
    if (!email || !password || !confirmPassword || !fullname) {
      return Promise.reject("Lütfen tüm alanları doldurunuz.");
    }
    if (password !== confirmPassword) {
      openAlert();
      return Promise.reject("Girilen parolalar uyuşmuyor.");
    }
    const response = await fetch(apiUrl + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email_address: email,
        user_password: confirmPassword,
        user_fullname: fullname,
      }),
    });

    const data = await response.json();
    if (response.status === 201) {
      alert("Kullanıcı başarıyla oluşturuldu.");
      window.location.href = "login.html";
    }else if(response.status === 409){
      alert("Bu e-posta adresi ile daha önce kayıt olunmuş.");
    } else {
      alert("Kullanıcı oluşturulurken bir hata oluştu.");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
});
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

document
  .querySelector(".close-ot-alert")
  .addEventListener("click", function () {
    closeAlert();
  });
