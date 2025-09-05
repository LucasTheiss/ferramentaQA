DROP TABLE IF EXISTS checklist;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS nivel;

CREATE TABLE checklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL
);

CREATE TABLE item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pergunta TEXT NOT NULL,
    gravidade TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    nivel_id INTEGER NULL,
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id)
);

CREATE TABLE nivel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tempo TEXT NOT NULL,
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id)
);