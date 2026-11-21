// Importar as dependências
const express = require("express");
const routerApp = express.Router();

// Importar controller de Login
const appLogin = require("../login/controller/ctlLogin");
// Controllers dos módulos
const appPastos = require("../pastos/controller/ctlPastos");
const appPiquetes = require("../piquetes/controller/ctlPiquetes");
//const appAnimais = require("../animais/controller/ctlAnimais");
//const appAlocados = require("../alocados/controller/ctlAlocados");

// Rotas de Login e Logout
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// ROTA PROTEGIDA DE TESTE
routerApp.get("/home", appLogin.AutenticaJWT, (req, res) => {
    res.json({ status: "ok" });
});

// PASTOS
routerApp.get(
    "/getAllPastos",
    appLogin.AutenticaJWT,
    appPastos.GetAllPastos
);

routerApp.get(
    "/getPastoByID/:pastoid",
    appLogin.AutenticaJWT,
    appPastos.GetPastoByID
);

routerApp.post(
    "/insertPasto",
    appLogin.AutenticaJWT,
    appPastos.InsertPasto
);

routerApp.put(
    "/updatePasto/:pastoid",
    appLogin.AutenticaJWT,
    appPastos.UpdatePasto
);

routerApp.delete(
    "/deletePasto/:pastoid",
    appLogin.AutenticaJWT,
    appPastos.DeletePasto
);

// PIQUETES
routerApp.get(
    "/getAllPiquetes",
    appLogin.AutenticaJWT,
    appPiquetes.GetAllPiquetes
);

routerApp.get(
    "/getPiqueteByID/:piqueteid",
    appLogin.AutenticaJWT,
    appPiquetes.GetPiqueteByID
);

routerApp.post(
    "/insertPiquete",
    appLogin.AutenticaJWT,
    appPiquetes.InsertPiquete
);

routerApp.put(
    "/updatePiquete/:piqueteid",
    appLogin.AutenticaJWT,
    appPiquetes.UpdatePiquete
);

routerApp.delete(
    "/deletePiquete/:piqueteid",
    appLogin.AutenticaJWT,
    appPiquetes.DeletePiquete
);
/*
// ANIMAIS
routerApp.get(
    "/getAllAnimais",
    appLogin.AutenticaJWT,
    appAnimais.GetAllAnimais
);

routerApp.get(
    "/getAnimalByID/:animalid",
    appLogin.AutenticaJWT,
    appAnimais.GetAnimalByID
);

routerApp.post(
    "/insertAnimal",
    appLogin.AutenticaJWT,
    appAnimais.InsertAnimal
);

routerApp.put(
    "/updateAnimal/:animalid",
    appLogin.AutenticaJWT,
    appAnimais.UpdateAnimal
);

routerApp.delete(
    "/deleteAnimal/:animalid",
    appLogin.AutenticaJWT,
    appAnimais.DeleteAnimal
);
*/
/*
// ALOCAÇÕES
routerApp.get(
    "/getAllAlocados",
    appLogin.AutenticaJWT,
    appAlocados.GetAllAlocados
);

routerApp.get(
    "/getAlocadoByID/:alocadoid",
    appLogin.AutenticaJWT,
    appAlocados.GetAlocadoByID
);

routerApp.post(
    "/insertAlocado",
    appLogin.AutenticaJWT,
    appAlocados.InsertAlocado
);

routerApp.put(
    "/updateAlocado/:alocadoid",
    appLogin.AutenticaJWT,
    appAlocados.UpdateAlocado
);

routerApp.delete(
    "/deleteAlocado/:alocadoid",
    appLogin.AutenticaJWT,
    appAlocados.DeleteAlocado
);
*/
module.exports = routerApp;