const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    nome_banco:{type:String, require:true},
    tipo_conta:{type:String, require:true},
    nome_titular:{type:String, require:true},
    limite_cartao:{type:String, require:true}
})

const Financeiro = mongoose.model("financeiro", schema)

module.exports = Financeiro