const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const table = new mongoose.Schema({
    nomeusuario:{type:String, require:true, unique:true},
    senha:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    nomecompleto:{type:String},
    telefone:{type:String},
    datacadastro:{type:Date, default:Date.now},
})

const User = mongoose.model("user", table)

module.exports = User