import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shared.css';

export function Shared() {
  return (
    <main class="bg-secondary">
        <div class="container">
            <div class="player-name">Username</div>
            <section class="investments">
                <h3 class="top-head">Shared Investments</h3>
                <div class="card-group">
                    <div class="card">
                        <div class="card-header">@elonmusk</div>
                        <div class="card-body">
                            <h5 class="card-title">Solana</h5>
                            <p class="card-text">$43.20</p>
                            <small class="text-muted">4.52</small>
                        </div>
                        <div class="card-footer">
                            <a href="shared.html" class="btn btn-primary">Share</a>
                            <a href="shared.html" class="btn btn-primary me-2">Edit</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">@realdonald</div>
                        <div class="card-body">
                            <h5 class="card-title">Nvidia</h5>
                            <p class="card-text">$8,492.75</p>
                            <small class="text-muted">16.33</small>
                        </div>
                        <div class="card-footer">
                            <a href="shared.html" class="btn btn-primary">Share</a>
                            <a href="shared.html" class="btn btn-primary me-2">Edit</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">@satoshi</div>
                        <div class="card-body">
                            <h5 class="card-title">Sui</h5>
                            <p class="card-text">$67.45</p>
                            <small class="text-muted">31.03</small>
                        </div>
                        <div class="card-footer">
                            <a href="shared.html" class="btn btn-primary">Share</a>
                            <a href="shared.html" class="btn btn-primary me-2">Edit</a>
                        </div>
                    </div>
                </div>
            </section>
            <section class="share-investments">
                <h3>Share Investment</h3>
                <div class="inputs">
                    <div>
                        <span>Investment</span>
                        <input type="text" placeholder="Berkshire Hathaway" />
                    </div>
                    <div>
                        <span>User</span>
                        <input type="text" placeholder="jackdorsey" />
                    </div>
                </div>
                <button class="btn btn-primary" type="submit">Share Now</button>
            </section>
        </div>
    </main>
  );
}