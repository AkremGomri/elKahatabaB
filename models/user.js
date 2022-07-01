const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joigoose = require("joigoose")(mongoose);
const Joi = require('joi');
//Joi.objectId = require("joi-objectid")(Joi);
const userSchema= mongoose.Schema({
    email:{type: String ,required:true,unique:true},
    motDePasse :{type:String ,required:true},
    nom:{type:String ,required:true},
    prenom:{type:String ,required:true},
    age:{type:Number ,required:true},
    adresse:{type:String ,required:true},
    date_de_naissance:{type:Date ,required:true},
    sexe:{type:String ,required:true},
     /* amis : [
        {type:mongoose.Schema.Types._id ,ref:'userSchema'}
    ],  */
    imageUrl:{type:String ,required:true}
    
});
userSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
		motDePasse: Joi.string().required(),
		email: Joi.string().email().required(),
		nom: Joi.string().required(),
		prenom: Joi.string().required(),
        age:Joi.number().required(),
        adresse:Joi.string().required(),
		date_de_naissance: Joi.date().required(),
        sexe:Joi.string().required(),
        imageUrl:Joi.string().required()
	});
	const validation = schema.validate(obj);
    return validation;
    
}
userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);