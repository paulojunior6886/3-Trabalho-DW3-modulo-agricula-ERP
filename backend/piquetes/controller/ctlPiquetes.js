const mdlPiquetes = require("../model/mdlPiquetes");

const LerID = (valor) => {
    if (!/^[1-9]\d*$/.test(String(valor))) {
        return null;
    }

    const id = Number(valor);
    return Number.isSafeInteger(id) ? id : null;
};

const ValidarPiquete = (body) => {

    const descricao =
        typeof body?.descricao === "string"
            ? body.descricao.trim()
            : "";

    const latitude = Number(body?.latitude);
    const longitude = Number(body?.longitude);
    const pastoidfk = LerID(body?.pastoidfk);

    if (!descricao || descricao.length > 100) {
        return { erro: "Informe a descrição do piquete." };
    }

    if (
        body?.latitude === "" ||
        body?.latitude === null ||
        body?.latitude === undefined ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
    ) {
        return { erro: "Latitude inválida." };
    }

    if (
        body?.longitude === "" ||
        body?.longitude === null ||
        body?.longitude === undefined ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return { erro: "Longitude inválida." };
    }

    if (!pastoidfk) {
        return { erro: "Informe um pasto válido." };
    }

    return {
        dados: {
            descricao,
            latitude,
            longitude,
            pastoidfk
        }
    };
};

const GetAllPiquetes = async (req, res) => {
    try {
        const registro = await mdlPiquetes.GetAllPiquetes();

        return res.status(200).json({
            status: "ok",
            registro
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao listar piquetes."
        });
    }
};

const GetPiqueteByID = async (req, res) => {

    const id = LerID(req.params.piqueteid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const registro = await mdlPiquetes.GetPiqueteByID(id);

        if (registro.length === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Piquete não encontrado."
            });
        }

        return res.status(200).json({
            status: "ok",
            registro
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao consultar piquete."
        });
    }
};

const InsertPiquete = async (req, res) => {

    const { erro, dados } = ValidarPiquete(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlPiquetes.InsertPiquete(dados);

        if (resultado.msg === "pasto_invalido") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Pasto inexistente ou removido."
            });
        }

        return res.status(201).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas,
            id: resultado.id
        });

    } catch (erroBanco) {
        console.error(erroBanco);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao cadastrar piquete."
        });
    }
};

const UpdatePiquete = async (req, res) => {

    const id = LerID(req.params.piqueteid);
    const { erro, dados } = ValidarPiquete(req.body);

    if (!id || erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro || "ID inválido."
        });
    }

    try {
        const resultado = await mdlPiquetes.UpdatePiquete(id, dados);

        if (resultado.msg === "pasto_invalido") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Pasto inexistente ou removido."
            });
        }

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Piquete não encontrado."
            });
        }

        return res.status(200).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas
        });

    } catch (erroBanco) {
        console.error(erroBanco);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao atualizar piquete."
        });
    }
};

const DeletePiquete = async (req, res) => {

    const id = LerID(req.params.piqueteid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const resultado = await mdlPiquetes.DeletePiquete(id);

        if (resultado.msg === "possui_alocacoes") {
            return res.status(409).json({
                status: "erro",
                mensagem: "O piquete possui alocações ativas."
            });
        }

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Piquete não encontrado."
            });
        }

        return res.status(200).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas
        });

    } catch (erroBanco) {
        console.error(erroBanco);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao remover piquete."
        });
    }
};

module.exports = {
    GetAllPiquetes,
    GetPiqueteByID,
    InsertPiquete,
    UpdatePiquete,
    DeletePiquete
};