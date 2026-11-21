const servidorDw3 = document.body.dataset.apiUrl;

const corpoTabela = document.getElementById("tabelaPastos");

const mensagem = document.getElementById("mensagemPastos");

// GET ALL
const GetAllPastos = async () => {

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

    MostrarPastos(dados.registro);
};

// DELETE
const DeletePasto = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/deletePasto/" + id,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    return await LerResposta(resposta);
};

// Mostra os registros recebidos na tabela.
const MostrarPastos = (pastos) => {

    corpoTabela.replaceChildren();

    for (const pasto of pastos) {

        const linha = document.createElement("tr");

        const colunaID = document.createElement("td");
        colunaID.textContent = pasto.pastoid;

        const colunaDescricao = document.createElement("td");
        colunaDescricao.textContent = pasto.descricao;

        const colunaArea = document.createElement("td");
        colunaArea.textContent = pasto.areatotal;

        const colunaAcoes = document.createElement("td");

        const visualizar = document.createElement("a");
        visualizar.className = "btn";
        visualizar.textContent = "Visualizar";
        visualizar.href =
            "/pastos/visualizar/" + pasto.pastoid;

        const editar = document.createElement("a");
        editar.className = "btn";
        editar.textContent = "Editar";
        editar.href =
            "/pastos/editar/" + pasto.pastoid;

        const excluir = document.createElement("button");
        excluir.className = "btn";
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", async () => {

            if (!confirm("Deseja excluir este pasto?")) {
                return;
            }

            try {
                await DeletePasto(pasto.pastoid);
                await GetAllPastos();

            } catch (erro) {
                mensagem.textContent = erro.message;
                mensagem.hidden = false;
            }
        });

        colunaAcoes.append(
            visualizar,
            editar,
            excluir
        );

        linha.append(
            colunaID,
            colunaDescricao,
            colunaArea,
            colunaAcoes
        );

        corpoTabela.appendChild(linha);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await GetAllPastos();

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
    }
});