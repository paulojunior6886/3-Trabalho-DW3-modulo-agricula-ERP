const db = require("../../database/databaseConfig");

const GetCredencial = async (username) => {

    const resultado = await db.query(
        "SELECT username, password " +
        "FROM usuarios " +
        "WHERE username = $1 AND removido = false",
        [username]
    );

    return resultado.rows;
};

module.exports = {
    GetCredencial
};