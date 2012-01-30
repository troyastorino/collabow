//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , sio = require('socket.io')
    , mongo = require('./db/mongo.js')
    , port = (process.env.PORT || 8081)
    , utils = require("./utils.js")
    , user = require("./routes/user.js")
//    , redis = require("./db/redis.js").redis
    , RedisStore = require('connect-redis')(express)
    , _ = require('underscore');

var sessionKey = 'express.sid';
var sessionStore = new RedisStore;

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(express.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({
      secret: "bazinga",
      key: sessionKey,
      store: sessionStore,
      cookie: {
        maxAge: 100*24*60*60*1000
      }
    }));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

// variables to be defined in specific configuration
var client;

server.configure('development', function() {
  mongo.mongoose.connect("mongodb://localhost/collabow");
//  client = redis.createClient();
});

server.configure('production', function() {

});

//setup the errors
server.error(function(err, req, res, next){
  if (err instanceof NotFound) {
    res.render('404.jade', { locals: { 
      title : '404 - Not Found'
      ,description: ''
      ,author: ''
      ,analyticssiteid: 'XXXXXXX' 
    },status: 404 });
  } else {
    res.render('500.jade', { locals: { 
      title : 'The Server Encountered an Error'
      ,description: ''
      ,author: ''
      ,analyticssiteid: 'XXXXXXX'
      ,error: err
    },status: 500 });
  }
});
server.listen(port);

//Setup Socket.IO
var io = sio.listen(server),
    parseCookie = connect.utils.parseCookie;

io.set('authorization', function(data, accept) {
  if (data.headers.cookie) {
    data.cookie = parseCookie(data.headers.cookie);
    data.sessionID = data.cookie[sessionKey];
    sessionStore.get(data.sessionID, function(err, session) {
      if (err || !session) {
        accept('Error', false);
      } else {
        data.session = session;
        accept(null, true);
      }
    });
  } else {
    return accept("No cookie transmitted.", false);
  }
  accept(null, true);
});

io.sockets.on('connection', function(socket) {
  var session = socket.handshake.session;
  socket.join(session.space);
  socket.on('action', function(action) {
    socket.broadcast.to(session.space).emit('action', action);
  });
});


// Routes
server.get('/', function(req,res){
  res.render('index.jade', {
    locals: utils.locals
  });
});

server.get('/canvas', function(req, res) {
  res.render('canvas.jade', {
    locals: locals
  });
});

server.get('/signup', user.signup);

server.post('/signup', user.createUser(mongo));

server.get('/login', user.login);

server.post('/login', user.loginUser(mongo));

server.all('/logout', user.logout);

server.get('/:username', user.home);

server.get("/space/:id", function(req, res) {
  var id = req.params.id;
  req.session.space = id;
  res.render('canvas.jade', {
    locals: _.extend({}, utils.locals, {
      title: 'collabow - ' + id,
      user: req.session.user
    })
  });
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port );
