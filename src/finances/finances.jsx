import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances(props) {
    const userName = props.userName;

    const [investments, setInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({ name: '', quantity: '', price: '' });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchUserId();
    }, [userName]);

    useEffect(() => {
        if (userId) {
            fetchInvestments();
        }
    }, [userId]);

    const fetchUserId = async () => {
        try {
            const response = await fetch(`/api/users/${userName}`);
            const user = await response.json();
            if (user) {
                setUserId(user._id);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchInvestments = async () => {
        try {
            if (userId) {
                const response = await fetch(`/api/investments/${userId}`);
                const data = await response.json();
                setInvestments(data || []);
            } else {
                console.error('User ID is not available');
            }
        } catch (error) {
            console.error('Error fetching investments:', error);
        }
    };

    const saveInvestment = async (investment) => {
        try {
            await fetch('/api/investments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...investment }),
            });
        } catch (error) {
            console.error('Error saving investment:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvestment({ ...newInvestment, [name]: value });
    };

    const addInvestment = async () => {
        if (newInvestment.name && newInvestment.quantity && newInvestment.price) {
            const newInvestmentData = {
                name: newInvestment.name,
                price: parseFloat(newInvestment.price),
                quantity: parseFloat(newInvestment.quantity),
                userId
            };

            try {
                const response = await fetch('/api/investments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newInvestmentData),
                });

                const savedInvestment = await response.json();

                setInvestments([...investments, savedInvestment]);
                setNewInvestment({ name: '', quantity: '', price: '' });
            } catch (error) {
                console.error('Error adding investment:', error);
            }
        }
    };

    const editInvestment = (id, field, value) => {
        setInvestments(
            investments.map((investment) =>
                investment.id === id ? { ...investment, [field]: value } : investment
            )
        );
    };

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