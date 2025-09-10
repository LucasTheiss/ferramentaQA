DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS nivel;
DROP TABLE IF EXISTS checklist;
DROP TABLE IF EXISTS resposta;
DROP TABLE IF EXISTS verificacao;
DROP TABLE IF EXISTS notificacao;

CREATE TABLE checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    data_criacao TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
);

CREATE TABLE item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist (id)
);

CREATE TABLE nivel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tempo INTEGER NOT NULL,
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist (id)
);

CREATE TABLE verificacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checklist_id INTEGER NOT NULL,
    data_verificacao TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    score_aprovacao REAL,
    FOREIGN KEY (checklist_id) REFERENCES checklist (id)
);

CREATE TABLE resposta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verificacao_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    resposta_texto TEXT NOT NULL, 
    nivel_id INTEGER, 
    FOREIGN KEY (verificacao_id) REFERENCES verificacao (id),
    FOREIGN KEY (item_id) REFERENCES item (id),
    FOREIGN KEY (nivel_id) REFERENCES nivel (id)
);

CREATE TABLE notificacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta_id INTEGER NOT NULL,
    destinatario_email TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    data_limite TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (resposta_id) REFERENCES resposta (id)
);