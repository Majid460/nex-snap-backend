import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import startServer from './src/core/data/remote/config.js';
import authRoute from './src/auth/routes/routes.js';
import snapRoutes from './src/snap/routes/routes.js';
import http from 'http';
import socket from './src/core/data/sockets/server.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

startServer(app);
socket.initSocket(server)

app.use('/api/auth', authRoute);
app.use('/api/snap', snapRoutes);

app.get('/', (req, res) => res.send('NexSnap API Running ✅'));

export default app;
