// Importar as dependências
const express = require("express");
const routerApp = express.Router();

// Importar controller de Login
const appLogin = require("../login/controller/ctlLogin");

// Rotas de Login e Logout
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;