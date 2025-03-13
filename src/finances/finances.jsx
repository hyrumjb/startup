import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances(props) {
    const userName = props.userName;

    const [investments, setInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({ name: '', amount: '', quantity: '' });

    useEffect(() => {
        if (userName) {
            const savedData = localStorage.getItem(userName);
            if (savedData) {
                setInvestments(JSON.parse(savedData));
            } else {
                setInvestments([]);
            }
        }
    }, [userName]);

    useEffect(() => {
        if (userName) {
            localStorage.setItem(userName, JSON.stringify(investments));
        }
    }, [investments, userName]);

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

    const editInvestment = (id, field, value) => {
        setInvestments(
            investments.map((investment) =>
                investment.id === id ? { ...investment, [field]: value } : investment
            )
        );
    };

    async function saveInvestment(investment) {
        const newInvestment = { name: userName, amount: amount, quantity: quantity };

        await fetch('/api/finances', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newInvestment),
        });
    }

    return (
        <main className="bg-secondary">
            <div className="container">
                <h3>{userName}</h3>
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
                    <h3>Add Investment</h3>
                    <div className="inputs">
                        <input
                            type="text"
                            name="name"
                            placeholder="Investment"
                            value={newInvestment.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={newInvestment.amount}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
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