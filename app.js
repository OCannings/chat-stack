var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app);

function getPort() {
  var portFlag = process.argv.indexOf("-p");
  if (portFlag === -1) {
    return 3000;
  } else {
    return parseInt(process.argv[portFlag+1]);
  }
}

app.use("/assets", express.static(__dirname + "/assets"))
app.listen(getPort());
console.log("Server started on port "+getPort());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
var sockets = [];
io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  socket.on('message', function (data) {
    for (var i=0;i<sockets.length;i++) {
      sockets[i].emit('message', data);
    }
  });
});
