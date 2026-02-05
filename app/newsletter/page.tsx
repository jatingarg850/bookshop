'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { subscribeNewsletter } from '../lib/db';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('Please enter a valid email.');
      return;
    }
    try {
      subscribeNewsletter(email);
      setStatus('Subscribed — thank you!');
      setEmail('');
      setName('');
      setGenre('');
    } catch (err) {
      setStatus('Subscription failed. Try again.');
    }
  };

  return (
    <>
      <div className="body" data-page="newsletter">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Join Our Newsletter</h1>
              <p className="page-subtitle">Stay updated with the latest book releases and exclusive offers</p>

              <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '1rem' }}>
                  <h2 style={{ marginTop: 0 }}>Subscribe Today</h2>
                  <p>Get exclusive book recommendations, special discounts, and early access to new releases delivered straight to your inbox.</p>

                  <form onSubmit={handleSubmit} className="newsletter-form" style={{ flexDirection: 'column', maxWidth: '100%' }}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ marginBottom: '1rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ marginBottom: '1rem' }}
                    />
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        border: '1px solid #c4a177',
                        borderRadius: '999px',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        marginBottom: '1rem',
                      }}
                    >
                      <option value="">Select your favorite genre</option>
                      <option>Fiction</option>
                      <option>Non-Fiction</option>
                      <option>Mystery</option>
                      <option>Self-Help</option>
                      <option>Science Fiction</option>
                      <option>Romance</option>
                    </select>
                    <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>
                      Subscribe
                    </button>
                  </form>

                  {status && (
                    <p style={{ marginTop: '1rem', color: '#6a4a2a' }}>{status}</p>
                  )}

                  <p style={{ fontSize: '0.85rem', color: '#6a4a2a', marginTop: '1rem' }}>
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
