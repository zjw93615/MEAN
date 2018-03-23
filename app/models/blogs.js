var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogsSchema = new Schema({
  username: { type: String, required: true},
  title: { type: String, required: true},
  summary: { type: String, required: true},
  body: { type: String, required: true},
  timestamp: { type: Date, default: Date.now},
  commentId: Schema.ObjectId
}, { _id: true });

module.exports = mongoose.model('Blog', BlogsSchema);