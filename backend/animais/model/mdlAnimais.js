const db = require("../../database/databaseConfig");

// GET ALL
const GetAllAnimais = async () => {
    return (
        await db.query(
            "SELECT animalid, nome, " +
            "datanasc::text AS datanasc, removido " +
            "FROM animal " +
            "WHERE removido = false " +
            "ORDER BY animalid ASC"
        )
    ).rows;
};

// GET BY ID
const GetAnimalByID = async (animalID) => {
    return (
        await db.query(
            "SELECT animalid, nome, " +
            "datanasc::text AS datanasc, removido " +
            "FROM animal " +
            "WHERE animalid = $1 AND removido = false",
            [animalID]
        )
    ).rows;
};

// INSERT
const InsertAnimal = async (registro) => {
    const resultado = await db.query(
        "INSERT INTO animal " +
        "(nome, datanasc, removido) " +
        "VALUES ($1, $2, false) " +
        "RETURNING animalid",
        [
            registro.nome,
            registro.datanasc
        ]
    );

    return {
        linhasAfetadas: resultado.rowCount,
        id: resultado.rows[0].animalid
    };
};

// UPDATE
const UpdateAnimal = async (animalID, registro) => {
    const resultado = await db.query(
        "UPDATE animal SET " +
        "nome = $2, datanasc = $3 " +
        "WHERE animalid = $1 AND removido = false",
        [
            animalID,
            registro.nome,
            registro.datanasc
        ]
    );

    return {
        linhasAfetadas: resultado.rowCount
    };
};

// DELETE - Exclusão lógica
const DeleteAnimal = async (animalID) => {

    const dependencias = await db.query(
        "SELECT alocadoid FROM alocado " +
        "WHERE animalidfk = $1 AND removido = false " +
        "LIMIT 1",
        [animalID]
    );

    if (dependencias.rowCount > 0) {
        return {
            msg: "possui_alocacoes",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "UPDATE animal SET removido = true " +
        "WHERE animalid = $1 AND removido = false",
        [animalID]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

module.exports = {
    GetAllAnimais,
    GetAnimalByID,
    InsertAnimal,
    UpdateAnimal,
    DeleteAnimal
};