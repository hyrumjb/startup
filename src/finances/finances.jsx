import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances(props) {
    const userName = props.userName;

    const [investments, setInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({ name: '', quantity: '', price: '' });

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

    const addInvestment = async () => {
        if (newInvestment.name && newInvestment.quantity && newInvestment.price) {
            const newInvestmentData = {
                id: Date.now(),
                ...newInvestment,
                price: parseFloat(newInvestment.price),
                quantity: parseFloat(newInvestment.quantity)
            };

            setInvestments([...investments, newInvestmentData]);
            setNewInvestment({ name: '', quantity: '', price: ''});

            await saveInvestment(newInvestmentData);
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
        const newInvestment = { name: userName, quantity: quantity, price: price };

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
                                    <div className="form-group">
                                        <label htmlFor={`name-${investment.id}`}>Investment Name:</label>
                                        <input
                                            type="text"
                                            value={investment.name}
                                            onChange={(e) => editInvestment(investment.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`quantity-${investment.id}`}>Quantity:</label>
                                        <input
                                            type="number"
                                            value={investment.quantity}
                                            onChange={(e) => editInvestment(investment.id, 'quantity', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`price-${investment.id}`}>Price:</label>
                                        <input
                                            type="number"
                                            value={investment.price}
                                            onChange={(e) => editInvestment(investment.id, 'price', parseFloat(e.target.value))}
                                        />
                                    </div>
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
                            name="quantity"
                            placeholder="Quantity"
                            value={newInvestment.quantity}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newInvestment.price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={addInvestment}>Add Investment</button>
                </section>
            </div>
        </main>
    );
}