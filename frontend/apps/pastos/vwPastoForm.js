const servidorDw3 = document.body.dataset.apiUrl;

const formulario = document.getElementById("formPasto");

const pastoID = formulario.dataset.id;

const modo = formulario.dataset.modo;

const mensagem = document.getElementById("mensagemFormulario");

const botaoSalvar = document.getElementById("btnSalvar");

// GET BY ID
const GetPastoByID = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getPastoByID/" + id,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    return dados.registro[0];
};

// INSERT
const InsertPasto = async (registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/insertPasto",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(registro)
        }
    );

    return await LerResposta(resposta);
};

// UPDATE
const UpdatePasto = async (id, registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/updatePasto/" + id,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(registro)
        }
    );

    return await LerResposta(resposta);
};

// Carrega os dados para editar ou visualizar.
const CarregarPasto = async () => {

    const pasto = await GetPastoByID(pastoID);

    document.getElementById("descricao").value =
        pasto.descricao;

    document.getElementById("areatotal").value =
        pasto.areatotal;
};

// Envia o formulário.
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (modo === "visualizar") {
        return;
    }

    const registro = {
        descricao:
            document.getElementById("descricao").value.trim(),

        areatotal:
            Number(document.getElementById("areatotal").value)
    };

    try {
        botaoSalvar.disabled = true;

        if (modo === "novo") {
            await InsertPasto(registro);
        } else {
            await UpdatePasto(pastoID, registro);
        }

        window.location.href = "/pastos";

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = false;
    }
});

// Inicializa a página.
document.addEventListener("DOMContentLoaded", async () => {

    try {
        if (pastoID) {
            await CarregarPasto();
        }

        if (modo === "visualizar") {

            document.getElementById("descricao").disabled = true;
            document.getElementById("areatotal").disabled = true;

            botaoSalvar.hidden = true;
        }

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = true;
    }

});