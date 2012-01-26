var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    hbs = require('hbs');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set("view engine", "hbs");
  app.use(express.static(__dirname + "/public"));
});



hbs.registerHelper("css", function(url) {
  return "<link rel='stylesheet' href='stylesheets/"+url+".css' type='text/css'>";
});



app.get('/', function (req, res) {

  res.render("index", {});

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

app.listen(getPort());
console.log("Server started on port "+getPort());

function getPort() {
  var portFlag = process.argv.indexOf("-p");
  if (portFlag === -1) {
    return 3000;
  } else {
    return parseInt(process.argv[portFlag+1]);
  }
}


