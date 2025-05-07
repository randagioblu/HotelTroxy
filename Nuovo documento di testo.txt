const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

// Abilita CORS e parsing JSON
app.use(cors());
app.use(express.json());

// Percorso del file CSV
const filePath = './privato/data/javascriptimpiccatiFenoli.csv';

// Crea cartella e file se non esistono
if (!fs.existsSync('./privato/data')) {
    fs.mkdirSync('./privato/data', { recursive: true });
}
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "id,emailHash,passwordHash,nome,cognome,data_nascita,telefono\n");
}

// Funzione per verificare se l'hash email esiste già
function checkEmailExists(emailHash, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err, null);

        const lines = data.split('\n').filter(line => line.trim() !== "");
        const emailHashes = lines.map(line => line.split(',')[1]); // emailHash è la seconda colonna
        const emailExists = emailHashes.includes(emailHash);
        callback(null, emailExists);
    });
}

// Genera un ID utente univoco
function generateUserId() {
    return crypto.randomUUID();
}

// Pulisce i campi da virgole o caratteri sospetti
function sanitize(str) {
    return String(str).replace(/,/g, ' ').trim();
}

// Route di registrazione
app.post('/register', (req, res) => {
    const { name, lastname, date, phone, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Dati mancanti!' });
    }

    const emailHash = crypto.createHash('sha256').update(email).digest('hex');
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    checkEmailExists(emailHash, (err, emailExists) => {
        if (err) {
            return res.status(500).json({ message: "Errore durante la lettura del file!" });
        }

        if (emailExists) {
            return res.status(400).json({ message: "Email già registrata!" });
        }

        const userId = generateUserId();
        const entry = `${userId},${emailHash},${passwordHash},${sanitize(name)},${sanitize(lastname)},${date},${sanitize(phone)}\n`;

        fs.appendFile(filePath, entry, (err) => {
            if (err) {
                console.error("❌ Errore scrittura CSV:", err);
                return res.status(500).json({ message: 'Errore nella registrazione!' });
            }
            console.log("✅ Dati salvati nel CSV con successo!");
            return res.status(200).json({ message: 'Registrazione completata con successo!' });
        });
    });
});

// Avvia il server
app.listen(3000, () => console.log('🚀 Server avviato su http://localhost:3000'));
