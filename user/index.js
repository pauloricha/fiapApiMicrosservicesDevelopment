require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet =  require("helmet")
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require("./config/config")
const User = require("./model/user")
const auth = require("./middleware/auth")
const ManagerUser = require("./model/manageruser")
const gerarToken = require("./utils/token")

const app = express()

app.use(express.json())
app.use(cors())

const urldb = config.dbpath;
mongoose.connect(urldb,
    {useNewUrlParser:true, useUnifiedTopology:true})
   .then((rs)=>console.log(rs))
   .catch((error)=>console.log(error))

app.get("/", (req, res)=> {
    res.send({output:req.headers})
})

app.post("/api/user/add", (req, res)=> {
    bcrypt.hash(req.body.senha, config.bcrypt_salt, (err, crypto)=> {
        if(err){
            return res.status(500).send({output: "Erro ao processar o cadastro"})
        }

        req.body.senha = crypto

        const data = new User(req.body)
        data.save().then((data)=>{
            res.status(201).send({output: "Inserted", payload: data})
        }).catch((erro)=>res.status(400).send({output:`Insertion Fail -> ${erro}`}))
    })
})

app.post("/api/user/login", (req, res)=>{
    const us = req.body.usuario
    const sh = req.body.senha

    User.findOne({nomeusuario:us}).then((result)=>{
        if(!result){
            return res.status(404).send({output: "Usuario nao existe"})
        }

        bcrypt.compare(sh, result.senha).then((rs)=> {
            if(!rs){
                return rs.status(400).send({output: "Usuario ou senha incorreto"})
            }
            const token = gerarToken(result._id, result.usuario)
            console.log(token);
            const info = new ManagerUser({userid:result._id, username:result.username, information:req.headers})
            info.save()
            res.status(200).send({output: "Autenticado", token: token})
        })
        .catch((error)=>res.status(500).send({output: `Erro ao processar dados -> ${error}`}))
    })
    .catch((err)=> res.status(500).send({output: `Erro ao processar login -> ${err}`}))
})

app.put("/api/user/:id", auth, (req, res)=> {
    bcrypt.hash(req.body.senha, config.bcrypt_salt, (err, crypto)=> {
        req.body.senha = crypto
        User.findByIdAndUpdate(req.params.id, req.body, {new:true}).then((result)=> {
            if(!result){
                res.status(400).send({output: "Não foi possivel localizar"})
            }
            res.status(200).send({output: "Atualziado", payload: result})
        }).catch((error)=> res.status(500).send({output: "Erro ao atualizar", err: error}))
    })
})

app.use((req, res)=> {
    res.type("application/josn")
    res.status(404).send("404 - Not found")
})

app.listen(process.env.PORT, ()=>console.log("Servidor on na porta "+process.env.PORT))