var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  question: String,
  votes: { type: Number, required: true, default: 0},
});

var Question = mongoose.model('question', questionSchema);

module.exports = Question;