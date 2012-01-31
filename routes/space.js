var utils = require("../utils.js");
var _ = require("underscore");

exports.read = function(req, res) {
  var id = req.params.id;
  req.session.space = id;
  res.render('canvas.jade', {
    locals: _.extend({}, utils.locals, {
      title: 'collabow - ' + id,
      user: req.session.user
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
