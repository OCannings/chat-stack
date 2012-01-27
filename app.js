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
 
  var room_id = req.query.room_id;

  res.render("index", {
    room_id: room_id
  });

});

var sockets = [];
var rooms = {};

function getRoom(room_id) {
  if (!rooms["room_"+room_id]) {
    rooms["room_"+room_id] = {
      sockets: []
    };
  }
  return rooms["room_"+room_id];
}

function addSocket(room_id, socket) {
  var room = getRoom(room_id);
  room.sockets.push(socket);
}

function getRoomBySocket(socket) {
  for (var i in rooms) {
    for (var j=0;j<rooms[i].sockets.length;j++) {
      if (rooms[i].sockets[j] === socket) {
        return i;
      }
    }
  }
}

io.sockets.on('connection', function (socket) {

  socket.on('join_room', function(data) {
    addSocket(data.room_id, socket);
  });

  socket.on('message', function (data) {
    var sockets = rooms[getRoomBySocket(socket)].sockets;
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


