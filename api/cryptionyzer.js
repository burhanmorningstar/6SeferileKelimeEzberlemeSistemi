const fs = require('fs');
const crypto = require('crypto');

// Anahtar (şifreleme ve çözme işlemleri için)
const key = 'your_secret_key';

// Bağlantı bilgilerini içeren JSON dosyasının yolu
const configFilePath = 'db_config.json';

// Bağlantı bilgilerini şifrelemek için bir fonksiyon
function encryptConfigFile() {
    // JSON dosyasını oku
    const configFile = fs.readFileSync(configFilePath, 'utf8');

    // JSON dosyasını şifrele
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encryptedConfig = cipher.update(configFile, 'utf8', 'hex');
    encryptedConfig += cipher.final('hex');

    // Şifrelenmiş veriyi yeni bir dosyaya yaz
    fs.writeFileSync('encrypted_db_config.json', encryptedConfig, 'utf8');

    console.log('Bağlantı bilgileri başarıyla şifrelendi.');
}

// Şifrelenmiş bağlantı bilgilerini çözmek için bir fonksiyon
function decryptConfigFile() {
    // Şifrelenmiş JSON dosyasını oku
    const encryptedConfig = fs.readFileSync('encrypted_db_config.json', 'utf8');

    // Şifreyi çöz
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decryptedConfig = decipher.update(encryptedConfig, 'hex', 'utf8');
    decryptedConfig += decipher.final('utf8');

    // JSON formatına dönüştür
    const config = JSON.parse(decryptedConfig);

    return config;
}

// Hata ayıklama için
process.on('uncaughtException', (err) => {
    console.error('Beklenmeyen bir hata oluştu:', err);
});

// Bağlantı bilgilerini şifrele
encryptConfigFile();

// Bağlantı bilgilerini çöz ve kullan
try {
    const decryptedConfig = decryptConfigFile();
    console.log(decryptedConfig);
} catch (error) {
    console.error('Bağlantı bilgilerini çözme sırasında bir hata oluştu:', error);
}
