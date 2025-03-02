import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    },
});

//  message in real time
export function getRecieverSocketId(userId){        // we are getting the userId from the frontend
    return userSocketMap[userId];
} 

// to store list of online user
const userSocketMap = {};         // {userId: socketId} userid is we get from the database and socketid is the id of the socket 

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId; // we get the userId from the frontend
    if(userId){
        userSocketMap[userId] = socket.id;      // we are storing the socketId in the userSocketMap
    }

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // we are sending the userSocketMap to all the clients

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId]; // we are deleting the user from the userSocketMap when the user disconnects
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); // we are sending the updated userSocketMap to all the clients
    });
});

export {io, app, server};