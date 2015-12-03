'use strict'

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PollSchema = new Schema({
  question: {type:String},
  answers: {type:String}

})
