const express = require('express')
const router = express.Router()
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')



// ...

router.get('/', (req, res) => {
    res.render("admin/index")
});

router.get('/post', (req,res) => {
    res.send("pagina de post")
})

router.get('/categorias', (req,res) => {
    res.render("admin/categorias")
})


router.get('/categorias/add', (req,res) => {
    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req,res) =>{

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "nome da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategoria", { erros: erros })
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() =>{
            req.flash("success_msg", "categoria criada com sucesso!")
            console.log("categoria salva com sucesso!")
        }).catch((erro) =>{
            req.flash("erro_msg", "houve um erro ao salvar a categoria, tente novamente!")
            res.redirect('/admin')
        })
    }
    
})

module.exports = router