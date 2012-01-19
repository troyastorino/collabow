var bcrypt = require('bcrypt');

exports.Auth = function(mongo) {
  // newUser has attributes name, username, email, password
  // fn should be function(error, user)
  this.createUser = function(newUser, fn) {
    var user = new mongo.User;
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
                fn(null, user)
              };
            });
          }
        });
      }
    });
  };

  // user must have login and password fields, and fn is a function(err, user)
  this.checkUser = function(user, fn) {
    var User = mongo.User;
    var login = user.login;
    var password = user.password;

    var checkPassword = function(password, user, fn) {
      bcrypt.compare(password, user.hash, function(err, result) {
        if (err) fn(err);
        else {
          if (result) {
            fn(null, user);
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
              "Couldn't find record for that username or email"));
          });
        }
      };
    });
  };
};
