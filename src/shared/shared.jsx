import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shared.css';

export function Shared(props) {
    const userName = props.userName;

    const [sharedInvestments, setSharedInvestments] = useState([]);
    const [newShare, setNewShare] = useState({ investment: '', recipient: ''});
    const [btcData, setBtcData] = useState(null);
    const [btcLoading, setBtcLoading] = useState(null);
    const [btcError, setBtcError] = useState(null);

    useEffect(() => {
        if (userName) {
            fetch('/api/sharedInvestments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((Investments) => {
                    setSharedInvestments(investments);
                })
                .catch((error) => {
                    console.error('Error fetching shared investments:', error);
                });
        }
    }, [userName]);

    useEffect(() => {
        fetch("https://api.coinpaprika.com/v1/coins/btc-bitcoin")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })

            .then((data) => {
                setBtcData(data);
                setBtcLoading(false);
            })
            .catch((error) => {
                setBtcError(error);
                setBtcLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewShare({ ...newShare, [name]: value });
    };

    const shareInvestment = () => {
        if (newShare.investment && newShare.recipient) {
            fetch('/api/shareInvestment', {
                method: 'POST',
                body: JSON.stringify({
                    investment: newShare.investment,
                    recipient: newShare.recipient,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.msg === 'Investment shared successfully!') {
                        alert(`Investment shared with ${newShare.recipient}!`);
                        setNewShare({ investment: '', recipient: '' });
                    } else {
                        alert('Failed to share investment.');
                    }
                })
                .catch((error) => {
                    console.error('Error sharing investment:', error);
                    alert('Error sharing investment.');
                });
        }
    };

    return (
        <main className="bg-secondary">
            <div className="container">
                <h3>{userName}</h3>

                <section className="bitcoin-data">
                    <h3>Bitcoin Info</h3>
                    {btcLoading && <p>Loading Bitcoin data...</p>}
                    {btcError && <p>Error: {btcError.message}</p>}
                    {btcData && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{btcData.name} ({btcData.symbol})</h5>
                                <p>{btcData.description}</p>
                                <ul>
                                    <li>Rank: {btcData.rank}</li>
                                    <li>Type: {btcData.type}</li>
                                    <li>First Data: {btcData.first_data_at}</li>
                                    <li>Last Data: {btcData.last_data_at}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </section>

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
                            <span>Investment: </span>
                            <input
                                type="text"
                                name="investment"
                                placeholder="Berkshire Hathaway"
                                value={newShare.investment}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <span>User: </span>
                            <input
                                type="text"
                                name="recipient"
                                placeholder="jackdorsey"
                                value={newShare.recipient}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={shareInvestment} disabled={!newShare.investment || !newShare.recipient}>Share Now</button>
                </section>
            </div>
        </main>
    );
}