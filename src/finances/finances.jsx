import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './finances.css';

export function Finances() {
    return (
        <main className="bg-secondary">
            <div className="container">
                <div className="player-name">Username</div>
                <section className="investments">
                    <h3 className="top-head">Current Investments</h3>
                    <div className="card-group">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Bitcoin</h5>
                                <p className="card-text">$433.23</p>
                                <small className="text-muted">0.003</small>
                            </div>
                            <div className="card-footer">
                                <a href="shared.html" className="btn btn-primary">Share</a>
                                <a href="shared.html" className="btn btn-primary me-2">Edit</a>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Tesla</h5>
                                <p className="card-text">$560.23</p>
                                <small className="text-muted">4.33</small>
                            </div>
                            <div className="card-footer">
                                <a href="shared.html" className="btn btn-primary">Share</a>
                                <a href="shared.html" className="btn btn-primary me-2">Edit</a>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Ethereum</h5>
                                <p className="card-text">$1,640.34</p>
                                <small className="text-muted">0.84</small>
                            </div>
                            <div className="card-footer">
                                <a href="shared.html" className="btn btn-primary">Share</a>
                                <a href="shared.html" className="btn btn-primary me-2">Edit</a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="total">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total</h5>
                            <p className="card-text">$2,576.98</p>
                        </div>
                    </div>
                </section>
                <section className="add-investments">
                    <h3>Add Investment</h3>
                    <div class="inputs">
                        <div>
                            <span>Investment</span>
                            <input type="text" placeholder="Berkshire Hathaway" />
                        </div>
                        <div>
                            <span>Amount</span>
                            <input type="text" placeholder="278.3" />
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">Add Information</button>
                </section>
            </div>
        </main>
    );
}