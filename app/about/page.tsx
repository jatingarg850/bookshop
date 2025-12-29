import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">About</span>
              <span className="block text-primary-600">Radhe Stationery</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              Your trusted partner for quality stationery and school supplies
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-0">
          <img src="/left-border.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-0">
          <img src="/right-border.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Our Story */}
              <Card className="shadow-lg">
                <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
                <p className="text-gray-700 leading-relaxed">
                  Radhe Stationery was founded with a simple mission: to make quality school books, art supplies, and stationery accessible to every student and creative individual in India. We believe that the right tools can inspire creativity and help students excel in their studies.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  What started as a small local shop has grown into a trusted online destination for stationery lovers across the country. We remain committed to our core values of quality, affordability, and customer satisfaction.
                </p>
              </Card>

              {/* Our Mission */}
              <Card className="shadow-lg">
                <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  We are committed to providing a curated selection of high-quality products at competitive prices. Our team carefully selects each item to ensure it meets our standards for quality, durability, and value. Whether you're a student, artist, or professional, we have something for everyone.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Our mission extends beyond just selling products. We aim to support education and creativity by making premium stationery affordable and accessible to all.
                </p>
              </Card>

              {/* Why Choose Us */}
              <Card className="shadow-lg">
                <h2 className="font-heading text-2xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Wide selection of products across all categories</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Competitive pricing and regular discounts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Fast and reliable delivery across India</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Easy returns and hassle-free customer support</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Secure payment options and data protection</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl text-primary-600 flex-shrink-0">✓</span>
                    <span>Authentic products from trusted brands</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="shadow-lg sticky top-24">
                <h2 className="font-heading text-xl font-bold mb-6 text-gray-900">Quick Info</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📧 Email</p>
                    <p className="font-semibold text-gray-900">sre.haryana24@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📞 Phone</p>
                    <p className="font-semibold text-gray-900">+91 98217 38866</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📍 Address</p>
                    <p className="font-semibold text-gray-900">
                      J - 90 , DLF , Sector 10<br />
                      Faridabad<br />
                      Haryana - 121006
                    </p>
                  </div>
                  <div>
                   
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
