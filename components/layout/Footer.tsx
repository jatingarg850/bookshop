import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Radhe Stationery</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for all stationery needs. Quality products, affordable prices, exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">f</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">𝕏</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=books" className="text-gray-400 hover:text-white transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/products?category=art" className="text-gray-400 hover:text-white transition-colors">
                  Art & Craft
                </Link>
              </li>
              <li>
                <Link href="/products?category=stationery" className="text-gray-400 hover:text-white transition-colors">
                  Stationery
                </Link>
              </li>
              <li>
                <Link href="/products?category=craft" className="text-gray-400 hover:text-white transition-colors">
                  Craft Supplies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 flex-shrink-0">📍</span>
                <span className="text-gray-400">
                  123 Main Street, Commerce Area, Your City - 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary-400 flex-shrink-0">📞</span>
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary-400 flex-shrink-0">✉️</span>
                <span className="text-gray-400">info@radhe-stationery.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-primary-400 flex-shrink-0">🕐</span>
                <div className="text-gray-400">
                  <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                  <div>Sunday: 10:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                Subscribe to our newsletter for special offers and new product updates.
              </p>
            </div>
            <div className="md:w-1/2 md:ml-8">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              © 2024 Radhe Stationery. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-white transition-colors mr-6">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors mr-6">Terms of Service</Link>
              <Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
