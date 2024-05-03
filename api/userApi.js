const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware'ini uygula
app.use(cors({
    origin: 'http://127.0.0.1:5501', // İstemci adresi
    credentials: true // Kimlik bilgisi (cookie, token vs.) gönderilmesine izin ver
}));

const port = process.env.PORT || 3000;

// Database bağlantı bilgileri
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: '6kelimetekrar'
};

// MySQL bağlantısı oluşturma
const db = mysql.createConnection(dbConfig);

// MySQL bağlantısını başlatma
db.connect((err) => {
    if (err) {
        console.error('MySQL veritabanına bağlanırken bir hata oluştu:', err);
        return;
    }
    console.log('MySQL veritabanına başarıyla bağlanıldı');
});

// Kayıt olma (register) endpoint'i
app.post('/register', async (req, res) => {
    try {
        const { user_email_address, user_password, user_fullname } = req.body;

        // Kullanıcının veritabanında var olup olmadığını kontrol edelim
        db.query('SELECT * FROM users WHERE user_email_address = ?', [user_email_address], async (err, result) => {
            if (err) {
                console.error('Kullanıcı sorgulanırken bir hata oluştu: ' + err.message);
                res.status(500).send("Kayıt olurken bir hata oluştu.");
            } else {
                if (result.length > 0) {
                    res.status(409).send("Bu e-posta adresi zaten kayıtlı.");
                } else {
                    // Şifreyi bcrypt ile şifreleyelim
                    const hashedPassword = await bcrypt.hash(user_password, 10);

                    // Yeni kullanıcıyı veritabanına ekleyelim
                    db.query('INSERT INTO users (user_email_address, user_password, user_fullname) VALUES (?, ?, ?)', 
                        [user_email_address, hashedPassword, user_fullname], 
                        (err, result) => {
                            if (err) {
                                console.error('Kullanıcı eklenirken bir hata oluştu: ' + err.message);
                                res.status(500).json({ message: "Kullanıcı oluşturulurken bir hata oluştu." });
                            } else {
                                console.log('Kullanıcı başarıyla kaydedildi');
                                res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
                            }
                        }
                    );
                }
            }
        });
    } catch (error) {
        console.error('Hata: ' + error.message);
        res.status(500).send("Bir hata oluştu.");
    }
});

// Giriş yapma (login) endpoint'i
app.post('/login', async (req, res) => {
    try {
        const { user_email_address, user_password } = req.body;

        // Kullanıcıyı veritabanından bulalım
        db.query('SELECT * FROM users WHERE user_email_address = ?', [user_email_address], async (err, result) => {
            if (err) {
                console.error('Kullanıcı sorgulanırken bir hata oluştu: ' + err.message);
                res.status(500).send("Giriş yapılırken bir hata oluştu.");
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    // Şifreyi karşılaştıralım
                    const passwordMatch = await bcrypt.compare(user_password, user.user_password);
                    if (passwordMatch) {
                        // JWT token oluşturalım
                        const token = jwt.sign({ user_id: user.user_id }, 'secretkey');
                        console.log('Kullanıcı başarıyla giriş yaptı');
                        res.status(200).json({ token });
                    } else {
                        res.status(401).send("Hatalı e-posta veya şifre.");
                    }
                } else {
                    res.status(404).send("Kullanıcı bulunamadı.");
                }
            }
        });
    } catch (error) {
        console.error('Hata: ' + error.message);
        res.status(500).send("Bir hata oluştu.");
    }
});

// Sunucuyu başlat
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`API çalışıyor: http://localhost:${port}`);
});
