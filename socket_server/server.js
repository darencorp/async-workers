var app = require('http').createServer(),
    io = require('socket.io')(app);

console.log("Listen 8001 ...")
app.listen(8001);

rooms = []

io.on('connect', function (socket) {

    rooms.forEach(room => {
        socket.join(room);
    });

    socket.on('broadcast', function (data) {
        io.to(data['room']).emit('feed', data);
    });

    socket.on('enter', function (data) {
        socket.join(data);
        rooms.push(data);
    });

    socket.on('end', function (data) {
        io.in(data).clients(function (error, sockets) {
            sockets.forEach(socketId => io.sockets.sockets[socketId].leave(data));
        });
        rooms.splice(rooms.indexOf(data), 1);
    });
});
