'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface Book {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string;
}

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('featuredBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Save books to localStorage
  const saveBooks = (updatedBooks: Book[]) => {
    localStorage.setItem('featuredBooks', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.price || !formData.image) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      // Update existing book
      const updatedBooks = books.map(book =>
        book.id === editingId
          ? { ...book, ...formData }
          : book
      );
      saveBooks(updatedBooks);
      setEditingId(null);
    } else {
      // Add new book
      const newBook: Book = {
        id: Date.now().toString(),
        ...formData
      };
      saveBooks([...books, newBook]);
    }

    setFormData({ title: '', author: '', price: '', image: '' });
  };

  const handleEditBook = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
    });
    setEditingId(book.id);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      saveBooks(books.filter(book => book.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', author: '', price: '', image: '' });
    setEditingId(null);
  };

  return (
    <>
      <div className="body" data-page="admin">
        <Navbar />
        <div className="page_wrapper">
          <section className="section section-light">
            <div className="container">
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Manage featured books</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Form Section */}
                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '1rem' }}>
                  <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
                  <form onSubmit={handleAddBook}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Book Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #c4a177',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Author
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Enter author name"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #c4a177',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., $24.99"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #c4a177',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="e.g., /pexels-photo-45717.webp"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #c4a177',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="submit" className="btn btn-dark" style={{ flex: 1 }}>
                        {editingId ? 'Update Book' : 'Add Book'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="btn btn-ghost"
                          style={{ flex: 1 }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Books List Section */}
                <div>
                  <h2 style={{ marginTop: 0 }}>Featured Books ({books.length})</h2>
                  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {books.length === 0 ? (
                      <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                        No books added yet
                      </p>
                    ) : (
                      books.map(book => (
                        <div
                          key={book.id}
                          style={{
                            background: '#f9f9f9',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                            <img
                              src={book.image}
                              alt={book.title}
                              style={{
                                width: '60px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '0.25rem'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>
                                {book.title}
                              </h4>
                              <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#666' }}>
                                {book.author}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#c4a177' }}>
                                {book.price}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEditBook(book)}
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                background: '#050505',
                                color: '#fff',
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
                              onClick={() => handleDeleteBook(book.id)}
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                background: '#e74c3c',
                                color: '#fff',
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
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
