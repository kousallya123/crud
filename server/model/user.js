const mongoose=require('mongoose')

const User=new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
   

}) 

module.exports=mongoose.model('user',User)