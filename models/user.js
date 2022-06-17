const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const userSchema= mongoose.Schema({
    email:{type: String ,required:true,unique:true},
    motDePasse :{type:String ,required:true},
    nom:{type:String ,required:true},
    prenom:{type:String ,required:true},
    age:{type:Number ,required:true},
    addresse:{type:String ,required:true},
    date_de_naissance:{type:Date ,required:true},
    sexe:{type:String ,required:true},
    amis : [
        {type:mongoose.Schema.Types._Id ,ref:'ami'}
    ],
    imageUrl:{type:String ,required:true}
    

});
userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);