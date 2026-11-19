document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");

  const mensagem = document.getElementById("mensagemLogin");

  const botao = document.getElementById("btnEntrar");

  const servidorDw3 = form.dataset.backendUrl;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagem.hidden = true;
    botao.disabled = true;

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value;

    try {
      const resposta = await fetch(servidorDw3 + "/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados.auth || !dados.token) {
        throw new Error(dados.message || "Login inválido.");
      }

      salvarAutenticacao(dados.token, username);

      window.location.href = "/home";
    } catch (erro) {
      mensagem.textContent = erro.message;
      mensagem.hidden = false;
    } finally {
      botao.disabled = false;
    }
  });
});
