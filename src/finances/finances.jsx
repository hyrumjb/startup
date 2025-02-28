import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances() {
    const [username, setUsername] = useState('');
    const [investments, setInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({ name: '', amount: '', quantity: '' });

    useEffect(() => {
        if (username) {
            const savedData = localStorage.getItem(username);
            if (savedData) {
                setInvestments(JSON.parse(savedData));
            } else {
                setInvestments([]);
            }
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            localStorage.setItem(username, JSON.stringify(investments));
        }
    }, [investments, username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvestment({ ...newInvestment, [name]: value });
    };

    const addInvestment = () => {
        if (newInvestment.name && newInvestment.amount && newInvestment.quantity) {
            setInvestments([
                ...investments,
                { id: Date.now(), ...newInvestment, amount: parseFloat(newInvestment.amount), quantity: parseFloat(newInvestment.quantity) }
            ]);
            setNewInvestment({ name: '', amount: '', quantity: ''})
        }
    };

    const editInvestemnt = (id, field, value) => {
        setInvestments(
            investments.map((investment) =>
                investment.id === id ? { ...investment, [field]: value } : investment
            )
        );
    };

    return (
        <main className="bg-secondary">
            <div className="container">
                <div className="player-name">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username to view/save investments"
                    />
                </div>
                <section className="investments">
                    <h3 className="top-head">Current Investments</h3>
                    <div className="card-group">
                        {investments.map((investment) => (
                            <div className="card" key={investment.id}>
                                <div className="card-body">
                                    <input
                                        type="text"
                                        value={investment.name}
                                        onChange={(e) => editInvestment(investment.id, 'name', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={investment.amount}
                                        onChange={(e) => editInvestment(investment.id, 'amount', parseFloat(e.target.value))}
                                    />
                                    <input
                                        type="number"
                                        value={investment.quantity}
                                        onChange={(e) => editInvestment(investment.id, 'quantity', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="add-investments">
                    <h3>Add Investmnet</h3>
                    <div className="inputs">
                        <input
                            type="text"
                            name="name"
                            placeholder="Investment"
                            value={newInvestment.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="amount"
                            placeholder="Amount"
                            value={newInvestment.amount}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="quantity"
                            placeholder="Quantity"
                            value={newInvestment.quantity}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={addInvestment}>Add Investment</button>
                </section>
            </div>
        </main>
    );
}