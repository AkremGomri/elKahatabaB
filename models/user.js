const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Joigoose = require("joigoose")(mongoose);
const Joi = require('joi');
//Joi.objectId = require("joi-objectid")(Joi);
const userSchema= mongoose.Schema({
    email:{type: String ,required:true,unique:true},
    password :{type:String ,required:true},
    fullname:{type:String ,required:true},
    pseudo:{type:String ,required:true,unique:true},
    date_of_birth:{type:Date},
    horoscope:{type:String},
    city:{type:String },
    gender:{type:String},
    searchGender:{type:String},
     /* j'aime : [
        {type:mongoose.Schema.Types._id ,ref:'userSchema'}
    ],  */
    Photo:{ type: String}
    
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