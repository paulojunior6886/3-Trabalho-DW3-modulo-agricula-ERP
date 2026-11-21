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

// Dashboard
app.get("/home", (req, res) => {
    res.render("home.njk", {
        title: "Painel principal",
        activeMenu: "home",
        backendUrl: servidorDw3
    });
});

// PASTOS - Listagem
app.get("/pastos", (req, res) => {
    res.render("pastos.njk", {
        title: "Pastos",
        activeMenu: "pastos",
        backendUrl: servidorDw3
    });
});

// PASTOS - Cadastro
app.get("/pastos/novo", (req, res) => {
    res.render("pastoForm.njk", {
        title: "Cadastrar pasto",
        activeMenu: "pastos",
        backendUrl: servidorDw3,
        id: "",
        modo: "novo"
    });
});

// PASTOS - Visualização
app.get("/pastos/visualizar/:id", (req, res) => {
    res.render("pastoForm.njk", {
        title: "Visualizar pasto",
        activeMenu: "pastos",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "visualizar"
    });
});

// PASTOS - Edição
app.get("/pastos/editar/:id", (req, res) => {
    res.render("pastoForm.njk", {
        title: "Editar pasto",
        activeMenu: "pastos",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "editar"
    });
});

// PIQUETES - Listagem
app.get("/piquetes", (req, res) => {
    res.render("piquetes.njk", {
        title: "Piquetes",
        activeMenu: "piquetes",
        backendUrl: servidorDw3
    });
});

// PIQUETES - Cadastro
app.get("/piquetes/novo", (req, res) => {
    res.render("piqueteForm.njk", {
        title: "Cadastrar piquete",
        activeMenu: "piquetes",
        backendUrl: servidorDw3,
        id: "",
        modo: "novo"
    });
});

// PIQUETES - Visualização
app.get("/piquetes/visualizar/:id", (req, res) => {
    res.render("piqueteForm.njk", {
        title: "Visualizar piquete",
        activeMenu: "piquetes",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "visualizar"
    });
});

// PIQUETES - Edição
app.get("/piquetes/editar/:id", (req, res) => {
    res.render("piqueteForm.njk", {
        title: "Editar piquete",
        activeMenu: "piquetes",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "editar"
    });
});

// ANIMAIS - Listagem
app.get("/animais", (req, res) => {
    res.render("animais.njk", {
        title: "Animais",
        activeMenu: "animais",
        backendUrl: servidorDw3
    });
});

// ANIMAIS - Cadastro
app.get("/animais/novo", (req, res) => {
    res.render("animalForm.njk", {
        title: "Cadastrar animal",
        activeMenu: "animais",
        backendUrl: servidorDw3,
        id: "",
        modo: "novo"
    });
});

// ANIMAIS - Visualização
app.get("/animais/visualizar/:id", (req, res) => {
    res.render("animalForm.njk", {
        title: "Visualizar animal",
        activeMenu: "animais",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "visualizar"
    });
});

// ANIMAIS - Edição
app.get("/animais/editar/:id", (req, res) => {
    res.render("animalForm.njk", {
        title: "Editar animal",
        activeMenu: "animais",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "editar"
    });
});

// ALOCAÇÕES - Listagem
app.get("/alocados", (req, res) => {
    res.render("alocados.njk", {
        title: "Alocações",
        activeMenu: "alocados",
        backendUrl: servidorDw3
    });
});

// ALOCAÇÕES - Cadastro
app.get("/alocados/novo", (req, res) => {
    res.render("alocadoForm.njk", {
        title: "Cadastrar alocação",
        activeMenu: "alocados",
        backendUrl: servidorDw3,
        id: "",
        modo: "novo"
    });
});

// ALOCAÇÕES - Visualização
app.get("/alocados/visualizar/:id", (req, res) => {
    res.render("alocadoForm.njk", {
        title: "Visualizar alocação",
        activeMenu: "alocados",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "visualizar"
    });
});

// ALOCAÇÕES - Edição
app.get("/alocados/editar/:id", (req, res) => {
    res.render("alocadoForm.njk", {
        title: "Editar alocação",
        activeMenu: "alocados",
        backendUrl: servidorDw3,
        id: req.params.id,
        modo: "editar"
    });
});

// Inicia o servidor Front-End
app.listen(port, () => {
    console.log(`Front-End rodando na porta ${port}`);
});