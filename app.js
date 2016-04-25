'use strict';
const REDIS_URL = process.env.REDIS_URL;
const DAY_IN_SECONDS = 60 * 60 * 24;

var debug = require("debug")("chat-app:main");
var app = require('express')();
var http = require('http').Server(app);
var socketSession = require('./socket-io-session');
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var redisStore = require('connect-redis')(require('express-session'));

var session = require('express-session')({
  store: new redisStore({
    host:REDIS_URL,
    port:6379
  }),
  secret: 'keyboard cat',
  ttl: 30 * DAY_IN_SECONDS,
  resave: true,
  saveUninitialized: true,
  rolling : true,
  cookie: {
    path: '/',
    maxAge: (30) * DAY_IN_SECONDS * 1000 
  }
});

app.use(session);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/setsession/:p', function(req, res){
  req.session.p = req.params.p;
  res.send('DONE!');
});

io.use(socketSession(session));
io.adapter(redis({ 
  host: REDIS_URL,
  port: 6379 
}));
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    debug(socket.handshake.session);
    socket.handshake.session.last_msg = msg;
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:'+process.env.PORT.toString());
});
