
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'exportacao.db');

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco_custo REAL NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 0,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
