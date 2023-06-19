
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: '*',
    }
})

io.on('connection', (socket) => {
    // broadcast to all sockets except the one that sent the message
    socket.on('draw-line', ({currPoint, prevPoint, lineColor}) => {
        socket.broadcast.emit('draw-line', {currPoint, prevPoint, lineColor});
    });
    // all sockets will receive the clear-canvas event
    socket.on('clear-canvas', () => {
        io.emit('clear-canvas');
    });

    socket.on('initial-canvas', () => {
        socket.broadcast.emit('get-canvas-status');
    });

    socket.on('canvas-status', (data) => {
        socket.broadcast.emit('get-canvas-status-from-server', data);
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
})