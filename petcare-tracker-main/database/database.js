const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/petcare.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            petName TEXT NOT NULL,
            petType TEXT NOT NULL,
            age INTEGER,
            ownerName TEXT,
            phoneNumber TEXT,
            vaccinationStatus TEXT,
            rabiesDate TEXT,
            mixedDate TEXT,
            parasiteDate TEXT
        )
    `);
});

module.exports = db;