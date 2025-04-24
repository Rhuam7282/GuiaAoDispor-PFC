create database if not exists guiaaodispor;
use guiaaodispor;

-- Tabela Cliente
CREATE TABLE Cliente (
    idCliente INT PRIMARY KEY auto_increment not null,
    Descricao VARCHAR(300),
    Usuario_IdUsuario INT not null,
    Usuario_Localizacao_idLocalizacao INT not null,
    FOREIGN KEY (Usuario_IdUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (Usuario_Localizacao_idLocalizacao) REFERENCES Localizacao(idLocalizacao)
);

-- Tabela Profissional
CREATE TABLE Profissional (
    Usuario_idusuario INT PRIMARY KEY not null,
    Descricao VARCHAR(300),
    Usuario_Localizacao_idLocalizacao INT,
    FOREIGN KEY (Usuario_idus) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (Usuario_Localizacao_idLocalizacao) REFERENCES Localizacao(idLocalizacao)
);

-- Tabela Usuário
CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY not null auto_increment,
    Nome VARCHAR(100) not null,
    Email VARCHAR(50) not null,
    Senha VARCHAR(15) not null,
    Foto LONGBLOB,
    Localizacao INT(8),
    Tipo TINYINT(1) not null
);

-- Tabela Profissional_has_Cliente
CREATE TABLE Profissional_has_Cliente (
    Profissional_Usuario_idUsuario INT,
    Cliente_idCliente INT,
    Cliente_Usuario_Usuario INT,
    Data VARCHAR(45),
    Estado TINYINT(1),
    PRIMARY KEY (Profissional_Usuario_idUsuario, Cliente_idCliente),
    FOREIGN KEY (Profissional_Usuario_idUsuario) REFERENCES Profissional(Usuario_idus),
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (Cliente_Usuario_Usuario) REFERENCES Usuario(idUsuario)
);

-- Tabela Historico
CREATE TABLE Historico (
    idHistorico INT PRIMARY KEY,
    Cliente_idCliente INT,
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);

-- Tabela Contato
CREATE TABLE Contato (
    idContato INT PRIMARY KEY not null auto_increment,
    Usuario VARCHAR(45) not null,
    Profissional_Usuario_idUsuario INT not null,
    icone LONGBLOB not null,
    Imagem LONGBLOB,
    Contato_idContato INT,
    FOREIGN KEY (Profissional_Usuario_idUsuario) REFERENCES Profissional(Usuario_idus)
);

create table icone(
	imagem longblob,
    Contato_idContato int not null,
    FOREIGN KEY (Contato_idContato) REFERENCES Contato(idContato)
);

-- Tabela Experiencias
CREATE TABLE Experiencias (
    idExperiencias INT PRIMARY KEY,
    Titulo VARCHAR(45),
    Data DATE,
    Descricao VARCHAR(100),
    Profissional_Usuario_idUsuario INT,
    FOREIGN KEY (Profissional_Usuario_idUsuario) REFERENCES Profissional(Usuario_idus)
);

-- Tabela Formacoes
CREATE TABLE Formacoes (
    idFormacoes INT PRIMARY KEY,
    Formacao_e_Instituicao VARCHAR(60),
    Ano YEAR(4),
    Profissional_Usuario_idUsuario INT,
    FOREIGN KEY (Profissional_Usuario_idUsuario) REFERENCES Profissional(Usuario_idus)
);
