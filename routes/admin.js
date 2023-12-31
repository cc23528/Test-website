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
    Categoria.find().sort({date:'desc'}).lean()
    .then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash('error-msg', 'houve um erro ao listar as caregorias')
        res.redirect('/admin')
    })
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
            res.redirect('/admin/categorias')
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ao salvar a categoria, tente novamente!")
            res.redirect('/admin')
        })
    }
    
})

router.get('/categorias/edit/:id', (req,res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((erro) => {
      req.flash('error_msg', 'Esta categoria nao existe')
      res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req,res) => {

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
        res.render("admin/editcategorias", { erros: erros })
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
        
            categoria.save().then(() => {
                req.flash('success_msg', 'categoria editada com sucesso!')
                res.redirect('/admin/categorias')
            }).catch((err) => {
                req.flash('error_msg','houve um ero interno ao salvar a edicao de categorias')
                res.redirect('/admin/categorias')
            })
        
        
          }).catch((err) => {
            req.flash('error_msg', 'houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
          })
    }

})

router.post("/categorias/deletar",(req,res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
      req.flash("success_msg","Categoria deletada com sucesso!!!")
      res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("error_msg","Houve um erro ao deletar a categoria"+ err)
      res.redirect("/admin/categorias")
    })
})

module.exports = router