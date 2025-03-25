import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances(props) {
    const userName = props.userName;
    const [investments, setInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({ name: '', quantity: '', price: '' });

    useEffect(() => {
        fetchInvestments();
    }, []);


    const fetchInvestments = async () => {
        try {
            const response = await fetch('/api/investments', {
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch investments');
            } 

            const data = await response.json();
            setInvestments(data || []);
        } catch (error) {
            console.error('Error fetching investments:', error);
            alert(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvestment({ ...newInvestment, [name]: value });
    };

    const addInvestment = async () => {
        if (newInvestment.name && newInvestment.quantity && newInvestment.price) {
            try {
                const response = await fetch('/api/investments', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newInvestment.name,
                        price: parseFloat(newInvestment.price),
                        quantity: parseFloat(newInvestment.quantity),
                        userId
                    }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error('Failed to save investment');
                }

                const responseData = await response.json();
                setInvestments(prevInvestments => [...prevInvestments, responseData]);
                setNewInvestment({ name: '', quantity: '', price: '' });
            } catch (error) {
                console.error('Error adding investment:', error);
            }
        }
    };

    const editInvestment = async (id, field, value) => {
        const updatedInvestments = investments.map((investment) => 
            investment._id === id ? { ...investment, [field]: value } : investment
        );
        setInvestments(updatedInvestments);

        try {
            await fetch(`/api/investments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error updating investment:', error);
        }
    };

    return (
        <main className="bg-secondary">
            <div className="container">
                <h3>{userName}</h3>
                <section className="investments">
                    <h3 className="top-head">Current Investments</h3>
                    <div className="card-group">
                        {investments.map((investment) => (
                            <div className="card" key={investment._id}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor={`name-${investment._id}`}>Investment Name:</label>
                                        <input
                                            type="text"
                                            value={investment.name}
                                            onChange={(e) => editInvestment(investment._id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`quantity-${investment._id}`}>Quantity:</label>
                                        <input
                                            type="number"
                                            value={investment.quantity}
                                            onChange={(e) => editInvestment(investment._id, 'quantity', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`price-${investment._id}`}>Price:</label>
                                        <input
                                            type="number"
                                            value={investment.price}
                                            onChange={(e) => editInvestment(investment._id, 'price', parseFloat(e.target.value))}
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