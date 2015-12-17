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

function doEmit(e) {
  var rooms = e['rooms'];
  if (!(rooms && typeof rooms.forEach === 'function' && rooms.length > 0)) {
    return;
  }
  var sender = io.sockets;
  rooms.forEach(function(room) { sender = sender.to(room); });
  sender.emit('message', e['msg']);
  stats.messages++;
}

io.on('connection', function(socket) {
  socket.on('join', socket.join.bind(socket));
  socket.on('leave', socket.leave.bind(socket));
  socket.on('emit', doEmit);

  var disconnectMessages = [];
  socket.on('addDisconnectMessage', function(e) {
    disconnectMessages.push(e);
  });
  socket.on('disconnect', function() {
    disconnectMessages.forEach(doEmit);
  });
  socket.on('connect_error', function(error) {
      debug('ERROR: ' + JSON.stringify(error));
  });
});

function report() {
    var end = process.hrtime();
    if (stats.last_update) {
        var delta_t_sec = (((end[0] - stats.last_update[0]) * 1000000000) +
            (end[1] - stats.last_update[1])) / 1000000000;
        debug("clients: " + io.engine.clientsCount + ", message rate: " +
              sprintf("%8.3f msg/sec", stats.messages / delta_t_sec));
    } else {
        debug("clients: " + io.engine.clientsCount + ", so far " +
              stats.messages + " messages sent");
    }
    stats.messages = 0;
    stats.last_update = end;
}

setInterval(report, 3000);
