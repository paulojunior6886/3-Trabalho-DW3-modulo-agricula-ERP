const servidorDw3 = document.body.dataset.apiUrl;

const formulario = document.getElementById("formAnimal");

const animalID = formulario.dataset.id;
const modo = formulario.dataset.modo;

const mensagem = document.getElementById("mensagemFormulario");
const botaoSalvar = document.getElementById("btnSalvar");

// GET BY ID
const GetAnimalByID = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAnimalByID/" + id,
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
const InsertAnimal = async (registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/insertAnimal",
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
const UpdateAnimal = async (id, registro) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/updateAnimal/" + id,
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

// Carrega os dados para edição.
const CarregarAnimal = async () => {

    const animal = await GetAnimalByID(animalID);

    document.getElementById("nome").value =
        animal.nome;

    document.getElementById("datanasc").value =
        animal.datanasc;
};

// Processa o envio.
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (modo === "visualizar") return;

    const registro = {
        nome:
            document.getElementById("nome").value.trim(),

        datanasc:
            document.getElementById("datanasc").value
    };

    try {
        botaoSalvar.disabled = true;

        if (modo === "novo") {
            await InsertAnimal(registro);
        } else {
            await UpdateAnimal(animalID, registro);
        }

        window.location.href = "/animais";

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {

    try {
        if (animalID) {
            await CarregarAnimal();
        }

        if (modo === "visualizar") {
            document.getElementById("nome").disabled = true;
            document.getElementById("datanasc").disabled = true;

            botaoSalvar.hidden = true;
        }

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
        botaoSalvar.disabled = true;
    }
});