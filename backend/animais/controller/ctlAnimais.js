const mdlAnimais = require("../model/mdlAnimais");

// Verifica ID inteiro positivo.
const LerID = (valor) => {
    if (!/^[1-9]\d*$/.test(String(valor))) {
        return null;
    }

    const id = Number(valor);
    return Number.isSafeInteger(id) ? id : null;
};

// Verifica se a data realmente existe.
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

// Validação dos campos.
const ValidarAnimal = (body) => {

    const nome =
        typeof body?.nome === "string"
            ? body.nome.trim()
            : "";

    const datanasc = body?.datanasc;

    if (!nome || nome.length > 100) {
        return { erro: "Informe o nome do animal." };
    }

    if (!DataValida(datanasc)) {
        return { erro: "Data de nascimento inválida." };
    }

    return {
        dados: { nome, datanasc }
    };
};

const GetAllAnimais = async (req, res) => {
    try {
        const registro = await mdlAnimais.GetAllAnimais();

        return res.status(200).json({
            status: "ok",
            registro
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao listar animais."
        });
    }
};

const GetAnimalByID = async (req, res) => {

    const id = LerID(req.params.animalid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const registro = await mdlAnimais.GetAnimalByID(id);

        if (registro.length === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Animal não encontrado."
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
            mensagem: "Erro ao consultar animal."
        });
    }
};

const InsertAnimal = async (req, res) => {

    const { erro, dados } = ValidarAnimal(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlAnimais.InsertAnimal(dados);

        return res.status(201).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas,
            id: resultado.id
        });

    } catch (erroBanco) {
        console.error(erroBanco);
        return res.status(500).json({
            status: "erro",
            mensagem: "Erro ao cadastrar animal."
        });
    }
};

const UpdateAnimal = async (req, res) => {

    const id = LerID(req.params.animalid);
    const { erro, dados } = ValidarAnimal(req.body);

    if (!id || erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro || "ID inválido."
        });
    }

    try {
        const resultado = await mdlAnimais.UpdateAnimal(id, dados);

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Animal não encontrado."
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
            mensagem: "Erro ao atualizar animal."
        });
    }
};

const DeleteAnimal = async (req, res) => {

    const id = LerID(req.params.animalid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID inválido."
        });
    }

    try {
        const resultado = await mdlAnimais.DeleteAnimal(id);

        if (resultado.msg === "possui_alocacoes") {
            return res.status(409).json({
                status: "erro",
                mensagem: "O animal possui alocações ativas."
            });
        }

        if (resultado.linhasAfetadas === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Animal não encontrado."
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
            mensagem: "Erro ao remover animal."
        });
    }
};

module.exports = {
    GetAllAnimais,
    GetAnimalByID,
    InsertAnimal,
    UpdateAnimal,
    DeleteAnimal
};