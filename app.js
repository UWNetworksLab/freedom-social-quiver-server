/*jslint indent:2, white:true, node:true, sloppy:true*/
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 8080);


app.get('/', function(req, res) {
  res.status(200).send('Hello; socket.io!\n');
});

// Safe replacement for .bind() that also catches any errors.
// This is used to ensure that malformed client messages do not trigger an
// uncaught exception.
function safe(f, context) {
  return function() {
    try {
      return f.apply(context, arguments);
    } catch (e) {
      console.error('Safe error:', e);
    }
  };
}

var doEmit = safe(function(e) {
  io.sockets.to(e['room']).emit('message', e['msg']);
});

io.on('connection', function(socket) {
  socket.on('join', safe(socket.join, socket));
  socket.on('leave', safe(socket.leave, socket));
  socket.on('emit', doEmit);

  var disconnectMessages = [];
  socket.on('addDisconnectMessage', function(e) {
    disconnectMessages.push(e);
  });
  socket.on('disconnect', function() {
    disconnectMessages.forEach(doEmit);
  });

  // See https://www.joyent.com/developers/node/design/errors
  socket.on('error', function(err) {
    console.log('Error:', err);
  });
});
