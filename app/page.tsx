import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  stock: number;
}

async function getFeaturedProducts(): Promise<ProductData[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .sort('-createdAt')
      .limit(8)
      .lean() as unknown as ProductData[];
    return products;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Your Complete</span>{' '}
                  <span className="block text-primary-600 xl:inline">Stationery Store</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  From essential office supplies to creative stationery, we have everything you need for your work, study, and creative projects.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Link href="/products">
                    <Button size="lg" className="w-full sm:w-auto">
                      Shop Now →
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <img src="/logo.jpg" alt="Radhe Stationery" className="w-full max-w-md h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  ⭐
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg text-gray-900 font-semibold">Quality Products</h3>
                <p className="text-sm text-gray-600">Premium stationery from trusted brands</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  🚚
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg text-gray-900 font-semibold">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same day delivery available</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  🔒
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg text-gray-900 font-semibold">Secure Shopping</h3>
                <p className="text-sm text-gray-600">Safe and secure payment methods</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-0">
            <img src="/left-border.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-0">
            <img src="/right-border.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
                Check out our latest and most popular items
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={String(product._id)} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg">View All Products</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
