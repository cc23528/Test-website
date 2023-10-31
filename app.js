//carregando modulos
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
//const mongoose = require('mongoose')
const app = express()
const admin = require("./routes/admin")
const path = require('path')
const mongoose = require('mongoose')
const dbURI = 'mongodb://127.0.0.1:27017/aprendendo';
const session = require('express-session')
const flash = require('connect-flash')


//configuracoes:
    //sessão
        app.use(session({
            secret: 'cursodenose',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //middlaware:
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    
    //handlebars:
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //body-parser:
        app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        )
        app.use(bodyParser.json())
    //mongoose:
    mongoose.Promise = global.Promise;
        mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
        console.log('Conexão bem-sucedida!');
        })
        .catch(erro => {
        console.error('Erro:: ' + erro);
        });
    //public
        app.use(express.static(path.join(__dirname,"public")))

        app.use((req,res, next) =>{
            console.log("sou um middlaware")
            next()
        })
//rotass
    app.use('/admin', admin)
//outros
    //configurando porta
            const PORT = 8081
            app.listen(PORT, () => {
                console.log("servidor rodando na porta: " + PORT)
            })