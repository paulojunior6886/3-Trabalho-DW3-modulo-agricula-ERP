const db = require("../../database/databaseConfig");

// GET ALL
const GetAllAlocados = async () => {
    return (
        await db.query(
            "SELECT al.alocadoid, al.animalidfk, " +
            "al.piqueteidfk, " +
            "al.datainicio::text AS datainicio, " +
            "al.datafinal::text AS datafinal, " +
            "al.removido, " +
            "an.nome AS animal_nome, " +
            "pi.descricao AS piquete_descricao " +
            "FROM alocado al " +
            "INNER JOIN animal an ON al.animalidfk = an.animalid " +
            "INNER JOIN piquete pi ON al.piqueteidfk = pi.piqueteid " +
            "WHERE al.removido = false " +
            "ORDER BY al.alocadoid ASC"
        )
    ).rows;
};

// GET BY ID
const GetAlocadoByID = async (alocadoID) => {
    return (
        await db.query(
            "SELECT al.alocadoid, al.animalidfk, " +
            "al.piqueteidfk, " +
            "al.datainicio::text AS datainicio, " +
            "al.datafinal::text AS datafinal, " +
            "al.removido, " +
            "an.nome AS animal_nome, " +
            "pi.descricao AS piquete_descricao " +
            "FROM alocado al " +
            "INNER JOIN animal an ON al.animalidfk = an.animalid " +
            "INNER JOIN piquete pi ON al.piqueteidfk = pi.piqueteid " +
            "WHERE al.alocadoid = $1 AND al.removido = false",
            [alocadoID]
        )
    ).rows;
};

// Confirma que o animal está ativo.
const AnimalAtivo = async (animalID) => {
    const resultado = await db.query(
        "SELECT animalid FROM animal " +
        "WHERE animalid = $1 AND removido = false",
        [animalID]
    );

    return resultado.rowCount > 0;
};

// Confirma que o piquete está ativo.
const PiqueteAtivo = async (piqueteID) => {
    const resultado = await db.query(
        "SELECT piqueteid FROM piquete " +
        "WHERE piqueteid = $1 AND removido = false",
        [piqueteID]
    );

    return resultado.rowCount > 0;
};

// INSERT
const InsertAlocado = async (registro) => {

    if (
        !(await AnimalAtivo(registro.animalidfk)) ||
        !(await PiqueteAtivo(registro.piqueteidfk))
    ) {
        return {
            msg: "relacionamento_invalido",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "INSERT INTO alocado " +
        "(animalidfk, piqueteidfk, datainicio, datafinal, removido) " +
        "VALUES ($1, $2, $3, $4, false) " +
        "RETURNING alocadoid",
        [
            registro.animalidfk,
            registro.piqueteidfk,
            registro.datainicio,
            registro.datafinal
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount,
        id: resultado.rows[0].alocadoid
    };
};

// UPDATE
const UpdateAlocado = async (alocadoID, registro) => {

    if (
        !(await AnimalAtivo(registro.animalidfk)) ||
        !(await PiqueteAtivo(registro.piqueteidfk))
    ) {
        return {
            msg: "relacionamento_invalido",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        "UPDATE alocado SET " +
        "animalidfk = $2, " +
        "piqueteidfk = $3, " +
        "datainicio = $4, " +
        "datafinal = $5 " +
        "WHERE alocadoid = $1 AND removido = false",
        [
            alocadoID,
            registro.animalidfk,
            registro.piqueteidfk,
            registro.datainicio,
            registro.datafinal
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

// DELETE - Exclusão lógica
const DeleteAlocado = async (alocadoID) => {

    const resultado = await db.query(
        "UPDATE alocado SET removido = true " +
        "WHERE alocadoid = $1 AND removido = false",
        [alocadoID]
    );

    return {
        linhasAfetadas: resultado.rowCount
    };
};

module.exports = {
    GetAllAlocados,
    GetAlocadoByID,
    InsertAlocado,
    UpdateAlocado,
    DeleteAlocado
};