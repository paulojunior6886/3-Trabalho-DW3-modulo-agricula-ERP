const servidorDw3 = document.body.dataset.apiUrl;

const corpoTabela = document.getElementById("tabelaAnimais");

const mensagem = document.getElementById("mensagemAnimais");

// GET ALL
const GetAllAnimais = async () => {

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

    MostrarAnimais(dados.registro);
};

// DELETE
const DeleteAnimal = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/deleteAnimal/" + id,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    return await LerResposta(resposta);
};

// Monta a tabela HTML.
const MostrarAnimais = (animais) => {

    corpoTabela.replaceChildren();

    for (const animal of animais) {

        const linha = document.createElement("tr");

        const campos = [
            animal.animalid,
            animal.nome,
            animal.datanasc
        ];

        for (const valor of campos) {
            const coluna = document.createElement("td");
            coluna.textContent = valor ?? "";
            linha.appendChild(coluna);
        }

        const acoes = document.createElement("td");

        const visualizar = document.createElement("a");
        visualizar.className = "btn";
        visualizar.textContent = "Visualizar";
        visualizar.href =
            "/animais/visualizar/" + animal.animalid;

        const editar = document.createElement("a");
        editar.className = "btn";
        editar.textContent = "Editar";
        editar.href =
            "/animais/editar/" + animal.animalid;

        const excluir = document.createElement("button");
        excluir.className = "btn";
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", async () => {

            if (!confirm("Deseja excluir este animal?")) {
                return;
            }

            try {
                await DeleteAnimal(animal.animalid);
                await GetAllAnimais();

            } catch (erro) {
                mensagem.textContent = erro.message;
                mensagem.hidden = false;
            }
        });

        acoes.append(visualizar, editar, excluir);

        linha.appendChild(acoes);

        corpoTabela.appendChild(linha);
    }
};

document.addEventListener("DOMContentLoaded", async () => {

    try {
        await GetAllAnimais();

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
    }
});