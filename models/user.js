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
    bio:{type:String,default: 'Mon Bio'},
    Photo:{ type: String,default: ''},
    searchGender:{type:String,default: ''},
    
    I_like_users_list : [
        this
    ],

    they_like_me_list: [
        this
    ],

    they_dislike_meList: [
        this
    ],

    I_dislike_users_list: [
        this
    ],

    Matches: [
        [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
    ],

    Notifs: [
        {
            senderId: {type: Object ,required:true},
            senderPhoto: { type: String },
            message: {type:String ,required:true,default: ''},
            type: {type:String, required: true, default:'no Type'},
            isnew: {type: Boolean, default: true}, 
            isRead: {type: Boolean, default: false},
            last_modified: {type: Date, default: new Date(), index: true}
        }
    ],
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