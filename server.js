const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// 1. Criando a Classe HardwareEngine
class HardwareEngine {
    constructor() {
        this.data = {
            cpu: Math.floor(Math.random() * 100),
            ram: Math.floor(Math.random() * (16 - 4 + 1) + 4),
            temp: Math.floor(Math.random() * (80 - 40 + 1) + 40),
            status: "online",
            timestamp: new Date().toISOString()
        };
    }

    getStats() {
        return this.data;
    }
}

// 2. Criando o Endpoint GET /api/status
app.get('/api/status', (req, res) => {
    const engine = new HardwareEngine(); // Instanciando a classe
    const stats = engine.getStats();
    
    res.json(stats); // Retorna os dados em JSON
});

// Mantendo o Socket.io para o Dashboard em tempo real
io.on('connection', (socket) => {
    const interval = setInterval(() => {
        const engine = new HardwareEngine();
        socket.emit('serverData', engine.getStats());
    }, 2000);

    socket.on('disconnect', () => clearInterval(interval));
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Endpoint de status: http://localhost:${PORT}/api/status`);
});