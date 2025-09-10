-- Apaga as tabelas antigas para garantir a nova estrutura
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS nivel; -- Adicionado para garantir
DROP TABLE IF EXISTS checklist;

-- Tabela principal do Checklist
CREATE TABLE checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens (perguntas) - Sem alterações
CREATE TABLE item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist (id)
);

-- NOVA: Tabela para armazenar os níveis de gravidade definidos para cada checklist
CREATE TABLE nivel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tempo INTEGER NOT NULL, -- Tempo em dias
    checklist_id INTEGER NOT NULL,
    FOREIGN KEY (checklist_id) REFERENCES checklist (id)
);