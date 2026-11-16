-- Coletivos de proteção animal
CREATE TABLE IF NOT EXISTS coletivos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    sigla VARCHAR(20)
);

-- Animais acompanhados pelos coletivos
CREATE TABLE IF NOT EXISTS animais (
    id SERIAL PRIMARY KEY,
    coletivo_id INTEGER NOT NULL,

    nome VARCHAR(100),
    especie VARCHAR(30),
    sexo VARCHAR(20),

    data_nascimento DATE,
    faixa_etaria VARCHAR(20),

    situacao VARCHAR(50),
    castrado BOOLEAN,
    vacinado BOOLEAN,
    disponivel_adocao BOOLEAN,
    adocao_especial BOOLEAN,

    observacoes TEXT,

    FOREIGN KEY (coletivo_id) REFERENCES coletivos(id)
);

-- Histórico de adoções, abandonos, castrações e óbitos
CREATE TABLE IF NOT EXISTS ocorrencias (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    coletivo_id INTEGER NOT NULL,

    tipo VARCHAR(30) NOT NULL,
    data_ocorrencia DATE,
    ano INTEGER,
    mes INTEGER,

    local VARCHAR(200),
    descricao TEXT,

    FOREIGN KEY (animal_id) REFERENCES animais(id),
    FOREIGN KEY (coletivo_id) REFERENCES coletivos(id)
);

-- Cadastro inicial dos Animais Universitários
INSERT INTO coletivos (nome, sigla)
SELECT 'Animais Universitários', 'AUS'
WHERE NOT EXISTS (
    SELECT 1 FROM coletivos WHERE sigla = 'AUS'
);
