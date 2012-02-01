//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , sio = require('socket.io')
    , mongo = require('./db/mongo.js')
    , parseCookie = connect.utils.parseCookie
    , port = (process.env.PORT || 8081)
    , utils = require("./utils.js")
    , url = require('url')
    , user = require("./routes/user.js")
    , space = require("./routes/space.js")
//    , redis = require("./db/redis.js").redis
    , RedisStore = require('connect-redis')(express)
    , _ = require('underscore');

var sessionKey = 'express.sid';
var sessionStore;

//Setup Express
var server = express.createServer();

server.configure('development', function() {
  mongo.mongoose.connect("mongodb://localhost/collabow");
  sessionStore = new RedisStore;
//  client = redis.createClient();
});

server.configure('production', function() {
  console.log("configuring");
  mongo.mongoose.connect("mongodb://nodejitsu:344cef5563d74c877f29391ca5f5de74@staff.mongohq.com:10024/nodejitsudb561834104672");
  var redisUrl = url.parse("redis://nodejitsu:8329aed4aaf88eeddc4a66ddab459498@dogfish.redistogo.com:9459/"),
      redisAuth = redisUrl.auth.split(':');
  sessionStore = new RedisStore({
    host: redisUrl.hostname,
    port: redisUrl.port,
    db: redisAuth[0],
    pass: redisAuth[1]});
});

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
var io = sio.listen(server);

io.configure('production', function() {
  io.set('log level', 1);
});

io.configure('development', function() {
  io.set('log level', 3);
});

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
  var space;
  if (session && (space = session.space)) {
    socket.join(space);
    socket.on('action', function(action) {
      socket.broadcast.to(space).emit('action', action);
    });
  }
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

server.get('/public/:space', space.public);

// user must be logged in to see all pages after this
server.all('/*', function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});

server.all('/logout', user.logout);

server.get('/:username', user.home(mongo));

server.get("/space/:id", space.read);

server.post("/space", space.create(mongo));

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

