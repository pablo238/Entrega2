const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const estudianteSchema= new Schema({
    documento:{
        type:String,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    correo:{type:String,
        require:true},
     telefono:{
        type:Number,
        require:true
     }
});

const Estudiante=mongoose.model('Estudiante',estudianteSchema);
module.exports=Estudiante;