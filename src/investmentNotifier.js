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
        let protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        let host = window.location.hostname;
        let port = '';

        if (host === 'localhost') {
            port = ':3000';
        }
        
        this.socket = new WebSocket(`${protocol}://${host}:${port}/ws`);
        
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

        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch {}
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

        this.events.forEach((e) => {
            this.handlers.forEach((handler) => {
                handler(e);
            });
        });
    }
}

const InvestNotifier = new InvestmentNotifier();
export { NewInvestment, InvestNotifier } 