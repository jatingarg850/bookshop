'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getProducts } from '../lib/db';
import type { Product } from '../lib/db';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Mystery', 'Self-Help', 'Science Fiction', 'Romance'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <div className="body" data-page="shop">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Shop Books</h1>
              <p className="page-subtitle">Browse our extensive collection of books</p>
              
              {/* Category Filter */}
              <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: selectedCategory === category ? '#050505' : '#f9f9f9',
                        color: selectedCategory === category ? '#fff' : '#050505',
                        border: selectedCategory === category ? 'none' : '1px solid #c4a177',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="books-grid" style={{ marginTop: '2rem' }}>
                {filteredProducts.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
                    No products found in this category
                  </p>
                ) : (
                  filteredProducts.map(product => (
                    <div key={product.id} className="book-card">
                      <img src={product.image} alt={product.title} />
                      <h3>{product.title}</h3>
                      <p className="author">By {product.author}</p>
                      <p style={{ fontSize: '0.85rem', color: '#6a4a2a', margin: '0.25rem 0' }}>
                        {product.category}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#2c2520', margin: '0.5rem 0', lineHeight: '1.4' }}>
                        {product.description}
                      </p>
                      <p className="price">${product.price.toFixed(2)}</p>
                      <p style={{ fontSize: '0.8rem', color: '#999', margin: '0.25rem 0' }}>
                        Stock: {product.stock}
                      </p>
                      <button className="btn btn-dark">Add to Cart</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

