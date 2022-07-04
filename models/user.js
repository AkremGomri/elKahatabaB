const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joigoose = require("joigoose")(mongoose);
const Joi = require('joi');
//Joi.objectId = require("joi-objectid")(Joi);
const userSchema= mongoose.Schema({
    email:{type: String ,required:true,unique:true,default: ''},
    password :{type:String ,required:true,default: ''},
    fullname:{type:String ,required:true,default: ''},
    pseudo:{type:String ,required:true,unique:true,default: ''},
    date_of_birth:{type:Date,default: ''},
    horoscope:{type:String,default: ''},
    city:{type:String ,default: ''},
    gender:{type:String,default: ''},
    searchGender:{type:String,default: ''},
     /* j'aime : [
        {type:mongoose.Schema.Types._id ,ref:'userSchema'}
    ],  */
    Photo:{ type: String,default: ''}
    
});
userSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({
        email: Joi.string().email().required(),
		password: Joi.string().required(),
		fullname: Joi.string().required(),
		pseudo: Joi.string().required(),
		date_of_birth: Joi.date(),
        horoscope:Joi.string(),
        city:Joi.string(),
        gender:Joi.string(),
        searchGender:Joi.string(),
        Photo:Joi.string()
	});
	const validation = schema.validate(obj);
    return validation;
    
}
userSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('User',userSchema);