'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');



var UserSchema = new Schema({


  email      : { type: String, unique: true, required: true },


  password   : { type:String },


  name       : { type: String, required: true },


  verified   : {type:Number,default:0},

  role       : {type:Number,default:0},

  avatar     : {type:String,default:''},

  lastLogin  :{type:Date},

  token      : {type:String}

});





var user = mongoose.model('user', UserSchema);


module.exports = {
  User : user
};
