'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateAdminLogin, setAuthToken } from '../lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (validateAdminLogin(email, password)) {
      setAuthToken('admin-token-' + Date.now());
      router.push('/admin-dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eaf4ff 0%, #f0e6d2 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        maxWidth: '400px',
        width: '100%',
        margin: '0 1rem'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: '#050505'
        }}>
          Admin Login
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6a4a2a',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          Enter your credentials to access the admin panel
        </p>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#050505'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bookstore.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #c4a177',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#050505'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #c4a177',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#050505',
              color: '#f9f4ed',
              border: 'none',
              borderRadius: '999px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 0.5rem' }}>Demo Credentials:</p>
          <p style={{ margin: '0.25rem 0' }}>Email: admin@bookstore.com</p>
          <p style={{ margin: '0.25rem 0' }}>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
