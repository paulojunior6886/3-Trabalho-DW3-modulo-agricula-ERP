const servidorDw3 = document.body.dataset.apiUrl;

const corpoTabela = document.getElementById("tabelaAlocados");

const mensagem = document.getElementById("mensagemAlocados");

// GET ALL
const GetAllAlocados = async () => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/getAllAlocados",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    MostrarAlocados(dados.registro);
};

// DELETE
const DeleteAlocado = async (id) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + "/deleteAlocado/" + id,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    return await LerResposta(resposta);
};

// Monta a tabela.
const MostrarAlocados = (alocacoes) => {

    corpoTabela.replaceChildren();

    for (const alocado of alocacoes) {

        const linha = document.createElement("tr");

        const campos = [
            alocado.alocadoid,
            alocado.animal_nome,
            alocado.piquete_descricao,
            alocado.datainicio,
            alocado.datafinal || "Não definida"
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
            "/alocados/visualizar/" + alocado.alocadoid;

        const editar = document.createElement("a");
        editar.className = "btn";
        editar.textContent = "Editar";
        editar.href =
            "/alocados/editar/" + alocado.alocadoid;

        const excluir = document.createElement("button");
        excluir.className = "btn";
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", async () => {

            if (!confirm("Deseja excluir esta alocação?")) {
                return;
            }

            try {
                await DeleteAlocado(alocado.alocadoid);
                await GetAllAlocados();

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
        await GetAllAlocados();

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.hidden = false;
    }
});