'use client';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Featured() {
  return (
    <>
      <div className="body" data-page="featured">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Featured Books</h1>
              <p className="page-subtitle">Discover our handpicked collection of bestselling books</p>
              
              <div className="books-grid" style={{ marginTop: '3rem' }}>
                <div className="book-card">
                  <img src="/pexels-photo-45717.webp" alt="Book 1" />
                  <h3>The Art of Reading</h3>
                  <p className="author">By Jane Smith</p>
                  <p className="price">$24.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
                </div>
                <div className="book-card">
                  <img src="/glasses-resting-on-stack-of-teal-books-with-mug-in-soft-natural-light-free-photo.jpeg" alt="Book 2" />
                  <h3>Journey Through Time</h3>
                  <p className="author">By John Doe</p>
                  <p className="price">$22.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
                </div>
                <div className="book-card">
                  <img src="/gettyimages-1455958786-612x612.jpg" alt="Book 3" />
                  <h3>Whispers of Tomorrow</h3>
                  <p className="author">By Sarah Johnson</p>
                  <p className="price">$26.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
                </div>
                <div className="book-card">
                  <img src="/download.jpeg" alt="Book 4" />
                  <h3>Echoes of the Past</h3>
                  <p className="author">By Michael Chen</p>
                  <p className="price">$23.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
                </div>
                <div className="book-card">
                  <img src="/pexels-photo-45717.webp" alt="Book 5" />
                  <h3>Midnight Chronicles</h3>
                  <p className="author">By Emma Wilson</p>
                  <p className="price">$25.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
                </div>
                <div className="book-card">
                  <img src="/glasses-resting-on-stack-of-teal-books-with-mug-in-soft-natural-light-free-photo.jpeg" alt="Book 6" />
                  <h3>The Silent Garden</h3>
                  <p className="author">By David Brown</p>
                  <p className="price">$27.99</p>
                  <button className="btn btn-dark">Add to Cart</button>
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
