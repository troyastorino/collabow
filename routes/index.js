var mongo = require("../db/mongo.js")

// GET home page
exports.index = function(req, res){
  res.render('index', { title: 'Collabow' })
};

// POST an email address
exports.email = function(req, res) {
  var addr = new mongo.Email();
  addr.email = req.body.email;
  addr.save(function(err) {
    var text = err ? "error" : "saved";
    console.log(addr.email + ":" + text);
    res.json(text);
  });
}
