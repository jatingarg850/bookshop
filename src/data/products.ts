export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description?: string;
};

export const products: Product[] = [
  { id: 'b1', name: 'The Pragmatic Programmer', category: 'Books', price: 29.99, inStock: true, description: 'Software craftsmanship essentials.' },
  { id: 'b2', name: 'Clean Code', category: 'Books', price: 24.99, inStock: true, description: 'Principles for writing maintainable code.' },
  { id: 'a1', name: 'Watercolor Paint Set', category: 'Art & craft', price: 15.5, inStock: true },
  { id: 's1', name: 'Spiral Notebook', category: 'Stationery', price: 3.5, inStock: true },
  { id: 's2', name: 'Gel Pens Set', category: 'Stationery', price: 6.0, inStock: false },
  { id: 'e1', name: 'Noise-cancelling Headphones', category: 'Electronics', price: 99.99, inStock: true },
  { id: 'b3', name: 'You Don’t Know JS', category: 'Books', price: 19.99, inStock: true },
];
