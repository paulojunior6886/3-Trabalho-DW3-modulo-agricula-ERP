CREATE TABLE IF NOT EXISTS usuarios (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pK_usuarios PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pasto (
    pastoid INT GENERATED ALWAYS AS IDENTITY,
    descricao VARCHAR(100) NOT NULL,
    areatotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT pasto_pk PRIMARY KEY (pastoid)
);

CREATE TABLE IF NOT EXISTS piquete(
    piqueteid INT GENERATED ALWAYS AS IDENTITY,
    descricao VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    pastoidfk INT NOT NULL,
    CONSTRAINT piquete_pk PRIMARY KEY (piqueteid),
    CONSTRAINT piquete_pasto_fk FOREIGN KEY (pastoidfk) REFERENCES pasto(pastoid)
);

CREATE TABLE IF NOT EXISTS animal(
    animalid INT GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(100) NOT NULL,
    datanasc DATE NOT NULL,
    CONSTRAINT animal_pk PRIMARY KEY (animalid)
);

CREATE TABLE IF NOT EXISTS alocado (
    alocadoid INT GENERATED ALWAYS AS IDENTITY,
    animalidfk INT NOT NULL,
    piqueteidfk INT NOT NULL,
    datainicio DATE NOT NULL,
    datafinal DATE,
    CONSTRAINT alocado_pk PRIMARY KEY (alocadoid),
    CONSTRAINT alocado_animal_fk FOREIGN KEY (animalidfk) REFERENCES animal(animalid),
    CONSTRAINT alocado_piquete_fk FOREIGN KEY (piqueteidfk) REFERENCES piquete(piqueteid)
);