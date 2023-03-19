//import mongoose
const mongoose = require('mongoose');
//create schema object
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  msgText: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }
})

//export module with model
module.exports = mongoose.model('Message', messageSchema);