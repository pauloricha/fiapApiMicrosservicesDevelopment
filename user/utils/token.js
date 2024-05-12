const jwt = require("jsonwebtoken")
const config = require("../config/config")

function gerarToken(id, usuario) {
    return jwt.sign({idusuario:id,nomeusuario:usuario}, 
        config.jwt_secret,{expiresIn: config.jwt_expire})
}

module.exports = gerarToken