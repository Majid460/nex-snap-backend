import { Server } from 'socket.io';

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: '*' }
    });
    io.on('connection', socket => {
        console.log('🟢 User connected:', socket.id);
        socket.on('joinSnapRoom', snapId => socket.join(snapId));
    });
    return io;
};

const emitSnapDone = (snapId, data) => {
    if (io) {
        io.to(snapId).emit('snapProcessed', data);
    }
};
export default {
    initSocket,
    emitSnapDone,
};