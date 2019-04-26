const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./helpers/helpers')
const dirNode_modules = path.join(__dirname, '../node_modules')
const mongoose = require('mongoose');
var multer = require('multer')
var upload = multer({})
require('./helpers/helpers')
require('./config/config');
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../template/partials');
const directorioViews = path.join(__dirname, '../template/views');
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.set('views', directorioViews)
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
const bcrypt = require('bcrypt');
var session = require('express-session')
var MemoryStore = require('memorystore')(session)
const Estudiante = require('./models/estudiante')

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resultado) => {
    if (err) {
        return console.log(error)
    }
    console.log("conectado")
});

app.use((req, res, next) => {
    if (req.session.documento) {
        res.locals.session = true
        res.locals.nombre = req.session.nombre
        res.locals.documento = req.session.documento
        res.locals.telefono = req.session.telefono
        res.locals.correo = req.session.correo
        res.locals.rol = req.session.rol
        if (req.session.rol == "Aspirante") {
            res.locals.aspirante = true
            res.locals.coordinador = false
        } else {
            res.locals.aspirante = false
            res.locals.coordinador = true
        }
    }

    next()
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/', (req, res) => {
    let error = (
        `<img src="https://t3.ftcdn.net/jpg/00/80/38/24/240_F_80382483_GWiqEyP0JZKhXyOUEnKz4sqzcns656GB.jpg" class="img-fluid"
        alt="Responsive image"><br>
        <h1>Porfavor verifique sus credenciales</h1><br>`)
    Estudiante.find({ documento: req.body.documento }).exec((err, duplicado) => {
        if (duplicado.length == 0) {
            return res.render('resultadoRegistro', {
                mensaje: error
            });
        } else {
            if (!bcrypt.compareSync(req.body.password, duplicado[0].password)) {
                return res.render('resultadoRegistro', {
                    mensaje: error
                });
            } else {
                req.session.documento = req.body.documento;
                req.session.nombre = duplicado[0].nombre;
                req.session.telefono = duplicado[0].telefono;
                req.session.correo = duplicado[0].correo;
                req.session.rol = duplicado[0].rol;
                req.session.avatar = duplicado[0].avatar.toString('base64');
                let rol
                if (req.session.rol == "Aspirante") {
                    rol = false
                } else {
                    rol = true
                }
               
                return res.render('home', {
                    nombre: duplicado[0].nombre.toUpperCase(),
                    coordinador: rol
                });
            }

        }
    })


})

app.get('/home', (req, res) => {
    if (!res.locals.session) {
        res.redirect("/")
    } else {
        return res.render('home', {
            nombre: req.session.nombre.toUpperCase()
        });
    }
})

app.get('/registrarse', (req, res) => {
    res.render('registrarse')
})

app.post('/registrarse', (req, res) => {
    funciones.registrarUsuario((req.body), function (resultado) {
        res.render('resultadoRegistro', {
            mensaje: resultado
        });
    })

})

app.get('/crearCurso', (req, res) => {
    if (!res.locals.coordinador) {
        res.redirect("/")
    } else
        res.render('crearCurso')
})

app.post('/crearCurso', (req, res) => {
    if (req.body == {}) {
    } else {
        funciones.crearC(req.body, function (resultado) {
            res.render('resultadoCreacion', {
                mensaje: resultado
            });
        })
    }
})

app.get('/listarCursos', (req, res) => {
    if (!res.locals.aspirante) {
        res.redirect("/")
    } else {
        funciones.listarCDisponibles(function (resultado) {
            res.render('listaCursos', {
                listarCDisponibles: resultado
            })
        })
    }
})

app.get('/inscribirme', (req, res) => {
    if (!res.locals.aspirante) {
        res.redirect("/")
    } else {
        funciones.listaCursos(function (resultado) {
            res.render('inscribirseACurso', {
                listaCursos: resultado
            })
        })
    }
})

app.post('/inscribirme', (req, res) => {
    if (req.body == {}) {
    } else {
        funciones.crearU(req.body, function (resultado) {
            res.render('resultadoCreacion', {
                mensaje: resultado

            });
        })

    }
})


app.get('/gestionCurso', (req, res) => {
    if (!res.locals.coordinador) {
        res.redirect("/")
    } else {
        funciones.gestionarCurso(function (resultado) {
            res.render('gestionarCurso', {
                gestionarCurso: resultado
            })
        })
    }
})

app.post('/gestionCurso', (req, res) => {
    if (req.body.documento == null) {
        funciones.cambiarEstadoC(req.body)
    } else {
        funciones.eliminarUsuarioDeCurso(req.body)
    }
    res.render('gestionarCurso')
})

app.get('/perfil', (req, res) => {
    if (!res.locals.session) {
        res.redirect("/")
    } else {
        console.log(req.session.avatar)
        return res.render('perfil', {
            avatar:req.session.avatar
        });
    }
})
app.post('/perfil',upload.single('imagen'), (req, res) => {
    if (!res.locals.session) {
        res.redirect("/")
    } else {
        funciones.actualizarUsuario(req.body,req.file.buffer, function (resultado) {
            req.session.avatar=resultado.toString('base64')
            
            return res.render('perfil', {
                avatar:req.session.avatar
            });
        })
        
    }
})
app.get('/salir', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err)
    })
    res.redirect('/')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto ' + process.env.PORT)
})
