const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware'ini uygula
app.use(
  cors({
    origin: "http://127.0.0.1:5501", // İstemci adresi
    credentials: true, // Kimlik bilgisi (cookie, token vs.) gönderilmesine izin ver
  })
);

const port = process.env.PORT || 3000;

// Database bağlantı bilgileri
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "6kelimetekrar",
};

// MySQL bağlantısı oluşturma
const db = mysql.createConnection(dbConfig);

// MySQL bağlantısını başlatma
db.connect((err) => {
  if (err) {
    console.error("MySQL veritabanına bağlanırken bir hata oluştu:", err);
    return;
  }
  console.log("MySQL veritabanına başarıyla bağlanıldı");
});


// Kayıt olma (register) endpoint'i
app.post("/register", async (req, res) => {
  try {
    const { user_email_address, user_password, user_fullname } = req.body;

    // Kullanıcının veritabanında var olup olmadığını kontrol edelim
    db.query(
      "SELECT * FROM users WHERE user_email_address = ?",
      [user_email_address],
      async (err, result) => {
        if (err) {
          console.error(
            "Kullanıcı sorgulanırken bir hata oluştu: " + err.message
          );
          res.status(500).send("Kayıt olurken bir hata oluştu.");
        } else {
          if (result.length > 0) {
            res.status(409).send("Bu e-posta adresi zaten kayıtlı.");
          } else {
            // Şifreyi bcrypt ile şifreleyelim
            const hashedPassword = await bcrypt.hash(user_password, 10);

            // Yeni kullanıcıyı veritabanına ekleyelim
            db.query(
              "INSERT INTO users (user_email_address, user_password, user_fullname) VALUES (?, ?, ?)",
              [user_email_address, hashedPassword, user_fullname],
              (err, result) => {
                if (err) {
                  console.error(
                    "Kullanıcı eklenirken bir hata oluştu: " + err.message
                  );
                  res.status(500).json({
                    message: "Kullanıcı oluşturulurken bir hata oluştu.",
                  });
                } else {
                  console.log("Kullanıcı başarıyla kaydedildi");
                  res
                    .status(201)
                    .json({ message: "Kullanıcı başarıyla oluşturuldu." });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    console.error("Hata: " + error.message);
    res.status(500).send("Bir hata oluştu.");
  }
});

// Giriş yapma (login) endpoint'i
app.post("/login", async (req, res) => {
  try {
    const { user_email_address, user_password } = req.body;
    db.query(
      "SELECT * FROM users WHERE user_email_address = ?",
      [user_email_address],
      async (err, result) => {
        if (err) {
          console.error(
            "Kullanıcı sorgulanırken bir hata oluştu: " + err.message
          );
          res.status(500).send("Giriş yapılırken bir hata oluştu.");
        } else {
          if (result.length > 0) {
            const user = result[0];
            const passwordMatch = await bcrypt.compare(
              user_password,
              user.user_password
            );
            const user_id = user.user_id;
            if (passwordMatch) {
              console.log("Kullanıcı başarıyla giriş yaptı");
              res.status(200).json({ user_id: user_id });
            } else {
              res.status(401).send("Hatalı e-posta veya şifre.");
            }
          } else {
            res.status(404).send("Kullanıcı bulunamadı.");
          }
        }
      }
    );
  } catch (error) {
    console.error("Hata: " + error.message);
    res.status(500).send("Bir hata oluştu.");
  }
});

const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Nodemailer transporter oluşturma
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deneme123yazilimyapimi@gmail.com", // Gönderen e-posta adresi
    pass: "shdg xvft hlqp hvxs",
  },
});
// Email gönderme endpoint'i
app.post("/sendEmail", async (req, res) => {
  try {
    const { user_email_address } = req.body;

    // Kullanıcının veritabanında var olup olmadığını kontrol edelim
    db.query(
      "SELECT * FROM users WHERE user_email_address = ?",
      [user_email_address],
      async (err, result) => {
        if (err) {
          console.error(
            "Kullanıcı sorgulanırken bir hata oluştu: " + err.message
          );
          res.status(500).send("E-posta gönderilirken bir hata oluştu.");
        } else {
          if (result.length > 0) {
            const verificationCode = randomstring.generate({
              length: 4,
              charset: "numeric",
            });

            // Mail seçeneklerini ayarlayın
            let mailOptions = {
              from: "deneme123yazilimyapimi@gmail.com", // Gönderen e-posta adresi
              to: user_email_address, // Alıcı e-posta adresi
              subject: "Şifre Sıfırlama", // E-posta konusu
              text: `Şifrenizi sıfırlamak için aşağıdaki 4 haneli kodu kullanın: ${verificationCode}`,
            };

            db.query(
              "UPDATE users SET verification_code = ? WHERE user_email_address = ?",
              [verificationCode, user_email_address],
              (err) => {
                if (err) {
                  console.error(
                    "Doğrulama kodu oluşturulurken bir hata oluştu:" +
                    err.message
                  );
                  res.status(500).json({
                    message: "Doğrulama kodu oluşturulurken bir hata oluştu.",
                  });
                } else {
                  console.log("Doğrulama kodu başarıyla oluşturuldu");
                  // Maili gönderin
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.error(
                        "E-posta gönderilirken bir hata oluştu:",
                        error
                      );
                      res.status(500).json({
                        message: "E-posta gönderilirken bir hata oluştu.",
                      });
                    } else {
                      console.log(
                        "E-posta başarıyla gönderildi:",
                        info.response
                      );
                      res
                        .status(200)
                        .json({ message: "E-posta başarıyla gönderildi." });
                    }
                  });
                }
              }
            );
          } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
          }
        }
      }
    );
  } catch (error) {
    console.error("E-posta gönderilirken bir hata oluştu:", error);
    res.status(500).json({ message: "E-posta gönderilirken bir hata oluştu." });
  }
});

