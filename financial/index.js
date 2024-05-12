require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Financeiro = require("./model/financeiro")
const settings = require("./config/config")
const verificarToken = require("./middleware/jwt_verify")
const app = express()

app.use(express.json())
app.use(cors())

const urldb = settings.dbpath;
mongoose.connect(urldb,
    {useNewUrlParser:true, useUnifiedTopology:true})
   .then((rs)=>console.log(rs))
   .catch((error)=>console.log(error))

app.post("/api/financeiro/add", verificarToken, (req, res)=> {
    const dados = new Financeiro(req.body)
    dados.save().then((result)=>{
        res.status(201).send({output: "Insert ok", payload: result})
    }).catch((error)=> res.status(400).send({output: "Não foi possível cadastrar", err: error}))
})

app.put("/api/financeiro/update/:id", verificarToken, (req, res)=> {
    Financeiro.findByIdAndUpdate(req.params.id, req.body, {new:true}).then((result)=> {
        if(!result){
            res.status(400).send({output: "Não foi possivel localizar"})
        }
        res.status(200).send({output: "Atualziado", payload: result})
    }).catch((error)=> res.status(500).send({output: "Erro ao atualizar", err: error}))
})

app.listen(process.env.PORT, ()=>console.log("Servidor on na porta "+process.env.PORT))