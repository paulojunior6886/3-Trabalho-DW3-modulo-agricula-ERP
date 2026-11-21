const servidorDw3 = document.body.dataset.apiUrl;

const formulario = document.getElementById("formPiquete");

const piqueteID = formulario.dataset.id;

const modo = formulario.dataset.modo;

const mensagem = document.getElementById("mensagemFormulario");

const botaoSalvar = document.getElementById("btnSalvar");

// GET BY ID
const GetPiqueteByID = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getPiqueteByID/" + id,
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
const InsertPiquete = async (registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/insertPiquete",
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
const UpdatePiquete = async (id, registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/updatePiquete/" + id,
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

// Preenche a lista de pastos.
const CarregarPastos = async () => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAllPastos",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    const selecao = document.getElementById("pastoidfk");

    for (const pasto of dados.registro) {

        const opcao = document.createElement("option");

        opcao.value = pasto.pastoid;
        opcao.textContent = pasto.descricao;

        selecao.appendChild(opcao);
    }
};

// Preenche os campos da edição.
const CarregarPiquete = async () => {

    const piquete = await GetPiqueteByID(piqueteID);

    document.getElementById("descricao").value =
        piquete.descricao;

    document.getElementById("latitude").value =
        piquete.latitude;

    document.getElementById("longitude").value =
        piquete.longitude;

    document.getElementById("pastoidfk").value =
        piquete.pastoidfk;
};

// Envia os dados.
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (modo === "visualizar") return;

    const registro = {
        descricao:
            document.getElementById("descricao").value.trim(),

        latitude:
            Number(document.getElementById("latitude").value),

        longitude:
            Number(document.getElementById("longitude").value),

        pastoidfk:
            Number(document.getElementById("pastoidfk").value)
    };

    try {
        botaoSalvar.disabled = true;

        if (modo === "novo") {
            await InsertPiquete(registro);
        } else {
            await UpdatePiquete(piqueteID, registro);
        }

        window.location.href = "/piquetes";

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {

    try {
        // Primeiro carrega os pastos disponíveis.
        await CarregarPastos();

        // Depois carrega o piquete, se houver ID.
        if (piqueteID) {
            await CarregarPiquete();
        }

        if (modo === "visualizar") {
            formulario.querySelectorAll("input, select")
                .forEach((campo) => campo.disabled = true);

            botaoSalvar.hidden = true;
        }

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = true;
    }
});