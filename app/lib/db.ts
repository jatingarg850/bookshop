// Database utilities using localStorage
export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  products: { productId: string; quantity: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribedAt: string;
}

// Products
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('products');
  return data ? JSON.parse(data) : getDefaultProducts();
};

export const getDefaultProducts = (): Product[] => {
  return [
    {
      id: '1',
      title: 'The Art of Reading',
      author: 'Jane Smith',
      price: 24.99,
      image: '/pexels-photo-45717.webp',
      category: 'Fiction',
      description: 'A captivating journey through the world of literature and storytelling.',
      stock: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Journey Through Time',
      author: 'John Doe',
      price: 22.99,
      image: '/glasses-resting-on-stack-of-teal-books-with-mug-in-soft-natural-light-free-photo.jpeg',
      category: 'Non-Fiction',
      description: 'Explore historical events and their impact on modern society.',
      stock: 35,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Whispers of Tomorrow',
      author: 'Sarah Johnson',
      price: 26.99,
      image: '/gettyimages-1455958786-612x612.jpg',
      category: 'Mystery',
      description: 'A thrilling mystery that will keep you guessing until the end.',
      stock: 42,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Echoes of the Past',
      author: 'Michael Chen',
      price: 23.99,
      image: '/download.jpeg',
      category: 'Fiction',
      description: 'Discover the secrets hidden in the echoes of history.',
      stock: 28,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const saveProducts = (products: Product[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('products', JSON.stringify(products));
  }
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const products = getProducts();
  saveProducts([...products, newProduct]);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  saveProducts(products.filter(p => p.id !== id));
};

// Orders
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('orders');
  return data ? JSON.parse(data) : [];
};

export const saveOrders = (orders: Order[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

// Users
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// Newsletter
export const getNewsletterSubscribers = (): Newsletter[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('newsletter');
  return data ? JSON.parse(data) : [];
};

export const saveNewsletterSubscribers = (subscribers: Newsletter[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('newsletter', JSON.stringify(subscribers));
  }
};

export const subscribeNewsletter = (email: string): void => {
  const subscribers = getNewsletterSubscribers();
  if (!subscribers.find(s => s.email === email)) {
    subscribers.push({
      id: Date.now().toString(),
      email,
      subscribedAt: new Date().toISOString(),
    });
    saveNewsletterSubscribers(subscribers);
  }
};
