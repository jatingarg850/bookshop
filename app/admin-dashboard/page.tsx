'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeAuthToken } from '../lib/auth';
import { getProducts, saveProducts, addProduct, updateProduct, deleteProduct, getOrders, getUsers, getNewsletterSubscribers } from '../lib/db';
import type { Product } from '../lib/db';

type TabType = 'dashboard' | 'products' | 'orders' | 'users' | 'newsletter';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    category: '',
    description: '',
    stock: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin-login');
      return;
    }

    setProducts(getProducts());
    setOrders(getOrders());
    setUsers(getUsers());
    setNewsletter(getNewsletterSubscribers());
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin-login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price || !formData.image || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock),
      });
    } else {
      addProduct({
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock),
      });
    }

    setProducts(getProducts());
    setFormData({ title: '', author: '', price: '', image: '', category: '', description: '', stock: '' });
    setEditingId(null);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      title: product.title,
      author: product.author,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', author: '', price: '', image: '', category: '', description: '', stock: '' });
    setEditingId(null);
  };

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#050505' }}>
          BookStore Admin
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          background: 'white',
          borderRight: '1px solid #e0e0e0',
          padding: '1.5rem 0'
        }}>
          {(['dashboard', 'products', 'orders', 'users', 'newsletter'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: 'none',
                background: activeTab === tab ? '#eaf4ff' : 'transparent',
                borderLeft: activeTab === tab ? '4px solid #c4a177' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? '#050505' : '#666',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#050505' }}>Dashboard Overview</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Total Revenue</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#c4a177' }}>
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Total Orders</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#050505' }}>
                    {totalOrders}
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Total Users</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#050505' }}>
                    {totalUsers}
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Total Products</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#050505' }}>
                    {totalProducts}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0 }}>Recent Orders</h3>
                {orders.length === 0 ? (
                  <p style={{ color: '#999' }}>No orders yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Order ID</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Total</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order: any) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '0.75rem' }}>{order.id}</td>
                          <td style={{ padding: '0.75rem' }}>${order.total?.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: '#eaf4ff',
                              color: '#050505',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#050505' }}>Manage Products</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Form */}
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleAddProduct}>
                    {[
                      { name: 'title', label: 'Title', type: 'text' },
                      { name: 'author', label: 'Author', type: 'text' },
                      { name: 'price', label: 'Price', type: 'number' },
                      { name: 'stock', label: 'Stock', type: 'number' },
                      { name: 'image', label: 'Image URL', type: 'text' },
                      { name: 'category', label: 'Category', type: 'select' },
                    ].map(field => (
                      <div key={field.name} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              border: '1px solid #c4a177',
                              borderRadius: '0.4rem',
                              fontSize: '0.9rem',
                              fontFamily: 'inherit',
                              boxSizing: 'border-box'
                            }}
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Self-Help">Self-Help</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Romance">Romance</option>
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              border: '1px solid #c4a177',
                              borderRadius: '0.4rem',
                              fontSize: '0.9rem',
                              fontFamily: 'inherit',
                              boxSizing: 'border-box'
                            }}
                            required
                          />
                        )}
                      </div>
                    ))}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          border: '1px solid #c4a177',
                          borderRadius: '0.4rem',
                          fontSize: '0.9rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          background: '#050505',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.4rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        {editingId ? 'Update' : 'Add'} Product
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={handleCancel}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            background: '#e0e0e0',
                            color: '#050505',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Products List */}
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ marginTop: 0 }}>Products ({products.length})</h3>
                  {products.length === 0 ? (
                    <p style={{ color: '#999' }}>No products yet</p>
                  ) : (
                    products.map(product => (
                      <div
                        key={product.id}
                        style={{
                          background: '#f9f9f9',
                          padding: '1rem',
                          borderRadius: '0.4rem',
                          marginBottom: '0.75rem',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              width: '50px',
                              height: '70px',
                              objectFit: 'cover',
                              borderRadius: '0.25rem'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{product.title}</h4>
                            <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#666' }}>
                              {product.author} • {product.category}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: '#c4a177' }}>
                              ${product.price.toFixed(2)} • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              background: '#050505',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              background: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#050505' }}>Orders</h2>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {orders.length === 0 ? (
                  <p style={{ color: '#999' }}>No orders yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Order ID</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>User ID</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Total</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '0.75rem' }}>{order.id}</td>
                          <td style={{ padding: '0.75rem' }}>{order.userId}</td>
                          <td style={{ padding: '0.75rem' }}>${order.total?.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: '#eaf4ff',
                              color: '#050505',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#050505' }}>Users</h2>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {users.length === 0 ? (
                  <p style={{ color: '#999' }}>No users yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>User ID</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '0.75rem' }}>{user.id}</td>
                          <td style={{ padding: '0.75rem' }}>{user.name}</td>
                          <td style={{ padding: '0.75rem' }}>{user.email}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === 'newsletter' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#050505' }}>Newsletter Subscribers</h2>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <p style={{ marginBottom: '1rem', color: '#666' }}>
                  Total Subscribers: <strong>{newsletter.length}</strong>
                </p>
                {newsletter.length === 0 ? (
                  <p style={{ color: '#999' }}>No subscribers yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Subscribed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletter.map((sub: any) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '0.75rem' }}>{sub.email}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
