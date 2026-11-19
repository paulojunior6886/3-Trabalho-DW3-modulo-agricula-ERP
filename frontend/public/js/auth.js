// Verifica se há token armazenado.
function verificarAutenticacao() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("/login");
        return false;
    }

    return true;
}

// Armazena token e nome do usuário.
function salvarAutenticacao(token, username) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
}

// Limpa a autenticação.
function limparAutenticacao() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
}

// Encerra a sessão no navegador.
function realizarLogout() {
    limparAutenticacao();
    window.location.replace("/login");
}

// Interpreta a resposta JSON das APIs.
// O fetch continua nos arquivos de cada módulo.
async function LerResposta(resposta) {

    const dados = await resposta.json();

    if (resposta.status === 401) {
        realizarLogout();
        throw new Error("Sessão inválida ou expirada.");
    }

    if (!resposta.ok || dados.status !== "ok") {
        throw new Error(
            dados.mensagem || "Erro ao executar a operação."
        );
    }

    return dados;
}

// Verifica a sessão ao abrir uma página interna.
document.addEventListener("DOMContentLoaded", () => {

    if (document.body.dataset.protected === "true") {
        verificarAutenticacao();
    }

});