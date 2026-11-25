const servidorDw3 = document.body.dataset.apiUrl;

const formulario = document.getElementById("formAlocado");

const alocadoID = formulario.dataset.id;
const modo = formulario.dataset.modo;

const mensagem = document.getElementById("mensagemFormulario");
const botaoSalvar = document.getElementById("btnSalvar");

// GET BY ID
const GetAlocadoByID = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAlocadoByID/" + id,
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
const InsertAlocado = async (registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/insertAlocado",
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
const UpdateAlocado = async (id, registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/updateAlocado/" + id,
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

// Consulta animais para preencher o select.
const CarregarAnimais = async () => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAllAnimais",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    const selecao = document.getElementById("animalidfk");

    for (const animal of dados.registro) {

        const opcao = document.createElement("option");

        opcao.value = animal.animalid;
        opcao.textContent = animal.nome;

        selecao.appendChild(opcao);
    }
};

// Consulta piquetes para preencher o select.
const CarregarPiquetes = async () => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAllPiquetes",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    const selecao = document.getElementById("piqueteidfk");

    for (const piquete of dados.registro) {

        const opcao = document.createElement("option");

        opcao.value = piquete.piqueteid;

        opcao.textContent =
            piquete.descricao +
            " — " +
            piquete.pasto_descricao;

        selecao.appendChild(opcao);
    }
};

// Carrega os dados da alocação.
const CarregarAlocado = async () => {

    const alocado = await GetAlocadoByID(alocadoID);

    document.getElementById("animalidfk").value =
        alocado.animalidfk;

    document.getElementById("piqueteidfk").value =
        alocado.piqueteidfk;

    document.getElementById("datainicio").value =
        alocado.datainicio;

    document.getElementById("datafinal").value =
        alocado.datafinal || "";
};

// Envia o formulário.
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (modo === "visualizar") return;

    const registro = {
        animalidfk:
            Number(document.getElementById("animalidfk").value),

        piqueteidfk:
            Number(document.getElementById("piqueteidfk").value),

        datainicio:
            document.getElementById("datainicio").value,

        datafinal:
            document.getElementById("datafinal").value || null
    };

    try {
        botaoSalvar.disabled = true;

        if (modo === "novo") {
            await InsertAlocado(registro);
        } else {
            await UpdateAlocado(alocadoID, registro);
        }

        window.location.href = "/alocados";

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {

    try {
        // Carrega primeiro os registros relacionados.
        await CarregarAnimais();
        await CarregarPiquetes();

        // Depois carrega a alocação para edição.
        if (alocadoID) {
            await CarregarAlocado();
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