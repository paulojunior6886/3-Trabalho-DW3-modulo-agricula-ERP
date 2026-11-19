// Importar as dependências
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mdlLogin = require("../model/mdlLogin");

// Realizar login e gerar o JWT.
const Login = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username ||
            !password
        ) {
            return res.status(400).json({
                auth: false,
                message: "Informe usuário e senha."
            });
        }

        const credencial = await mdlLogin.GetCredencial(username);

        if (credencial.length === 0) {
            return res.status(401).json({
                auth: false,
                message: "Login inválido."
            });
        }

        const senhaCorreta = bcrypt.compareSync(
            password,
            credencial[0].password
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                auth: false,
                message: "Login inválido."
            });
        }

        const token = jwt.sign(
            { username: username },
            process.env.JWT_SECRET,
            { expiresIn: 3600 }
        );

        return res.json({
            auth: true,
            token: token,
            username: username
        });

    } catch (erro) {
        console.error("[Login]", erro);

        return res.status(500).json({
            auth: false,
            message: "Erro interno na autenticação."
        });
    }
};

// Protege as rotas com JWT.
function AutenticaJWT(req, res, next) {

    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) {
        return res.status(401).json({
            auth: false,
            message: "Não foi informado o token JWT"
        });
    }

    const partes = tokenHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            auth: false,
            message: "Formato do token inválido."
        });
    }

    const token = partes[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        function (erro, decoded) {

            if (erro) {
                return res.status(401).json({
                    auth: false,
                    message: "JWT inválido ou expirado"
                });
            }

            req.username = decoded.username;
            next();
        }
    );
}

// Logout do servidor.
const Logout = (req, res) => {
    return res.json({
        auth: false,
        token: null
    });
};

module.exports = {
    Login,
    Logout,
    AutenticaJWT
};