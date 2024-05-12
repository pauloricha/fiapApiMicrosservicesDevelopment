const jwt = require("jsonwebtoken")
const config = require("../config/config")

function verificarToken(req, res, next){
    const token_enviado = req.headers.token

    if(!token_enviado){
        return res.status(401).send({output: "Não permitido acessar."})
    }

    jwt.verify(token_enviado, config.jwt_secret, (err, rs)=>{
        if(err){
            return res.status(400).send({output: "token inválido"})
        }

        req.content = {
            id:rs.id,
            user:rs.user,
        }
        next()
    })
}

module.exports = verificarToken