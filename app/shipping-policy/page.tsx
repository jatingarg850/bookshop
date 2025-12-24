'use client';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function ShippingPolicy() {
  return (
    <>
      <div className="body" data-page="shipping">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Shipping Policy</h1>
              <p className="page-subtitle">Fast and reliable delivery to your doorstep</p>

              <div style={{ maxWidth: '800px', margin: '2rem auto', lineHeight: '1.8', color: '#2c2520' }}>
                <h2>Shipping Methods</h2>
                <p>We offer several shipping options to meet your needs:</p>

                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ marginTop: 0 }}>Standard Shipping</h3>
                  <p><strong>Delivery Time:</strong> 5-7 business days</p>
                  <p><strong>Cost:</strong> Free on orders over $50, $5.99 for orders under $50</p>
                </div>

                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ marginTop: 0 }}>Express Shipping</h3>
                  <p><strong>Delivery Time:</strong> 2-3 business days</p>
                  <p><strong>Cost:</strong> $12.99</p>
                </div>

                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ marginTop: 0 }}>Overnight Shipping</h3>
                  <p><strong>Delivery Time:</strong> Next business day</p>
                  <p><strong>Cost:</strong> $24.99</p>
                </div>

                <h2>Processing Time</h2>
                <p>
                  Orders are processed within 1-2 business days. Processing time does not include weekends or holidays. You'll receive a tracking number via email once your order ships.
                </p>

                <h2>Shipping Destinations</h2>
                <p>We currently ship to:</p>
                <ul>
                  <li>All 50 United States</li>
                  <li>Canada</li>
                  <li>United Kingdom</li>
                  <li>Australia</li>
                  <li>Select international destinations</li>
                </ul>

                <h2>International Shipping</h2>
                <p>
                  International orders may be subject to customs duties and taxes. These charges are the responsibility of the recipient. Delivery times for international orders typically range from 10-21 business days depending on the destination.
                </p>

                <h2>Tracking Your Order</h2>
                <p>
                  Once your order ships, you'll receive an email with a tracking number. You can use this number to monitor your package's progress in real-time.
                </p>

                <h2>Shipping Delays</h2>
                <p>
                  While we strive to meet all delivery dates, unforeseen circumstances such as weather, natural disasters, or carrier delays may impact delivery times. We are not responsible for delays caused by factors beyond our control.
                </p>

                <h2>Lost or Damaged Packages</h2>
                <p>
                  If your package arrives damaged or is lost in transit, please contact us immediately with:
                </p>
                <ul>
                  <li>Your order number</li>
                  <li>Tracking number</li>
                  <li>Photos of the damage (if applicable)</li>
                </ul>
                <p>
                  We'll work with the carrier to investigate and resolve the issue, which may include sending a replacement or issuing a refund.
                </p>

                <h2>Free Shipping Promotion</h2>
                <p>
                  Enjoy free standard shipping on all orders over $50! This promotion applies to domestic orders only.
                </p>

                <h2>Contact Us</h2>
                <p>
                  For shipping inquiries, please contact us at:{' '}
                  <a href="mailto:shipping@bookstore.com" style={{ color: '#c4a177', textDecoration: 'none' }}>
                    shipping@bookstore.com
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
