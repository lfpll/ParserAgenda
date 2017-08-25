var mongoose = require('mongoose');
    
var agendaSch = new mongoose.Schema
({
	nome:String,
	datas:Array, 
	titulo:String,
});

// GIVE A SERIES OF METHODS FOR AUTHENTICATION FOR THIS SCHEMA
module.exports = mongoose.model('Appnt',agendaSch);