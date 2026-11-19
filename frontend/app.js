const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();

const port = process.env.FRONTEND_PORT || 40100;

const servidorDw3 =
    process.env.SERVIDOR_DW3 ||
    "http://localhost:40000";

// Configuração do Nunjucks
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "njk");

nunjucks.configure(path.join(__dirname, "view"), {
    autoescape: true,
    express: app,
    noCache: true
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use("/apps", express.static(
    path.join(__dirname, "apps")
));

// Página inicial
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Login
app.get("/login", (req, res) => {
    res.render("loginView.njk", {
        backendUrl: servidorDw3
    });
});

// Inicia o servidor Front-End
app.listen(port, () => {
    console.log(`Front-End rodando na porta ${port}`);
});