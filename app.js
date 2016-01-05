/*jslint indent:2, white:true, node:true, sloppy:true*/
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var process = require('process');
var debug = require('debug')('stats');
var stats = { 'messages' : 0, 'last_update' : null };
var sprintf = require("sprintf").sprintf;

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
  stats.messages++;
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

function report() {
  var end = process.hrtime();
  if (stats.last_update) {
    var delta_t_sec = end[0] - stats.last_update[0] +
      ((end[1] - stats.last_update[1]) / 1e9);
    debug("clients: " + io.engine.clientsCount + ", message rate: " +
          sprintf("%8.3f msg/sec", stats.messages / delta_t_sec));
  } else {
    debug("clients: " + io.engine.clientsCount + ", so far " +
          stats.messages + " messages sent");
  }
  stats.messages = 0;
  stats.last_update = end;
}

setInterval(report, 10000);
