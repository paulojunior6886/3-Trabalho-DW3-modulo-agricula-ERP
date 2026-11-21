const servidorDw3 = document.body.dataset.apiUrl;

const CarregarIndicador = async (rota, elementoID) => {

    const token = localStorage.getItem("token");

    const resposta = await fetch(
        servidorDw3 + rota,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await LerResposta(resposta);

    const elemento = document.getElementById(elementoID);

    elemento.textContent = dados.registro.length;
};

document.addEventListener("DOMContentLoaded", async () => {

    try {
        await Promise.all([
            CarregarIndicador("/getAllPastos", "totalPastos"),
            CarregarIndicador("/getAllPiquetes", "totalPiquetes"),
            CarregarIndicador("/getAllAnimais", "totalAnimais"),
            CarregarIndicador("/getAllAlocados", "totalAlocados")
        ]);

    } catch (erro) {
        const mensagem = document.getElementById("mensagemPainel");

        mensagem.textContent = erro.message;
        mensagem.hidden = false;
    }
});