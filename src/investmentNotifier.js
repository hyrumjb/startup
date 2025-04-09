const NewInvestment = {
    System: 'investment',
    Shared: 'shared'
};

class EventMessage {
    constructor(from, type, value) {
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

class InvestmentNotifier {
    events = [];
    handlers = [];
    socket = null;

    connect() {
        const isLocal = window.location.hostname === 'localhost';

        const protocol = isLocal ? 'ws' : 'wss';
        const host = window.location.hostname;
        const port = isLocal ? '3000' : '';

        const wsUrl = `${protocol}://${host}${isLocal ? ':3000' : ''}/ws`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.receiveEvent(new EventMessage('Investment', NewInvestment.System, { msg: 'connected' }));
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.receiveEvent(new EventMessage('Investment', NewInvestment.System, { msg: 'disconnected' }));
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                this.connect();
            }, 5000);
        };

        this.socket.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };
    }

    broadcastEvent (from, type, value) {
        if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
            console.warn('WebSocket is not connected.');
            return;
        }
        const event = new EventMessage(from, type, value);
        
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(event));
        } else if (this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.addEventListener('open', () => {
                this.socket.send(JSON.stringify(event));
            }, { once: true });
        } else {
            console.error("WebSocket is closed or in an error state.");
        }
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    removeHandler(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    receiveEvent(event) {
        this.events.push(event);

        this.handlers.forEach((handler) => {
            handler(event);
        });
    }
}

const InvestNotifier = new InvestmentNotifier();
export { NewInvestment, InvestNotifier } 