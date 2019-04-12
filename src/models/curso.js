const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema= new Schema({
    nombre:{
        type:String,
        require:true
    },
    descripcion: {
        type:String,
        require:true
    },
    modalidad: {
        type:String,
        require:false
    },
    id: {
        type:Number,
        require:true
    },
    valor: {
        type:Number,
        require:true
    },
    intensidad: {
        type:Number,
        require:false
    },
    estado: {
        type:String,
        require:true
    }
    
});

const Curso=mongoose.model('Curso',cursoSchema);
module.exports=Curso;