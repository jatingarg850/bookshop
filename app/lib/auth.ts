// Simple authentication utility
export const ADMIN_CREDENTIALS = {
  email: 'admin@bookstore.com',
  password: 'admin123'
};

export const validateAdminLogin = (email: string, password: string): boolean => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
