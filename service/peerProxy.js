const { WebSocketServer, WebSocket } = require('ws');
const url = require('url');

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/ws') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });
        
    wss.on('connection', (socket) => {
        socket.isAlive = true;

        socket.on('message', function message(data) {
            socketServer.clients.forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    setInterval(() => {
        wss.clients.forEach((client) => {
            if (client.isAlive === false) {
                console.log('Terminating inactive client');
                client.terminate();
            }

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

module.exports = { peerProxy };