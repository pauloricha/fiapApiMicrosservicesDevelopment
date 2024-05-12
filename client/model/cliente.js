const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    nome:{type:String, require:true},
    email:{type:String, unique:true, require:true},
    cpf:{type:String, unique:true, require:true},
    telefone:String,
    idade:{type:Number, require:true},
    usuario:{type:String, unique:true, require:true},
    senha:{type:String, require:true},
    datacadastro:{type:Date, default:Date.now},
})

const Cliente = mongoose.model("cliente", schema)

module.exports = Cliente