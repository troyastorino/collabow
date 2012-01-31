var utils = require("../utils.js");

exports.home = function(mongo) {
  return function(req, res) {
    var user;
    if (user = req.session.user) {
      if (req.params.username === user.username) {
         mongo.User.findOne({username: user.username}, function(err, user) {
          if (err) {
            res.send("err: " + err);
          }
          res.render('home.jade', {
            locals: utils.locals,
            user: user,
          });
        });
        
      } else {
        res.send("You are viewing " + req.params.username + "'s space.");
      }
    } else {
      res.send("Please login");
    }
  }
};

exports.login = function(req, res) {
  var user;
  if (user = req.session.user) {
    res.send(user.username + " is already logged in!")
  } else {
    res.render('login.jade', {locals: utils.locals});
  }
};

exports.signup = function(req, res) {
  var user;
  if (user = req.session.user) {
    res.send(user.username + " is currently signed in.");
  } else {
    res.render('signup.jade', {locals: utils.locals});
  }
};

var addUserCookie = function(req, user) {
  req.session.user = user;
}

exports.createUser = function(mongo) {
  return function(req, res) {
    mongo.createUser(req.body, function(err, user) {
      if (user) {
        addUserCookie(req, user);
        res.redirect("/" + user.username);      
      } else {
        utils.error(res, err);
      }
    });
  }
};

exports.loginUser = function(mongo) {
  return function(req, res) {
    mongo.loginUser(req.body, function(err, user) {
      if (user) {
        addUserCookie(req, user);
        res.redirect('/' + user.username);
      } else {
        utils.error(res, err);
      }
    });
  }
};

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};