// Doğrulama kodunu kontrol etme endpoint'i
app.post("/verifyCode", async (req, res) => {
  try {
    const { verification_code } = req.body;

    // Doğrulama kodunu veritabanında kontrol edelim
    db.query(
      "SELECT * FROM users WHERE verification_code = ?",
      [verification_code],
      async (err, result) => {
        if (err) {
          console.error(
            "Doğrulama kodu sorgulanırken bir hata oluştu: " + err.message
          );
          res
            .status(500)
            .send("Doğrulama kodunu kontrol ederken bir hata oluştu.");
        } else {
          if (result.length > 0) {
            console.log("Doğrulama kodu doğru");
            res.status(200).json({ message: "Doğrulama kodu doğru." });
          } else {
            res.status(404).send("Doğrulama kodu bulunamadı.");
          }
        }
      }
    );
  } catch (error) {
    console.error("Hata: " + error.message);
    res.status(500).send("Bir hata oluştu.");
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    const { verification_code, user_password } = req.body;

    // Yeni parolayı bcrypt ile şifreleyelim
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Parolayı veritabanında güncelleyelim
    db.query(
      "UPDATE users SET user_password = ? WHERE verification_code = ?",
      [hashedPassword, verification_code],
      (err) => {
        if (err) {
          console.error("Şifre sıfırlanırken bir hata oluştu: " + err.message);
          res
            .status(500)
            .json({ message: "Şifre sıfırlanırken bir hata oluştu." });
        } else {
          console.log("Şifre başarıyla sıfırlandı");
          res.status(200).json({ message: "Şifre başarıyla sıfırlandı." });
        }
      }
    );
  } catch (error) {
    console.error("Şifre sıfırlama işlemi sırasında bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Şifre sıfırlama işlemi sırasında bir hata oluştu." });
  }
});

// Sunucuyu başlat
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`API çalışıyor: http://localhost:${port}`);
});
