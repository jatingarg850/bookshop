'use client';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <>
      <div className="body" data-page="about">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">About Us</h1>
              <p className="page-subtitle">Discover the story behind BookStore</p>
              
              <div style={{ marginTop: '3rem', lineHeight: '1.8' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <h2>Our Mission</h2>
                  <p>
                    At BookStore, we believe that books have the power to transform lives, inspire minds, and connect communities. 
                    Our mission is to make quality literature accessible to everyone, regardless of their background or location.
                  </p>

                  <h2 style={{ marginTop: '2rem' }}>Our Story</h2>
                  <p>
                    Founded in 2020, BookStore started as a small passion project by a group of book enthusiasts who wanted to 
                    create a platform where readers could discover their next favorite book. What began as a simple idea has 
                    grown into a thriving community of thousands of book lovers.
                  </p>

                  <h2 style={{ marginTop: '2rem' }}>What We Offer</h2>
                  <ul style={{ fontSize: '1rem', color: '#2c2520' }}>
                    <li>Curated collections of bestselling and indie books</li>
                    <li>Personalized book recommendations</li>
                    <li>Exclusive author interviews and events</li>
                    <li>Fast and reliable shipping worldwide</li>
                    <li>A supportive community of readers</li>
                  </ul>

                  <h2 style={{ marginTop: '2rem' }}>Our Values</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                      <h3 style={{ marginTop: 0 }}>Quality</h3>
                      <p>We carefully select every book to ensure the highest quality for our readers.</p>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                      <h3 style={{ marginTop: 0 }}>Community</h3>
                      <p>We foster a welcoming space where readers can connect and share their love of books.</p>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                      <h3 style={{ marginTop: 0 }}>Innovation</h3>
                      <p>We continuously improve our platform to provide the best reading experience.</p>
                    </div>
                  </div>

                  <h2 style={{ marginTop: '2rem' }}>Contact Us</h2>
                  <p>
                    Have questions? We'd love to hear from you! Reach out to us at{' '}
                    <a href="mailto:hello@bookstore.com" style={{ color: '#c4a177', textDecoration: 'none' }}>
                      hello@bookstore.com
                    </a>
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
