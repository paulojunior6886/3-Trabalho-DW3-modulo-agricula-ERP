const db = require("../../database/databaseConfig");

// GET ALL
const GetAllPiquetes = async () => {
    return (
        await db.query(
            "SELECT pi.*, p.descricao AS pasto_descricao " +
            "FROM piquete pi " +
            "INNER JOIN pasto p ON pi.pastoidfk = p.pastoid " +
            "WHERE pi.removido = false " +
            "ORDER BY pi.piqueteid ASC"
        )
    ).rows;
};

// GET BY ID
const GetPiqueteByID = async (piqueteID) => {
    return (
        await db.query(
            "SELECT pi.*, p.descricao AS pasto_descricao " +
            "FROM piquete pi " +
            "INNER JOIN pasto p ON pi.pastoidfk = p.pastoid " +
            "WHERE pi.piqueteid = $1 AND pi.removido = false",
            [piqueteID]
        )
    ).rows;
};

// Verifica se o pasto escolhido existe e está ativo.
const PastoAtivo = async (pastoID) => {
    const resultado = await db.query(
        "SELECT pastoid FROM pasto " +
        "WHERE pastoid = $1 AND removido = false",
        [pastoID]
    );

    return resultado.rowCount > 0;
};

// INSERT
const InsertPiquete = async (registro) => {

    if (!(await PastoAtivo(registro.pastoidfk))) {
        return {
            msg: "pasto_invalido",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "INSERT INTO piquete " +
        "(descricao, latitude, longitude, pastoidfk, removido) " +
        "VALUES ($1, $2, $3, $4, false) " +
        "RETURNING piqueteid",
        [
            registro.descricao,
            registro.latitude,
            registro.longitude,
            registro.pastoidfk
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount,
        id: resultado.rows[0].piqueteid
    };
};

// UPDATE
const UpdatePiquete = async (piqueteID, registro) => {

    if (!(await PastoAtivo(registro.pastoidfk))) {
        return {
            msg: "pasto_invalido",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "UPDATE piquete SET " +
        "descricao = $2, " +
        "latitude = $3, " +
        "longitude = $4, " +
        "pastoidfk = $5 " +
        "WHERE piqueteid = $1 AND removido = false",
        [
            piqueteID,
            registro.descricao,
            registro.latitude,
            registro.longitude,
            registro.pastoidfk
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

// DELETE - Exclusão lógica
const DeletePiquete = async (piqueteID) => {

    const dependencias = await db.query(
        "SELECT alocadoid FROM alocado " +
        "WHERE piqueteidfk = $1 AND removido = false " +
        "LIMIT 1",
        [piqueteID]
    );

    if (dependencias.rowCount > 0) {
        return {
            msg: "possui_alocacoes",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "UPDATE piquete SET removido = true " +
        "WHERE piqueteid = $1 AND removido = false",
        [piqueteID]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

module.exports = {
    GetAllPiquetes,
    GetPiqueteByID,
    InsertPiquete,
    UpdatePiquete,
    DeletePiquete
};