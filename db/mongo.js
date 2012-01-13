var mongoose = exports.mongoose = require("mongoose");

// Set up email list in database
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
  email: String
});

var Email = exports.Email = mongoose.model("Email", EmailSchema);
