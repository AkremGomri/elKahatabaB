const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('./User');

const messageSchema= mongoose.Schema({
    user1: { type: mongoose.Schema.ObjectId, ref: 'User' },
    user2: { type: mongoose.Schema.ObjectId, ref: 'User' },
    messages: [{
        sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
        msg: { type: String },
        date: { type:date, default: Date(Date.now()) }
    }]

});

messageSchema.methods.joiValidate = function(obj) {
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

reservationSchema.index({ idClient: 1, idVoiture: 1, DateMin: 1 }, { unique: true });
messageSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Message',messageSchema);