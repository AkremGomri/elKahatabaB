const mongoose = require('mongoose');
const Joi = require('joi');
const uniqueValidator=require('mongoose-unique-validator');
const User = require('./User');

const roomSchema= mongoose.Schema({
    id: { type: String, unique : true, required : true, index: true},
    users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    messages: [{
        sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
        msg: { type: String },
        date: { type:Date, default: Date(Date.now()) }
    }]

});

roomSchema.methods.joiValidate = function(obj) {
	const schema =  Joi.object({});
	const validation = schema.validate(obj);
    return validation; 
}

// roomSchema.index({ _id }, { unique: true });
roomSchema.plugin(uniqueValidator); 

module.exports=mongoose.model('Room',roomSchema);