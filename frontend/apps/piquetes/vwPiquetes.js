const servidorDw3 = document.body.dataset.apiUrl;

const corpoTabela = document.getElementById("tabelaPiquetes");

const mensagem = document.getElementById("mensagemPiquetes");

// GET ALL
const GetAllPiquetes = async () => {

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

    MostrarPiquetes(dados.registro);
};

// DELETE
const DeletePiquete = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/deletePiquete/" + id,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    return await LerResposta(resposta);
};

// Preenche a tabela.
const MostrarPiquetes = (piquetes) => {

    corpoTabela.replaceChildren();

    for (const piquete of piquetes) {

        const linha = document.createElement("tr");

        const campos = [
            piquete.piqueteid,
            piquete.descricao,
            piquete.latitude,
            piquete.longitude,
            piquete.pasto_descricao
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
            "/piquetes/visualizar/" + piquete.piqueteid;

        const editar = document.createElement("a");
        editar.className = "btn";
        editar.textContent = "Editar";
        editar.href =
            "/piquetes/editar/" + piquete.piqueteid;

        const excluir = document.createElement("button");
        excluir.className = "btn";
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", async () => {

            if (!confirm("Deseja excluir este piquete?")) {
                return;
            }

            try {
                await DeletePiquete(piquete.piqueteid);
                await GetAllPiquetes();

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
        await GetAllPiquetes();

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
    }

});