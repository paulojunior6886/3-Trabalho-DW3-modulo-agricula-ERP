const mdlAlocados = require("../model/mdlAlocados");

const LerID = (valor) => {
    if (!/^[1-9]\d*$/.test(String(valor))) {
        return null;
    }

    const id = Number(valor);
    return Number.isSafeInteger(id) ? id : null;
};

const DataValida = (valor) => {

    if (
        typeof valor !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(valor)
    ) {
        return false;
    }

    const data = new Date(valor + "T00:00:00Z");

    return (
        !Number.isNaN(data.getTime()) &&
        data.toISOString().slice(0, 10) === valor
    );
};

const ValidarAlocado = (body) => {

    const animalidfk = LerID(body?.animalidfk);
    const piqueteidfk = LerID(body?.piqueteidfk);
    const datainicio = body?.datainicio;
    const datafinal = body?.datafinal || null;

    if (!animalidfk) {
        return { erro: "Selecione um animal válido." };
    }

    if (!piqueteidfk) {
        return { erro: "Selecione um piquete válido." };
    }

    if (!DataValida(datainicio)) {
        return { erro: "Data de início inválida." };
    }

    if (datafinal !== null && !DataValida(datafinal)) {
        return { erro: "Data final inválida." };
    }

    if (datafinal !== null && datafinal < datainicio) {
        return {
            erro: "A data final não pode ser anterior à inicial."
        };
    }

    return {
        dados: {
            animalidfk,
            piqueteidfk,
            datainicio,
            datafinal
        }
    };
};

const GetAllAlocados = async (req, res) => {
    try {
        const registro = await mdlAlocados.GetAllAlocados();

        return res.status(200).json({
            status: "ok",
            registro
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao listar alocações."
        });
    }
};

const GetAlocadoByID = async (req, res) => {

    const id = LerID(req.params.alocadoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const registro = await mdlAlocados.GetAlocadoByID(id);

        if (registro.length === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Alocação não encontrada."
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
            mensagem: "Erro ao consultar alocação."
        });
    }
};

const InsertAlocado = async (req, res) => {

    const { erro, dados } = ValidarAlocado(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlAlocados.InsertAlocado(dados);

        if (resultado.msg === "relacionamento_invalido") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Animal ou piquete inexistente ou removido."
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
            mensagem: "Erro ao cadastrar alocação."
        });
    }
};

const UpdateAlocado = async (req, res) => {

    const id = LerID(req.params.alocadoid);
    const { erro, dados } = ValidarAlocado(req.body);

    if (!id || erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro || "ID inválido."
        });
    }

    try {
        const resultado = await mdlAlocados.UpdateAlocado(id, dados);

        if (resultado.msg === "relacionamento_invalido") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Animal ou piquete inexistente ou removido."
            });
        }

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Alocação não encontrada."
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
            mensagem: "Erro ao atualizar alocação."
        });
    }
};

const DeleteAlocado = async (req, res) => {

    const id = LerID(req.params.alocadoid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const resultado = await mdlAlocados.DeleteAlocado(id);

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Alocação não encontrada."
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
            mensagem: "Erro ao remover alocação."
        });
    }
};

module.exports = {
    GetAllAlocados,
    GetAlocadoByID,
    InsertAlocado,
    UpdateAlocado,
    DeleteAlocado
};