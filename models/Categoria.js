const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Categoria = new Schema({
    nome: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: Date.now()
    }
})
mongoose.model("categorias", Categoria)