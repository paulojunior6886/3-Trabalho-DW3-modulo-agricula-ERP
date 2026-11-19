// Importar dependências
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const router = require("./routes/router");

const app = express();
const port = 40000;

// dependências para requisições HTTP e json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    next();
});

// Registra as rotas da API.
app.use(router);

// Inicia o servidor.
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});