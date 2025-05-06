-- Create the database (run this command separately or ensure you are connected to the correct instance)
-- CREATE DATABASE guiaaodispor;

-- Connect to the database before running the rest of the script
-- In psql: \c guiaaodispor

-- Tabela Localização (deve ser criada primeiro por ser referenciada)
CREATE TABLE Localizacao (
    CEP VARCHAR(8) PRIMARY KEY,
    Estado VARCHAR(2) NOT NULL,
    Cidade VARCHAR(30) NOT NULL
);


-- Tabela TipoUsuario (deve ser criada antes de Usuario)
CREATE TABLE TipoUsuario (
    idTipoUsuario SERIAL PRIMARY KEY, -- Changed AUTO_INCREMENT to SERIAL
    Descricao VARCHAR(300) NOT NULL
);


-- Tabela Usuário
CREATE TABLE Usuario (
    idUsuario SERIAL PRIMARY KEY, -- Changed AUTO_INCREMENT to SERIAL
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Senha VARCHAR(255) NOT NULL, -- Armazena o hash da senha
    Foto BYTEA,                  -- Changed LONGBLOB to BYTEA
    Localizacao_CEP VARCHAR(8),
    TipoUsuario INTEGER NOT NULL, -- Changed INT to INTEGER
    FOREIGN KEY (Localizacao_CEP) REFERENCES Localizacao(CEP),
    FOREIGN KEY (TipoUsuario) REFERENCES TipoUsuario(idTipoUsuario),
    UNIQUE (Email) -- Garante que emails sejam únicos
);


-- Tabela Cliente
CREATE TABLE Cliente (
    idCliente SERIAL PRIMARY KEY, -- Changed AUTO_INCREMENT to SERIAL
    Descricao VARCHAR(300),
    Usuario_idUsuario INTEGER NOT NULL, -- Changed INT to INTEGER
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario),
    UNIQUE (Usuario_idUsuario) -- Garante relação 1:1
);


-- Tabela Profissional
CREATE TABLE Profissional (
    idProfissional SERIAL PRIMARY KEY, -- Changed AUTO_INCREMENT to SERIAL
    Descricao VARCHAR(300),
    Usuario_idUsuario INTEGER NOT NULL, -- Changed INT to INTEGER
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario),
    UNIQUE (Usuario_idUsuario) -- Garante relação 1:1
);


-- Tabela Relação Cliente - Profissional (corrigida)
CREATE TABLE Profissional_Cliente (
    Profissional_idProfissional INTEGER, -- Changed INT to INTEGER
    Cliente_idCliente INTEGER,           -- Changed INT to INTEGER
    DataContrato TIMESTAMP NOT NULL,     -- Changed DATETIME to TIMESTAMP
    Estado BOOLEAN DEFAULT TRUE,         -- Changed TINYINT(1) to BOOLEAN, DEFAULT 1 to TRUE
    PRIMARY KEY (Profissional_idProfissional, Cliente_idCliente),
    FOREIGN KEY (Profissional_idProfissional) REFERENCES Profissional(idProfissional),
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);


-- Tabela Histórico
CREATE TABLE Historico (
    idHistorico SERIAL PRIMARY KEY,             -- Changed AUTO_INCREMENT to SERIAL
    Cliente_idCliente INTEGER,                  -- Changed INT to INTEGER
    Descricao TEXT,
    DataRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Changed DATETIME to TIMESTAMP
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);


-- Tabela Contato (reestruturada)
CREATE TABLE Contato (
    idContato SERIAL PRIMARY KEY,       -- Changed AUTO_INCREMENT to SERIAL
    Usuario_idUsuario INTEGER NOT NULL, -- Changed INT to INTEGER
    TipoContato VARCHAR(50) NOT NULL, -- Ex: telefone, email, whatsapp
    Valor VARCHAR(100) NOT NULL,      -- O valor do contato
    Icone VARCHAR(100),               -- Caminho para o ícone ou nome
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);


-- Tabela Experiências Profissionais (corrigida)
CREATE TABLE ExperienciaProfissional (
    idExperiencia SERIAL PRIMARY KEY,            -- Changed AUTO_INCREMENT to SERIAL
    Profissional_idProfissional INTEGER NOT NULL,-- Changed INT to INTEGER
    Titulo VARCHAR(100) NOT NULL,
    Empresa VARCHAR(100),
    DataInicio DATE NOT NULL,
    DataFim DATE,
    Descricao TEXT,
    FOREIGN KEY (Profissional_idProfissional) REFERENCES Profissional(idProfissional)
);


-- Tabela Formações (corrigida)
CREATE TABLE Formacao (
    idFormacao SERIAL PRIMARY KEY,               -- Changed AUTO_INCREMENT to SERIAL
    Profissional_idProfissional INTEGER NOT NULL,-- Changed INT to INTEGER
    NivelFormacao VARCHAR(50) NOT NULL,          -- Ex: Graduação, Pós-graduação
    Curso VARCHAR(100) NOT NULL,
    Instituicao VARCHAR(100) NOT NULL,
    AnoConclusao INTEGER,                        -- Changed YEAR(4) to INTEGER
    FOREIGN KEY (Profissional_idProfissional) REFERENCES Profissional(idProfissional)
);
