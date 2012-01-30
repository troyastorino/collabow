var mongoose = exports.mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    bcrypt = require('bcrypt'),
    _ = require('underscore');

var UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  hash: String,
  spaces: [{type: Schema.ObjectId, ref: 'Space'}]
});

var User = exports.User = mongoose.model("User", UserSchema);

var SpaceSchema = new Schema({
  title: String,
  id: ObjectId,
  creator: [{type: Schema.ObjectId, ref: 'User'}],
  users: [{type: Schema.ObjectId, ref: 'User'}],
});

var Space = exports.Space = mongoose.model("Space", SpaceSchema);

// removes password hash from user
var sanitizeUser = function(user) {
  return _.extend({hash: undefined}, user);
};

// newUser has attributes name, username, email, password
// fn should be function(error, user)
exports.createUser = function(newUser, fn) {
  var user = new User;
  user.name = newUser.name;
  user.username = newUser.username;
  user.email = newUser.email;
  bcrypt.genSalt(function(err, salt) {
    if (err) fn(err);
    else {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) fn(err);
        else {
          user.hash = hash;
          user.save(function(err) {
            if (err) fn(err);
            else {
              fn(null, sanitizeUser(user))
            };
          });
        }
      });
    }
  });
};

// user must have login and password fields, and fn is a function(err, user)
exports.loginUser = function(user, fn) {
  var login = user.login;
  var password = user.password;

  var checkPassword = function(password, user, fn) {
    bcrypt.compare(password, user.hash, function(err, result) {
      if (err) fn(err);
      else {
        if (result) {
          fn(null, sanitizeUser(user));
        }
        else fn(new Error("Invalid password."));
      }
    });
  };
  
  User.findOne({email: login}, function(err, user) {
    if (err) fn(err);
    else {
      if (user) {
        checkPassword(password, user, fn);
      } else {
        User.findOne({username: login}, function(err, user) {
          if (user) {
            checkPassword(password, user, fn);
          } else fn(new Error(
            "Couldn't find record for that username or email"), null);
        });
      }
    };
  });
};

