
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongo = require('./db/mongo.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {pretty: true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  mongo.mongoose.connect("mongodb://localhost/emails");
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongo.mongoose.connect(process.env.MONGOLAB_URI);
});

// Routes

app.get('/', routes.index);

app.post('/email', routes.email)

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
