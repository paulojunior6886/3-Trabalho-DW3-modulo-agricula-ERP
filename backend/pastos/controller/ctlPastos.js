const mdlPastos = require("../model/mdlPastos");

// Validação do ID
const LerID = (valor) => {
    if (!/^[1-9]\d*$/.test(String(valor))) {
        return null;
    }

    const id = Number(valor);
    return Number.isSafeInteger(id) ? id : null;
};

// Validação dos campos do pasto
const ValidarPasto = (body) => {

    const descricao =
        typeof body?.descricao === "string"
            ? body.descricao.trim()
            : "";

    const areatotal = Number(body?.areatotal);

    if (!descricao || descricao.length > 100) {
        return { erro: "Informe a descrição do pasto." };
    }

    if (
        body?.areatotal === "" ||
        body?.areatotal === null ||
        body?.areatotal === undefined ||
        !Number.isFinite(areatotal) ||
        areatotal <= 0 ||
        areatotal > 99999999.99
    ) {
        return { erro: "Informe uma área total válida." };
    }

    return {
        dados: { descricao, areatotal }
    };
};

// GET ALL
const GetAllPastos = async (req, res) => {
    try {
        const registro = await mdlPastos.GetAllPastos();

        return res.status(200).json({
            status: "ok",
            registro
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao listar pastos."
        });
    }
};

// GET BY ID
const GetPastoByID = async (req, res) => {

    const id = LerID(req.params.pastoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const registro = await mdlPastos.GetPastoByID(id);

        if (registro.length === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Pasto não encontrado."
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
            mensagem: "Erro ao consultar pasto."
        });
    }
};

// INSERT
const InsertPasto = async (req, res) => {

    const { erro, dados } = ValidarPasto(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlPastos.InsertPasto(dados);

        return res.status(201).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas,
            id: resultado.id
        });

    } catch (erroBanco) {
        console.error(erroBanco);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao cadastrar pasto."
        });
    }
};

// UPDATE
const UpdatePasto = async (req, res) => {

    const id = LerID(req.params.pastoid);
    const { erro, dados } = ValidarPasto(req.body);

    if (!id || erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro || "ID inválido."
        });
    }

    try {
        const resultado = await mdlPastos.UpdatePasto(id, dados);

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Pasto não encontrado."
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
            mensagem: "Erro ao atualizar pasto."
        });
    }
};

// DELETE - Soft delete
const DeletePasto = async (req, res) => {

    const id = LerID(req.params.pastoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const resultado = await mdlPastos.DeletePasto(id);

        if (resultado.msg === "possui_piquetes") {
            return res.status(409).json({
                status: "erro",
                mensagem: "O pasto possui piquetes ativos."
            });
        }

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Pasto não encontrado."
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
            mensagem: "Erro ao remover pasto."
        });
    }
};

module.exports = {
    GetAllPastos,
    GetPastoByID,
    InsertPasto,
    UpdatePasto,
    DeletePasto
};