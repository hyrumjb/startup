import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shared.css';

export function Shared(props) {
    const userName = props.userName;

    const [sharedInvestments, setSharedInvestments] = useState([]);
    const [newShare, setNewShare] = useState({ investment: '', recipient: ''});

    useEffect(() => {
        if (userName) {
            fetch('/api/finances')
                .then((response) => response.json())
                .then((Investments) => {
                    setSharedInvestments(investments);
                });
        }
    }, [userName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewShare({ ...newShare, [name]: value });
    };

    const shareInvestment = () => {
        if (newShare.investment && newShare.recipient) {
            const recipient = newShare.recipient;
            const sharedData = localStorage.getItem(`shared_${recipient}`);
            const recipientShares = sharedData ? JSON.parse(sharedData) : [];

            const sharedInvestment = {
                investment: newShare.investment,
                sharedBy: userName,
                id: Date.now()
            };

            recipientShares.push(sharedInvestment);
            localStorage.setItem(`shared_${recipient}`, JSON.stringify(recipientShares));
            alert(`Investment shared with ${recipient}!`);
            setNewShare({ investment: '', recipient: '' });
        }
    };

    return (
        <main className="bg-secondary">
            <div className="container">
                <h3>{userName}</h3>
                <section className="investments">
                    <h3 className="top-head">Shared Investments</h3>
                    <div className="card-group">
                        {sharedInvestments.map((investment, index) => (
                            <div className="card" key={index}>
                                <div className="card-header">@{investment.sharedBy}</div>
                                <div className="card-body">
                                    <h5 className="card-title">{investment.investment}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="share-investments">
                    <h3>Share Investment</h3>
                    <div className="inputs">
                        <div>
                            <span>Investment</span>
                            <input
                                type="text"
                                name="investment"
                                placeholder="Berkshire Hathaway"
                                value={newShare.investment}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <span>User</span>
                            <input
                                type="text"
                                name="recipient"
                                placeholder="jackdorsey"
                                value={newShare.recipient}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={shareInvestment}>Share Now</button>
                </section>
            </div>
        </main>
    );
}