var mongoose = require('mongoose');
    
var dateSch = new mongoose.Schema
({
	date: String,
	politicians: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Appnt"
      }
   ],
});

// GIVE A SERIES OF METHODS FOR AUTHENTICATION FOR THIS SCHEMA
module.exports = mongoose.model('Agenda',dateSch);