const express = require('express');
const app= express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser');
const funciones=require('./helpers/helpers')
const dirNode_modules = path.join(__dirname , '../node_modules')
require('./helpers/helpers')
const port = process.env.PORT || 3000;
process.env.URLDB='mongodb://localhost:27017/cursos'
const directoriopublico=path.join(__dirname,'../public');
const directoriopartials=path.join(__dirname,'../template/partials');
const directorioViews=path.join(__dirname,'../template/views');
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.set('views', directorioViews)
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine','hbs');

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/crearCurso',(req,res)=>{
    res.render('crearCurso')
})

app.post('/crearCurso',(req,res)=>{
    if (req.body=={}) {
    } else {
        res.render('resultadoCreacion',{
            mensaje: funciones.crearC(req.body)
        });   
    }
})

app.get('/listarCursos',(req,res)=>{
    res.render('listaCursos')

})

app.get('/inscribirme',(req,res)=>{
    res.render('inscribirseACurso')
})

app.post('/inscribirme',(req,res)=>{
    if (req.body=={}) {
    } else {
        res.render('resultadoCreacion',{
            mensaje: funciones.crearU(req.body)
        
        });
        
    }
})


app.get('/gestionCurso',(req,res)=>{
    res.render('gestionarCurso')
})

app.post('/gestionCurso',(req,res)=>{
    if(req.body.documento==null){
        funciones.cambiarEstadoC(req.body)
    }else{
        funciones.eliminarUsuarioDeCurso(req.body)
    }
    res.render('gestionarCurso')
})


app.listen(port,()=>{
    console.log('Escuchando en el puerto '+port)
})
