'use client';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function ReturnPolicy() {
  return (
    <>
      <div className="body" data-page="returns">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Return Policy</h1>
              <p className="page-subtitle">We want you to be completely satisfied with your purchase</p>

              <div style={{ maxWidth: '800px', margin: '2rem auto', lineHeight: '1.8', color: '#2c2520' }}>
                <h2>30-Day Return Guarantee</h2>
                <p>
                  We offer a hassle-free 30-day return policy. If you're not completely satisfied with your purchase, you can return it within 30 days of receipt for a full refund.
                </p>

                <h2>Return Conditions</h2>
                <p>To be eligible for a return, your item must meet the following conditions:</p>
                <ul>
                  <li>The book must be in its original condition</li>
                  <li>All pages must be intact and unwritten</li>
                  <li>The dust jacket (if applicable) must be undamaged</li>
                  <li>The book must not show signs of heavy use or wear</li>
                  <li>Original packaging and receipt must be included</li>
                </ul>

                <h2>How to Return an Item</h2>
                <ol>
                  <li>Contact our customer service team at returns@bookstore.com with your order number</li>
                  <li>Receive a return shipping label via email</li>
                  <li>Pack the book securely in its original packaging</li>
                  <li>Ship the package using the provided label</li>
                  <li>Once received and inspected, we'll process your refund within 5-7 business days</li>
                </ol>

                <h2>Refund Process</h2>
                <p>
                  Refunds will be issued to your original payment method. Please allow 5-7 business days for the refund to appear in your account. Depending on your bank, it may take an additional 1-2 business days for the funds to be fully processed.
                </p>

                <h2>Shipping Costs</h2>
                <p>
                  Original shipping costs are non-refundable. However, we provide a prepaid return shipping label for your convenience.
                </p>

                <h2>Damaged or Defective Items</h2>
                <p>
                  If you receive a damaged or defective book, please contact us immediately with photos of the damage. We'll arrange a replacement or full refund at no cost to you.
                </p>

                <h2>Non-Returnable Items</h2>
                <p>The following items cannot be returned:</p>
                <ul>
                  <li>Clearance or final sale items</li>
                  <li>Digital or e-book purchases</li>
                  <li>Items purchased more than 30 days ago</li>
                  <li>Items showing signs of heavy use or damage</li>
                </ul>

                <h2>Contact Us</h2>
                <p>
                  For return inquiries, please contact us at:{' '}
                  <a href="mailto:returns@bookstore.com" style={{ color: '#c4a177', textDecoration: 'none' }}>
                    returns@bookstore.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
