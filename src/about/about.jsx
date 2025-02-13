import React from 'react';
import './about.css';

export function About() {
  return (
    <main className="container-fluid bg-secondary text-center">
        <div>
            <div id="picture"><img className="image" src="public/quote.jpg" alt="image" /></div>
            <p>
                myDinero is not like other financial software.
            </p>
            <p>
                It's not built for professional day traders or fancy stock brokers.
                It's not built for incredibly rich people who need to check their wealth to feel valued.
                It's not built for people who can already afford any other financial tools they could need.
                It's not for the 1% of the 1%, the elites who seem to control all finance.
            </p>
            <p>
                It's built for ordinary people like you and me.
            </p>
            <div id="quote" className="quote-box bg-light text-dark">
                <p className="quote">myDinero's purpose is to help increase the financial literacy of the world.</p>
            </div>
        </div>
    </main>
  );
}