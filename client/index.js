require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const settings = require("./config/config.js")
const verificarToken = require("./middleware/jwt_verify.js")
const Cliente = require("./model/cliente.js")
const app = express()

app.use(express.json())
app.use(cors())

const urldb = settings.dbpath;
mongoose.connect(urldb,
    {useNewUrlParser:true, useUnifiedTopology:true})
   .then((rs)=>console.log(rs))
   .catch((error)=>console.log(error))

app.post("/api/cliente/add", verificarToken, (req, res)=> {
    bcrypt.hash(req.body.senha, settings.bcrypt_salt, (err, crypto)=> {
        if(err){
            return res.status(500).send({output: "Erro ao processar o cadastro"})
        }
        req.body.senha = crypto
        const dados = new Cliente(req.body)
        dados.save().then((result)=>{
            res.status(201).send({output: "Insert ok", payload: result})
        }).catch((error)=> res.status(400).send({output: "Não foi possível cadastrar", err: error}))
    })
})

app.put("/api/cliente/update/:id", verificarToken, (req, res)=> {
    Cliente.findByIdAndUpdate(req.params.id, req.body, {new:true}).then((result)=> {
        if(!result){
            res.status(400).send({output: "Não foi possivel localizar"})
        }
        res.status(200).send({output: "Atualizado", payload: result})
    }).catch((error)=> res.status(500).send({output: "Erro ao atualizar", err: error}))
})

app.delete("/api/cliente/delete/:id", verificarToken, (req, res)=> {
    Cliente.findByIdAndDelete(req.params.id).then((result)=> {
        res.status(204).send({output: "Apagado"})
    }).catch((error)=> res.status(500).send({output: "Erro ao excluir", err: error}))
})

app.listen(process.env.PORT, ()=>console.log("Servidor on na porta "+process.env.PORT))