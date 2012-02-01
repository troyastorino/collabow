var utils = require("../utils.js");
var _ = require("underscore");

exports.read = function(req, res) {
  var id = req.params.id;
  req.session.space = id;
  res.render('canvas.jade', {
    locals: _.extend({}, utils.locals, {
      title: 'collabow - ' + id,
      username: req.session.user.username
    })
  });
};

exports.create = function(mongo) {
  return function(req, res) {
    mongo.createSpace(req.body.title, req.session.user.username, function(err, space) {
      if (err) utils.error(res, err);
      else {
        res.json(space);
      }
    });
  };
};

exports.public = function(req, res) {
  var id = req.params.space;
  req.session.space = id;
  res.render('canvas.jade', {
    locals: _.extend({}, utils.locals, {
      title: 'collabow - ' + id,
      username: 'anonymous'
    })
  });
}
