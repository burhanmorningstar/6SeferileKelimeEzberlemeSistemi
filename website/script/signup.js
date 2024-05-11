const apiUrl = "http://localhost:3000";
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener('submit', async (event) =>{
  event.preventDefault();

  const email = document.getElementById("user_email_address").value;
  const password = document.getElementById("user_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const fullname = document.getElementById("user_fullname").value;
  
  try {
    if (!email || !password || !confirmPassword || !fullname) {
      throw new Error('Lütfen tüm alanları doldurunuz.');
  }
    if (password !== confirmPassword) {
      throw new Error('Girilen parolalar uyuşmuyor.');
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
    alert(data.message);
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
});
