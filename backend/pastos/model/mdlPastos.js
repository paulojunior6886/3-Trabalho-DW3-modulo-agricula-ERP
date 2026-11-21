const db = require("../../database/databaseConfig");

// GET ALL
const GetAllPastos = async () => {
    return (
        await db.query(
            "SELECT * FROM pasto " +
            "WHERE removido = false " +
            "ORDER BY pastoid ASC"
        )
    ).rows;
};

// GET BY ID
const GetPastoByID = async (pastoID) => {
    return (
        await db.query(
            "SELECT * FROM pasto " +
            "WHERE pastoid = $1 AND removido = false",
            [pastoID]
        )
    ).rows;
};

// INSERT
const InsertPasto = async (registro) => {
    const resultado = await db.query(
        "INSERT INTO pasto (descricao, areatotal, removido) " +
        "VALUES ($1, $2, false) " +
        "RETURNING pastoid",
        [
            registro.descricao,
            registro.areatotal
        ]
    );

    return {
        linhasAfetadas: resultado.rowCount,
        id: resultado.rows[0].pastoid
    };
};

// UPDATE
const UpdatePasto = async (pastoID, registro) => {
    const resultado = await db.query(
        "UPDATE pasto SET " +
        "descricao = $2, " +
        "areatotal = $3 " +
        "WHERE pastoid = $1 AND removido = false",
        [
            pastoID,
            registro.descricao,
            registro.areatotal
        ]
    );

    return {
        linhasAfetadas: resultado.rowCount
    };
};

// DELETE - Exclusão lógica
const DeletePasto = async (pastoID) => {

    // Evita remover um pasto com piquetes ativos.
    const dependencias = await db.query(
        "SELECT piqueteid FROM piquete " +
        "WHERE pastoidfk = $1 AND removido = false " +
        "LIMIT 1",
        [pastoID]
    );

    if (dependencias.rowCount > 0) {
        return {
            msg: "possui_piquetes",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "UPDATE pasto SET removido = true " +
        "WHERE pastoid = $1 AND removido = false",
        [pastoID]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

module.exports = {
    GetAllPastos,
    GetPastoByID,
    InsertPasto,
    UpdatePasto,
    DeletePasto
};