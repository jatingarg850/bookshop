'use client';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="body" data-page="privacy">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Privacy Policy</h1>
              <p className="page-subtitle">Last updated: December 2024</p>

              <div style={{ maxWidth: '800px', margin: '2rem auto', lineHeight: '1.8', color: '#2c2520' }}>
                <h2>1. Introduction</h2>
                <p>
                  BookStore ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                <ul>
                  <li><strong>Personal Data:</strong> Name, email address, phone number, shipping address, and billing address when you make a purchase or create an account.</li>
                  <li><strong>Payment Information:</strong> Credit card details and other payment information (processed securely through third-party payment processors).</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and links clicked.</li>
                  <li><strong>Device Information:</strong> Browser type, IP address, operating system, and device identifiers.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Respond to your inquiries and customer service requests</li>
                  <li>Send promotional emails and newsletters (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraudulent transactions</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Sharing Your Information</h2>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                </p>
                <ul>
                  <li>Service providers who assist us in operating our website and conducting our business</li>
                  <li>Payment processors to process your transactions</li>
                  <li>Shipping partners to deliver your orders</li>
                  <li>Law enforcement when required by law</li>
                </ul>

                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>

                <h2>7. Cookies</h2>
                <p>
                  Our website uses cookies to enhance your experience. You can control cookie settings through your browser preferences.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:{' '}
                  <a href="mailto:privacy@bookstore.com" style={{ color: '#c4a177', textDecoration: 'none' }}>
                    privacy@bookstore.com
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
