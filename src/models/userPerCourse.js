const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const userPerCourseSchema= new Schema({
    documento:{
        type:String,
        require:true
    },
    curso:{
        type:String,
        require:true
    }
});

const UserPerCourse=mongoose.model('userPerCourse',userPerCourseSchema);
module.exports=UserPerCourse;