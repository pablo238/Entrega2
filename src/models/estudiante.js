const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const estudianteSchema= new Schema({
    documento:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    rol:{
        type:String,
        require:true
    },
    nombre:{
        type:String,
        require:true
    },
    correo:{
        type:String,
        require:true,
        trim:true
    },
     telefono:{
        type:Number,
        require:true
     },
     avatar:{
         type:Buffer
     }

});

const Estudiante=mongoose.model('Estudiante',estudianteSchema);
module.exports=Estudiante;