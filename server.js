import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './models/messageModel.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Dirección del servidor de Angular
    methods: ["GET", "POST"]
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);
app.use(express.static(path.join(__dirname, 'dist/chatbot-angular')));

io.on('connection', (socket) => {
  console.log('Un usuario conectado.');
  socket.on('userMessage', async (message) => {
    try {
      const response = await fetch('http://localhost:3000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      socket.emit('botMessage', data.botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
